import { serializeCookie } from "../../_lib/cookies.js"

const SESSION_COOKIE = "hb_admin_session"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  res.setHeader(
    "Set-Cookie",
    serializeCookie(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 0,
      path: "/"
    })
  )
  res.status(200).json({ ok: true })
}
