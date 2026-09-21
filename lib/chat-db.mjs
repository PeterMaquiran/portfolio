import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const SESSION_MS = 7 * 24 * 60 * 60 * 1000

function dbPath() {
  return resolve(process.env.SQLITE_PATH || 'data/chat.db')
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':')
  if (!salt || !hash) return false
  const next = scryptSync(password, salt, 64)
  const prev = Buffer.from(hash, 'hex')
  if (prev.length !== next.length) return false
  return timingSafeEqual(prev, next)
}

let db

export function getDb() {
  if (db) return db

  const file = dbPath()
  mkdirSync(dirname(file), { recursive: true })
  db = new Database(file)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      ip TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT 'Unknown',
      country_code TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      started_at INTEGER,
      last_message_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );

    CREATE INDEX IF NOT EXISTS idx_messages_inbox
      ON messages (conversation_id, sender, created_at);

    CREATE TABLE IF NOT EXISTS conversation_ips (
      conversation_id TEXT NOT NULL,
      ip TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'Unknown',
      country_code TEXT NOT NULL DEFAULT '',
      first_seen INTEGER NOT NULL,
      last_seen INTEGER NOT NULL,
      PRIMARY KEY (conversation_id, ip),
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );
  `)

  db.prepare(
    `
    INSERT OR IGNORE INTO conversation_ips (conversation_id, ip, country, country_code, first_seen, last_seen)
    SELECT id, ip, country, country_code, created_at, COALESCE(last_message_at, created_at)
    FROM conversations
    WHERE ip != ''
  `,
  ).run()

  const adminCount = db.prepare('SELECT COUNT(*) AS n FROM admins').get()
  if (adminCount.n === 0) {
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(
      DEFAULT_USERNAME,
      hashPassword(DEFAULT_PASSWORD),
    )
  }

  return db
}

export function loginAdmin(username, password) {
  const row = getDb()
    .prepare('SELECT username, password_hash FROM admins WHERE username = ?')
    .get(String(username || '').trim())
  if (!row || !verifyPassword(String(password || ''), row.password_hash)) return null

  const token = randomBytes(32).toString('hex')
  getDb()
    .prepare('INSERT INTO sessions (token, created_at) VALUES (?, ?)')
    .run(token, Date.now())
  return { token, username: row.username }
}

export function getSession(token) {
  if (!token) return null
  const row = getDb().prepare('SELECT token, created_at FROM sessions WHERE token = ?').get(token)
  if (!row) return null
  if (Date.now() - row.created_at > SESSION_MS) {
    getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token)
    return null
  }
  return row
}

export function logoutAdmin(token) {
  if (!token) return
  getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token)
}

function recordIp({ id, ip, country, countryCode, now }) {
  if (!ip) return
  getDb()
    .prepare(
      `
      INSERT INTO conversation_ips (conversation_id, ip, country, country_code, first_seen, last_seen)
      VALUES (@id, @ip, @country, @countryCode, @now, @now)
      ON CONFLICT(conversation_id, ip) DO UPDATE SET
        country = excluded.country,
        country_code = excluded.country_code,
        last_seen = excluded.last_seen
    `,
    )
    .run({
      id,
      ip,
      country: country || 'Unknown',
      countryCode: countryCode || '',
      now,
    })
}

export function listIps(conversationId) {
  return getDb()
    .prepare(
      `
      SELECT ip, country, country_code AS countryCode, first_seen AS firstSeen, last_seen AS lastSeen
      FROM conversation_ips
      WHERE conversation_id = ?
      ORDER BY last_seen DESC
    `,
    )
    .all(conversationId)
}

export function upsertConversation({ id, ip, country, countryCode }) {
  const now = Date.now()
  getDb()
    .prepare(
      `
      INSERT INTO conversations (id, ip, country, country_code, created_at)
      VALUES (@id, @ip, @country, @countryCode, @now)
      ON CONFLICT(id) DO UPDATE SET
        ip = excluded.ip,
        country = excluded.country,
        country_code = excluded.country_code
    `,
    )
    .run({
      id,
      ip: ip || '',
      country: country || 'Unknown',
      countryCode: countryCode || '',
      now,
    })
  recordIp({ id, ip, country, countryCode, now })
  return getConversation(id)
}

export function getConversation(id) {
  return (
    getDb()
      .prepare(
        `
        SELECT
          c.*,
          (
            SELECT COUNT(*) FROM messages m
            WHERE m.conversation_id = c.id AND m.sender = 'visitor'
          ) AS pending
        FROM conversations c
        WHERE c.id = ?
      `,
      )
      .get(id) || null
  )
}

export function listConversations() {
  return getDb()
    .prepare(
      `
      SELECT
        c.*,
        (
          SELECT COUNT(*) FROM messages m
          WHERE m.conversation_id = c.id AND m.sender = 'visitor'
        ) AS pending
      FROM conversations c
      ORDER BY COALESCE(c.last_message_at, c.created_at) DESC
    `,
    )
    .all()
}

export function startConversation(id) {
  const now = Date.now()
  const result = getDb()
    .prepare(
      `
      UPDATE conversations
      SET started_at = COALESCE(started_at, @now)
      WHERE id = @id
    `,
    )
    .run({ id, now })
  if (!result.changes) return null
  return getConversation(id)
}

export function insertMessage({ id, conversationId, sender, text, createdAt }) {
  const info = getDb()
    .prepare(
      `
      INSERT OR IGNORE INTO messages (id, conversation_id, sender, text, created_at)
      VALUES (@id, @conversationId, @sender, @text, @createdAt)
    `,
    )
    .run({ id, conversationId, sender, text, createdAt })

  if (info.changes) {
    getDb()
      .prepare('UPDATE conversations SET last_message_at = ? WHERE id = ?')
      .run(createdAt, conversationId)
  }

  return { duplicate: info.changes === 0 }
}

export function pendingForVisitor(conversationId) {
  return getDb()
    .prepare(
      `
      SELECT id, conversation_id AS conversationId, sender, text, created_at AS createdAt
      FROM messages
      WHERE conversation_id = ? AND sender = 'admin'
      ORDER BY created_at ASC
    `,
    )
    .all(conversationId)
}

export function pendingForAdmin(conversationId) {
  const sql = conversationId
    ? `
      SELECT id, conversation_id AS conversationId, sender, text, created_at AS createdAt
      FROM messages
      WHERE sender = 'visitor' AND conversation_id = ?
      ORDER BY created_at ASC
    `
    : `
      SELECT id, conversation_id AS conversationId, sender, text, created_at AS createdAt
      FROM messages
      WHERE sender = 'visitor'
      ORDER BY created_at ASC
    `
  return conversationId ? getDb().prepare(sql).all(conversationId) : getDb().prepare(sql).all()
}

export function ackMessages({ ids, recipient, conversationId }) {
  if (!ids?.length) return 0
  const placeholders = ids.map(() => '?').join(',')
  if (recipient === 'admin') {
    return getDb()
      .prepare(`DELETE FROM messages WHERE sender = 'visitor' AND id IN (${placeholders})`)
      .run(...ids).changes
  }
  return getDb()
    .prepare(
      `DELETE FROM messages WHERE sender = 'admin' AND conversation_id = ? AND id IN (${placeholders})`,
    )
    .run(conversationId, ...ids).changes
}

export function publicConversation(row) {
  if (!row) return null
  return {
    id: row.id,
    ip: row.ip,
    country: row.country,
    countryCode: row.country_code,
    createdAt: row.created_at,
    startedAt: row.started_at,
    lastMessageAt: row.last_message_at,
    pending: Number(row.pending || 0),
    ips: listIps(row.id),
  }
}
