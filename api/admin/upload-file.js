import { requireAdminSession } from "../_lib/adminAuth.js"
import { getRepoFileSha, saveRepoRawFile } from "../_lib/githubRepo.js"

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body) } catch { return {} }
  }
  return {}
}

const ALLOWED_PATHS = /^public\/(profile\.jpg|photos\/[a-zA-Z0-9_.-]+)$/

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
    const { path, base64, message } = body

    if (!path || !ALLOWED_PATHS.test(path)) {
      res.status(400).json({ error: "Invalid file path." })
      return
    }

    if (!base64 || typeof base64 !== "string" || base64.length > 10 * 1024 * 1024) {
      res.status(400).json({ error: "Missing or oversized file content." })
      return
    }

    const sha = await getRepoFileSha({ accessToken: auth.accessToken, path })
    const result = await saveRepoRawFile({
      accessToken: auth.accessToken,
      path,
      base64Content: base64,
      sha,
      message: message || `Upload ${path}`
    })

    res.status(200).json({ ok: true, commitSha: result.commitSha, fileSha: result.fileSha })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Upload failed" })
  }
}
