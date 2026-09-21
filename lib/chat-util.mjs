const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuid(value) {
  return UUID_RE.test(String(value || ''))
}

export function parseCookies(header) {
  const cookies = {}
  for (const part of String(header || '').split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (key) cookies[key] = decodeURIComponent(value)
  }
  return cookies
}

export function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim().replace(/^::ffff:/, '')
  }
  const real = req.headers['x-real-ip']
  if (typeof real === 'string' && real.trim()) {
    return real.trim().replace(/^::ffff:/, '')
  }
  return String(req.socket?.remoteAddress || '')
    .replace(/^::ffff:/, '')
    .replace(/^::1$/, '127.0.0.1')
}

export function headerCountry(req) {
  const raw =
    req.headers['cf-ipcountry'] ||
    req.headers['x-vercel-ip-country'] ||
    req.headers['x-country-code']
  const code = String(raw || '')
    .trim()
    .toUpperCase()
  if (!code || code === 'XX' || code === 'T1') return null
  return code
}

export function countryName(code) {
  if (!code) return 'Unknown'
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

export async function lookupGeo(ip, codeFromHeader) {
  if (codeFromHeader) {
    return { countryCode: codeFromHeader, country: countryName(codeFromHeader) }
  }
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('10.') || ip.startsWith('192.168.')) {
    return { countryCode: 'LO', country: 'Local' }
  }

  try {
    const response = await fetch(
      `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country,country_code`,
      { signal: AbortSignal.timeout(2500) },
    )
    const data = await response.json()
    if (data?.success && data.country) {
      return {
        countryCode: String(data.country_code || ''),
        country: String(data.country),
      }
    }
  } catch {
    // Keep chat usable without geo.
  }

  return { countryCode: '', country: 'Unknown' }
}

export function normalizeText(raw) {
  return String(raw ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000)
}

export const ADMIN_COOKIE = 'admin_session'
