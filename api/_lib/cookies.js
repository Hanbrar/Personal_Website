export function parseCookies(req) {
  const header = req.headers.cookie || ""
  const out = {}
  for (const pair of header.split(";")) {
    const idx = pair.indexOf("=")
    if (idx === -1) continue
    const key = pair.slice(0, idx).trim()
    const value = pair.slice(idx + 1).trim()
    if (!key) continue
    out[key] = decodeURIComponent(value)
  }
  return out
}

export function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`]
  parts.push(`Path=${options.path || "/"}`)
  if (options.httpOnly !== false) parts.push("HttpOnly")
  if (options.secure !== false) parts.push("Secure")
  parts.push(`SameSite=${options.sameSite || "Lax"}`)
  if (typeof options.maxAge === "number") parts.push(`Max-Age=${options.maxAge}`)
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`)
  return parts.join("; ")
}
