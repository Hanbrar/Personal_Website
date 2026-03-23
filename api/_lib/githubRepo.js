import { requiredEnv } from "./config.js"

function repoConfig() {
  return {
    owner: requiredEnv("GITHUB_REPO_OWNER"),
    repo: requiredEnv("GITHUB_REPO_NAME"),
    branch: process.env.GITHUB_TARGET_BRANCH || "main"
  }
}

function contentEndpoint(path) {
  const { owner, repo } = repoConfig()
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
}

function ghHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "hanryck-portfolio-admin"
  }
}

export async function loadRepoJsonFile({ accessToken, path }) {
  const { branch } = repoConfig()
  const url = new URL(contentEndpoint(path))
  url.searchParams.set("ref", branch)

  const response = await fetch(url, {
    headers: ghHeaders(accessToken)
  })
  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || `Failed to load ${path}`)
  }

  const decoded = Buffer.from(json.content, "base64").toString("utf8")
  return {
    sha: json.sha,
    content: JSON.parse(decoded)
  }
}

export async function getRepoFileSha({ accessToken, path }) {
  const { branch } = repoConfig()
  const url = new URL(contentEndpoint(path))
  url.searchParams.set("ref", branch)
  const response = await fetch(url, { headers: ghHeaders(accessToken) })
  if (response.status === 404) return null
  if (!response.ok) {
    const json = await response.json()
    throw new Error(json.message || `Failed to check ${path}`)
  }
  const json = await response.json()
  return json.sha || null
}

export async function saveRepoRawFile({ accessToken, path, base64Content, sha, message }) {
  const { branch } = repoConfig()
  const body = { message, content: base64Content, branch }
  if (sha) body.sha = sha
  const response = await fetch(contentEndpoint(path), {
    method: "PUT",
    headers: { ...ghHeaders(accessToken), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
  const json = await response.json()
  if (!response.ok) throw new Error(json.message || `Failed to save ${path}`)
  return { commitSha: json.commit?.sha || "", fileSha: json.content?.sha || "" }
}

export async function saveRepoJsonFile({ accessToken, path, contentObject, sha, message }) {
  const { branch } = repoConfig()
  const body = {
    message,
    content: Buffer.from(JSON.stringify(contentObject, null, 2), "utf8").toString("base64"),
    branch,
    sha
  }

  const response = await fetch(contentEndpoint(path), {
    method: "PUT",
    headers: {
      ...ghHeaders(accessToken),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || `Failed to save ${path}`)
  }

  return {
    commitSha: json.commit?.sha || "",
    fileSha: json.content?.sha || ""
  }
}
