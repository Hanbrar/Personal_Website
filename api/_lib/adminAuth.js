import { requiredEnv } from "./config.js"
import { decodeSigned, isExpired } from "./session.js"
import { parseCookies } from "./cookies.js"

const SESSION_COOKIE = "hb_admin_session"

export function requireAdminSession(req) {
  const sessionSecret = requiredEnv("SESSION_SECRET")
  const adminUsername = requiredEnv("ADMIN_GITHUB_USERNAME").toLowerCase()

  const cookies = parseCookies(req)
  const token = cookies[SESSION_COOKIE]
  const payload = decodeSigned(token, sessionSecret)
  if (!payload || isExpired(payload)) {
    return { ok: false, error: "Unauthorized" }
  }

  if (typeof payload.username !== "string" || payload.username.toLowerCase() !== adminUsername) {
    return { ok: false, error: "Forbidden" }
  }

  if (typeof payload.accessToken !== "string" || !payload.accessToken) {
    return { ok: false, error: "Missing GitHub token" }
  }

  return {
    ok: true,
    username: payload.username,
    accessToken: payload.accessToken
  }
}
