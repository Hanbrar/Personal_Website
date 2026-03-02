import { requiredEnv, getAppBaseUrl } from "../../_lib/config.js"
import { parseCookies, serializeCookie } from "../../_lib/cookies.js"
import { createSessionPayload, decodeSigned, encodeSigned, isExpired } from "../../_lib/session.js"

const STATE_COOKIE = "hb_oauth_state"
const SESSION_COOKIE = "hb_admin_session"

async function exchangeCodeForToken({ code, callbackUrl, clientId, clientSecret, state }) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: callbackUrl,
      state
    })
  })
  const json = await response.json()
  if (!response.ok || !json.access_token) {
    throw new Error(json.error_description || "Failed to exchange OAuth code")
  }
  return json.access_token
}

async function fetchGithubUser(accessToken) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "hanryck-portfolio-admin"
    }
  })
  const json = await response.json()
  if (!response.ok || !json.login) {
    throw new Error("Failed to fetch GitHub user")
  }
  return json
}

function clearCookie(name) {
  return serializeCookie(name, "", {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 0,
    path: "/"
  })
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  try {
    const clientId = requiredEnv("GITHUB_CLIENT_ID")
    const clientSecret = requiredEnv("GITHUB_CLIENT_SECRET")
    const sessionSecret = requiredEnv("SESSION_SECRET")
    const adminUsername = requiredEnv("ADMIN_GITHUB_USERNAME")

    const callbackUrl = `${getAppBaseUrl(req)}/api/auth/github/callback`
    const code = typeof req.query.code === "string" ? req.query.code : ""
    const state = typeof req.query.state === "string" ? req.query.state : ""

    const cookies = parseCookies(req)
    const stateCookie = cookies[STATE_COOKIE] || ""
    const decodedState = decodeSigned(stateCookie, sessionSecret)

    if (!code || !state || !stateCookie || stateCookie !== state || !decodedState || isExpired(decodedState)) {
      res.setHeader("Set-Cookie", clearCookie(STATE_COOKIE))
      res.redirect(302, "/admin?error=oauth_state")
      return
    }

    const accessToken = await exchangeCodeForToken({
      code,
      callbackUrl,
      clientId,
      clientSecret,
      state
    })

    const user = await fetchGithubUser(accessToken)
    const allowed = user.login.toLowerCase() === adminUsername.toLowerCase()
    if (!allowed) {
      res.setHeader("Set-Cookie", [clearCookie(STATE_COOKIE), clearCookie(SESSION_COOKIE)])
      res.redirect(302, "/admin?error=not_allowed")
      return
    }

    const sessionPayload = createSessionPayload({
      username: user.login,
      accessToken,
      ttlSeconds: 60 * 60 * 8
    })
    const sessionToken = encodeSigned(sessionPayload, sessionSecret)

    res.setHeader("Set-Cookie", [
      clearCookie(STATE_COOKIE),
      serializeCookie(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 60 * 60 * 8,
        path: "/"
      })
    ])
    res.redirect(302, "/admin?ok=1")
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "OAuth callback failed" })
  }
}
