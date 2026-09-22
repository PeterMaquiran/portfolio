import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const preset = new Set(Object.keys(process.env))

function parseEnv(source) {
  const values = {}
  for (const line of source.split(/\r?\n/)) {
    const text = line.trim()
    if (!text || text.startsWith('#')) continue
    const match = text.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    values[match[1]] = value
  }
  return values
}

function applyEnvFile(file) {
  const path = resolve(process.cwd(), file)
  if (!existsSync(path)) return
  const parsed = parseEnv(readFileSync(path, 'utf8'))
  for (const [key, value] of Object.entries(parsed)) {
    if (preset.has(key)) continue
    process.env[key] = value
  }
}

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
applyEnvFile('.env')
applyEnvFile('.env.local')
applyEnvFile(`.env.${mode}`)
applyEnvFile(`.env.${mode}.local`)
