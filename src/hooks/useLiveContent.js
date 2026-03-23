import { useEffect, useMemo, useState } from "react"
import { profileContent } from "../content/profileContent"

const CONTENT_URL = "/content/live-content.json"

function normalizeProject(item, i) {
  return {
    id: item?.id || `project-${i}`,
    title: item?.title || "",
    tagline: item?.tagline || "",
    href: item?.href || "",
    summary: item?.summary || "",
    stack: Array.isArray(item?.stack) ? item.stack.filter(Boolean) : [],
    tags: Array.isArray(item?.tags) ? item.tags.filter(Boolean) : [],
    status: item?.status || "",
    date: item?.date || "",
    cta: item?.cta || "Visit Project"
  }
}

function normalizeContent(input) {
  if (!input || typeof input !== "object") return null

  const blocks = Array.isArray(input.blocks)
    ? input.blocks
        .map((item, i) => ({
          id: item?.id || `block-${i}`,
          date: item?.date || "",
          title: item?.title || "",
          context: item?.context || "",
          extended: item?.extended || "",
          url: item?.url || ""
        }))
        .filter((item) => item.title)
    : []

  const blogs = Array.isArray(input.blogs)
    ? input.blogs
        .map((item, i) => ({
          id: item?.id || `blog-${i}`,
          url: item?.url || "",
          title: item?.title || "",
          description: item?.description || "",
          author: item?.author || "",
          publishedAt: item?.publishedAt || "",
          image: item?.image || "",
          source: item?.source || "x",
          addedAt: item?.addedAt || ""
        }))
        .filter((item) => item.url && item.title)
    : []

  const featuredProjects = Array.isArray(input.featuredProjects)
    ? input.featuredProjects.map(normalizeProject).filter((item) => item.title && item.href)
    : []

  const photos = Array.isArray(input.photos)
    ? input.photos
        .map((item, i) => ({
          id: item?.id || `photo-${i}`,
          filename: item?.filename || "",
          caption: item?.caption || "",
          description: item?.description || "",
          date: item?.date || ""
        }))
        .filter((item) => item.filename)
    : []

  return {
    blocks,
    blogs,
    featuredProjects,
    photos,
    updatedAt: input.updatedAt || ""
  }
}

function fallbackContent() {
  return {
    blocks: profileContent.blocks.map((item, i) => ({
      id: item.id || `fallback-${i}`,
      date: item.date || "",
      title: item.title || "",
      context: item.context || "",
      extended: item.extended || "",
      url: item.url || ""
    })),
    blogs: [],
    featuredProjects: profileContent.featuredProjects.map(normalizeProject),
    photos: [],
    updatedAt: ""
  }
}

export function useLiveContent() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    content: fallbackContent()
  })

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const res = await fetch(CONTENT_URL, { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load live content (${res.status})`)
        const json = await res.json()
        const normalized = normalizeContent(json)
        if (!normalized) throw new Error("Invalid live content format")
        if (active) {
          setState({
            loading: false,
            error: "",
            content: normalized
          })
        }
      } catch (err) {
        if (active) {
          setState({
            loading: false,
            error: err instanceof Error ? err.message : "Unable to load live content",
            content: fallbackContent()
          })
        }
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return useMemo(() => state, [state])
}
