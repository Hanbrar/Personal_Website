import crypto from "node:crypto"
import { requiredEnv, getAppBaseUrl } from "../../_lib/config.js"
import { serializeCookie } from "../../_lib/cookies.js"
import { encodeSigned } from "../../_lib/session.js"

const STATE_COOKIE = "hb_oauth_state"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  try {
    const clientId = requiredEnv("GITHUB_CLIENT_ID")
    const sessionSecret = requiredEnv("SESSION_SECRET")

    const callbackUrl = `${getAppBaseUrl(req)}/api/auth/github/callback`
    const stateRaw = `${crypto.randomUUID()}.${Date.now()}`
    const stateToken = encodeSigned({ value: stateRaw, exp: Math.floor(Date.now() / 1000) + 600 }, sessionSecret)

    const authUrl = new URL("https://github.com/login/oauth/authorize")
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("redirect_uri", callbackUrl)
    authUrl.searchParams.set("scope", "read:user repo")
    authUrl.searchParams.set("state", stateToken)

    res.setHeader(
      "Set-Cookie",
      serializeCookie(STATE_COOKIE, stateToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 600,
        path: "/"
      })
    )
    res.redirect(302, authUrl.toString())
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "OAuth start failed" })
  }
}
