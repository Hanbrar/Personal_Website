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

export function isHttpUrl(url) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

function sanitizeStringArray(input, maxItemLength = 80, maxItems = 20) {
  if (!Array.isArray(input)) return []
  return input
    .map((value) => sanitizeText(value, maxItemLength))
    .filter(Boolean)
    .slice(0, maxItems)
}

function normalizeProject(item) {
  const href = sanitizeText(item?.href, 500)
  const parsedHref = isHttpUrl(href) ? href : ""

  return {
    id: sanitizeText(item?.id, 120) || makeId("project"),
    title: sanitizeText(item?.title, 120),
    tagline: sanitizeText(item?.tagline, 160),
    href: parsedHref,
    summary: sanitizeText(item?.summary, 1200),
    stack: sanitizeStringArray(item?.stack, 80, 24),
    tags: sanitizeStringArray(item?.tags, 80, 24),
    status: sanitizeText(item?.status, 80),
    date: sanitizeText(item?.date, 80),
    cta: sanitizeText(item?.cta, 80) || "Visit Project"
  }
}

export function normalizeContentPayload(input) {
  const source = input && typeof input === "object" ? input : {}

  const blocks = Array.isArray(source.blocks)
    ? source.blocks
        .map((item) => {
          const url = sanitizeText(item?.url, 500)
          return {
            id: sanitizeText(item?.id, 120) || makeId("status"),
            date: sanitizeDate(item?.date),
            title: sanitizeText(item?.title, 240),
            context: sanitizeText(item?.context, 160),
            url: isHttpUrl(url) ? url : ""
          }
        })
        .filter((item) => item.date && item.title)
    : []

  const blogs = Array.isArray(source.blogs)
    ? source.blogs
        .map((item) => ({
          id: sanitizeText(item?.id, 120) || makeId("blog"),
          url: sanitizeText(item?.url, 500),
          title: sanitizeText(item?.title, 240),
          description: sanitizeText(item?.description, 500),
          author: sanitizeText(item?.author, 120),
          publishedAt: sanitizeText(item?.publishedAt, 80),
          image: sanitizeText(item?.image, 500),
          source: "x",
          addedAt: sanitizeText(item?.addedAt, 80) || new Date().toISOString()
        }))
        .filter((item) => item.url && item.title && isAllowedBlogUrl(item.url))
    : []

  const featuredProjects = Array.isArray(source.featuredProjects)
    ? source.featuredProjects
        .map(normalizeProject)
        .filter((item) => item.title && item.href)
    : []

  return {
    blocks,
    blogs,
    featuredProjects,
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
