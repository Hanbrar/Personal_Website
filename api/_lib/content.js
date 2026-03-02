import crypto from "node:crypto"

export function makeId(prefix = "item") {
  return `${prefix}-${crypto.randomUUID()}`
}

export function sanitizeText(value, maxLength = 500) {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, maxLength)
}

export function sanitizeDate(value) {
  if (typeof value !== "string") return ""
  const trimmed = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return ""
  return trimmed
}

export function normalizeContentPayload(input) {
  const source = input && typeof input === "object" ? input : {}

  const blocks = Array.isArray(source.blocks)
    ? source.blocks
        .map((item) => ({
          id: sanitizeText(item?.id, 120) || makeId("status"),
          date: sanitizeDate(item?.date),
          title: sanitizeText(item?.title, 240),
          context: sanitizeText(item?.context, 160)
        }))
        .filter((item) => item.date && item.title)
    : []

  const blogs = Array.isArray(source.blogs)
    ? source.blogs
        .map((item) => ({
          id: sanitizeText(item?.id, 120) || makeId("blog"),
          url: sanitizeText(item?.url, 500),
          title: sanitizeText(item?.title, 240),
          author: sanitizeText(item?.author, 120),
          publishedAt: sanitizeText(item?.publishedAt, 80),
          image: sanitizeText(item?.image, 500),
          source: "x",
          addedAt: sanitizeText(item?.addedAt, 80) || new Date().toISOString()
        }))
        .filter((item) => item.url && item.title && isAllowedBlogUrl(item.url))
    : []

  return {
    blocks,
    blogs,
    updatedAt: new Date().toISOString()
  }
}

export function isAllowedBlogUrl(url) {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()
    return host === "x.com" || host === "www.x.com" || host === "twitter.com" || host === "www.twitter.com"
  } catch {
    return false
  }
}
