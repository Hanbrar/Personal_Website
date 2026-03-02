import { requireAdminSession } from "../_lib/adminAuth.js"
import { loadRepoJsonFile } from "../_lib/githubRepo.js"
import { normalizeContentPayload } from "../_lib/content.js"

const CONTENT_PATH = "public/content/live-content.json"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  try {
    const auth = requireAdminSession(req)
    if (!auth.ok) {
      res.status(401).json({ authenticated: false, error: auth.error })
      return
    }

    const { sha, content } = await loadRepoJsonFile({
      accessToken: auth.accessToken,
      path: CONTENT_PATH
    })

    res.status(200).json({
      authenticated: true,
      username: auth.username,
      sha,
      content: normalizeContentPayload(content)
    })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to load content" })
  }
}
