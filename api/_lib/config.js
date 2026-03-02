export function requiredEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

export function getAppBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "https"
  const host = req.headers["x-forwarded-host"] || req.headers.host
  if (!host) throw new Error("Unable to resolve host for callback URL")
  return `${proto}://${host}`
}

export function nowUnix() {
  return Math.floor(Date.now() / 1000)
}
