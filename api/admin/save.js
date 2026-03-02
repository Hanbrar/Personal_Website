import { requireAdminSession } from "../_lib/adminAuth.js"
import { normalizeContentPayload } from "../_lib/content.js"
import { saveRepoJsonFile } from "../_lib/githubRepo.js"

const CONTENT_PATH = "public/content/live-content.json"

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return {}
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  try {
    const auth = requireAdminSession(req)
    if (!auth.ok) {
      res.status(401).json({ authenticated: false, error: auth.error })
      return
    }

    const body = readBody(req)
    const sha = typeof body.sha === "string" ? body.sha : ""
    if (!sha) {
      res.status(400).json({ error: "Missing content sha. Reload admin and try again." })
      return
    }

    const normalized = normalizeContentPayload(body.content)
    const now = new Date()
    const stamp = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")} ${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`
    const message = `content: update live feed/blogs - ${stamp}`

    const result = await saveRepoJsonFile({
      accessToken: auth.accessToken,
      path: CONTENT_PATH,
      contentObject: normalized,
      sha,
      message
    })

    res.status(200).json({
      ok: true,
      commitSha: result.commitSha,
      sha: result.fileSha,
      content: normalized
    })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to save content" })
  }
}
