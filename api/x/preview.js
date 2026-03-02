import { isAllowedBlogUrl, sanitizeText } from "../_lib/content.js"

function stripTags(input) {
  return input.replace(/<[^>]*>/g, " ")
}

function decodeEntities(input) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

async function getOEmbed(url) {
  const endpoint = new URL("https://publish.twitter.com/oembed")
  endpoint.searchParams.set("url", url)
  endpoint.searchParams.set("omit_script", "true")
  endpoint.searchParams.set("dnt", "true")

  const response = await fetch(endpoint.toString(), {
    headers: { "User-Agent": "hanryck-portfolio-admin" }
  })
  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.error || "Failed to fetch X preview")
  }
  return json
}

function extractTitleFromOEmbedHtml(html) {
  if (typeof html !== "string" || !html) return ""
  const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const raw = pMatch ? pMatch[1] : html
  const plain = decodeEntities(stripTags(raw))
  return sanitizeText(plain, 240)
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  try {
    const body = req.body && typeof req.body === "object"
      ? req.body
      : (typeof req.body === "string" ? JSON.parse(req.body) : {})
    const url = sanitizeText(body.url, 500)

    if (!isAllowedBlogUrl(url)) {
      res.status(400).json({ error: "Only x.com/twitter.com URLs are allowed" })
      return
    }

    const oembed = await getOEmbed(url)
    const title = extractTitleFromOEmbedHtml(oembed.html) || sanitizeText(oembed.title, 240)

    res.status(200).json({
      ok: true,
      preview: {
        url,
        title,
        author: sanitizeText(oembed.author_name, 120),
        publishedAt: "",
        image: "",
        source: "x"
      }
    })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Preview failed" })
  }
}
