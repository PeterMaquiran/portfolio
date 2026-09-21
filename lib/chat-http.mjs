import { getSession, loginAdmin, logoutAdmin } from './chat-db.mjs'
import { ADMIN_COOKIE, parseCookies } from './chat-util.mjs'

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      if (!chunks.length) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(new Error('invalid json'))
      }
    })
    req.on('error', reject)
  })
}

function send(res, status, body, headers = {}) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    ...headers,
  })
  res.end(payload)
}

function cookieHeader(token, clear = false) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  if (clear) {
    return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
  }
  return `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${secure}`
}

export function adminTokenFromRequest(req) {
  return parseCookies(req.headers.cookie)[ADMIN_COOKIE] || ''
}

export async function handleChatRequest(req, res) {
  const url = new URL(req.url || '/', 'http://localhost')
  const path = url.pathname.replace(/\/$/, '') || '/'

  if (req.method === 'POST' && path === '/api/chat/login') {
    let body
    try {
      body = await readJson(req)
    } catch {
      send(res, 400, { ok: false, error: 'Invalid JSON.' })
      return
    }
    const session = loginAdmin(body.username, body.password)
    if (!session) {
      send(res, 401, { ok: false, error: 'Invalid credentials.' })
      return
    }
    send(
      res,
      200,
      { ok: true, username: session.username },
      { 'set-cookie': cookieHeader(session.token) },
    )
    return
  }

  if (req.method === 'POST' && path === '/api/chat/logout') {
    logoutAdmin(adminTokenFromRequest(req))
    send(res, 200, { ok: true }, { 'set-cookie': cookieHeader('', true) })
    return
  }

  if (req.method === 'GET' && path === '/api/chat/me') {
    const session = getSession(adminTokenFromRequest(req))
    if (!session) {
      send(res, 401, { ok: false })
      return
    }
    send(res, 200, { ok: true })
    return
  }

  send(res, 404, { ok: false, error: 'Not found.' })
}
