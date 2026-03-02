import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

function createId(prefix) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

const EMPTY_CONTENT = {
  blocks: [],
  blogs: [],
  featuredProjects: [],
  updatedAt: ""
}

export default function Admin({ darkMode, setDarkMode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [sha, setSha] = useState("")
  const [content, setContent] = useState(EMPTY_CONTENT)
  const [statusMessage, setStatusMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [saving, setSaving] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [blogUrlDraft, setBlogUrlDraft] = useState("")

  const oauthError = useMemo(() => {
    if (typeof window === "undefined") return ""
    const value = new URLSearchParams(window.location.search).get("error")
    if (value === "oauth_state") return "Login session expired. Please try again."
    if (value === "not_allowed") return "GitHub account not allowed for admin access."
    return ""
  }, [])

  useEffect(() => {
    let active = true

    async function loadAdmin() {
      try {
        const res = await fetch("/api/admin/load", {
          method: "GET",
          credentials: "include"
        })

        if (!active) return

        if (res.status === 401) {
          setAuthenticated(false)
          setLoading(false)
          return
        }

        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load admin content")

        setAuthenticated(true)
        setUsername(json.username || "")
        setSha(json.sha || "")
        setContent(json.content || EMPTY_CONTENT)
        setLoading(false)
      } catch (err) {
        if (!active) return
        setErrorMessage(err instanceof Error ? err.message : "Failed to load admin")
        setLoading(false)
      }
    }

    loadAdmin()

    return () => {
      active = false
    }
  }, [])

  function updateBlock(index, key, value) {
    setContent((prev) => {
      const next = [...prev.blocks]
      next[index] = { ...next[index], [key]: value }
      return { ...prev, blocks: next }
    })
  }

  function updateBlog(index, key, value) {
    setContent((prev) => {
      const next = [...prev.blogs]
      next[index] = { ...next[index], [key]: value }
      return { ...prev, blogs: next }
    })
  }

  function updateProject(index, key, value) {
    setContent((prev) => {
      const next = [...prev.featuredProjects]
      next[index] = { ...next[index], [key]: value }
      return { ...prev, featuredProjects: next }
    })
  }

  function moveItem(key, index, direction) {
    setContent((prev) => {
      const list = [...prev[key]]
      const target = index + direction
      if (target < 0 || target >= list.length) return prev
      const [item] = list.splice(index, 1)
      list.splice(target, 0, item)
      return { ...prev, [key]: list }
    })
  }

  function removeItem(key, index) {
    setContent((prev) => {
      const list = [...prev[key]]
      list.splice(index, 1)
      return { ...prev, [key]: list }
    })
  }

  function addBlock() {
    setContent((prev) => ({
      ...prev,
      blocks: [
        {
          id: createId("status"),
          date: todayDate(),
          title: "",
          context: "",
          url: ""
        },
        ...prev.blocks
      ]
    }))
  }

  function addEmptyBlog() {
    setContent((prev) => ({
      ...prev,
      blogs: [
        {
          id: createId("blog"),
          url: "",
          title: "",
          description: "",
          author: "",
          publishedAt: "",
          image: "",
          source: "x",
          addedAt: new Date().toISOString()
        },
        ...prev.blogs
      ]
    }))
  }

  function addProject() {
    setContent((prev) => ({
      ...prev,
      featuredProjects: [
        {
          id: createId("project"),
          title: "",
          tagline: "",
          href: "",
          summary: "",
          stack: [],
          tags: [],
          status: "Live",
          date: "",
          cta: "Visit Project"
        },
        ...prev.featuredProjects
      ]
    }))
  }

  async function addBlogFromUrl() {
    setErrorMessage("")
    setStatusMessage("")
    const url = blogUrlDraft.trim()
    if (!url) {
      setErrorMessage("Paste an X URL first.")
      return
    }

    try {
      setPreviewLoading(true)
      const res = await fetch("/api/x/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to fetch X preview")

      const preview = json.preview || {}
      setContent((prev) => ({
        ...prev,
        blogs: [
          {
            id: createId("blog"),
            url: preview.url || url,
            title: preview.title || "",
            author: preview.author || "",
            description: "",
            publishedAt: preview.publishedAt || "",
            image: preview.image || "",
            source: "x",
            addedAt: new Date().toISOString()
          },
          ...prev.blogs
        ]
      }))
      setBlogUrlDraft("")
      setStatusMessage("Preview extracted. Review the card fields, then click Save.")
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to add blog URL")
    } finally {
      setPreviewLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setErrorMessage("")
    setStatusMessage("")
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sha,
          content
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Save failed")

      setSha(json.sha || "")
      setContent(json.content || content)
      setStatusMessage(`Saved and pushed to main (${json.commitSha?.slice(0, 7) || "commit"}).`)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/github/logout", {
        method: "POST",
        credentials: "include"
      })
      window.location.href = "/admin"
    } catch {
      window.location.href = "/admin"
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-5 md:px-8 md:pt-7">
        <div className="pointer-events-none fixed inset-0 -z-10 neo-grid opacity-90" />
        <main className="mx-auto max-w-5xl">
          <p className="font-mono text-sm" style={{ color: "rgb(var(--text-soft))" }}>Loading admin...</p>
        </main>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-5 md:px-8 md:pt-7">
        <div className="pointer-events-none fixed inset-0 -z-10 neo-grid opacity-90" />
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <nav className="flex items-center justify-between">
            <Link to="/" className="nav-link">Home</Link>
            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              className="btn-ghost"
              style={{ fontSize: "12px", padding: "8px 16px" }}
              aria-label="Toggle theme"
            >
              {darkMode ? "Use light" : "Use dark"}
            </button>
          </nav>

          <article className="anime-card card-yellow rounded-[18px] p-6 md:p-8">
            <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Admin</h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgb(var(--text-soft))" }}>
              Sign in with GitHub to edit Live Status and Blogs. Only the configured owner account can publish.
            </p>
            {oauthError ? (
              <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-red-500">{oauthError}</p>
            ) : null}
            <div className="mt-5 flex gap-3">
              <a href="/api/auth/github/start" className="btn-primary">Sign in with GitHub</a>
              <Link to="/" className="btn-ghost">Cancel</Link>
            </div>
          </article>
        </main>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-5 md:px-8 md:pt-7">
      <div className="pointer-events-none fixed inset-0 -z-10 neo-grid opacity-90" />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/live" className="nav-link">Live</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text-soft))" }}>
              {username}
            </span>
            <button type="button" onClick={handleLogout} className="btn-ghost" style={{ fontSize: "12px", padding: "8px 12px" }}>
              Logout
            </button>
          </div>
        </nav>

        <article className="anime-card card-yellow rounded-[18px] p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">Live Content Admin</h1>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgb(var(--text-soft))" }}>
                Edit status logs, X blog cards, and featured projects, then save to push directly to main.
              </p>
            </div>
            <button type="button" onClick={handleSave} className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save and Publish"}
            </button>
          </div>
          {statusMessage ? (
            <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-green-500">{statusMessage}</p>
          ) : null}
          {errorMessage ? (
            <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-red-500">{errorMessage}</p>
          ) : null}
        </article>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="anime-card card-lime rounded-[18px] p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="section-title text-2xl md:text-3xl">Live Status Entries</h2>
              <button type="button" onClick={addBlock} className="btn-ghost" style={{ fontSize: "12px", padding: "8px 12px" }}>
                Add Entry
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {content.blocks.map((block, idx) => (
                <div key={block.id} className="rounded p-3" style={{ border: "1px solid rgb(var(--text) / 0.28)" }}>
                  <div className="grid gap-2">
                    <input
                      type="date"
                      value={block.date}
                      onChange={(e) => updateBlock(idx, "date", e.target.value)}
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                    <input
                      type="text"
                      value={block.title}
                      onChange={(e) => updateBlock(idx, "title", e.target.value)}
                      placeholder="Status title"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                    <input
                      type="text"
                      value={block.context}
                      onChange={(e) => updateBlock(idx, "context", e.target.value)}
                      placeholder="Context"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                    <input
                      type="url"
                      value={block.url || ""}
                      onChange={(e) => updateBlock(idx, "url", e.target.value)}
                      placeholder="Optional URL to share"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => moveItem("blocks", idx, -1)} className="btn-ghost" style={{ fontSize: "11px", padding: "6px 10px" }}>
                      Up
                    </button>
                    <button type="button" onClick={() => moveItem("blocks", idx, 1)} className="btn-ghost" style={{ fontSize: "11px", padding: "6px 10px" }}>
                      Down
                    </button>
                    <button type="button" onClick={() => removeItem("blocks", idx)} className="btn-ghost" style={{ fontSize: "11px", padding: "6px 10px" }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="anime-card card-teal rounded-[18px] p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="section-title text-2xl md:text-3xl">Blog Cards (X)</h2>
              <button type="button" onClick={addEmptyBlog} className="btn-ghost" style={{ fontSize: "12px", padding: "8px 12px" }}>
                Add Empty
              </button>
            </div>

            <div className="mb-4 rounded p-3" style={{ border: "1px solid rgb(var(--text) / 0.28)" }}>
              <label className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgb(var(--text-soft))" }}>
                Paste X URL
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="url"
                  value={blogUrlDraft}
                  onChange={(e) => setBlogUrlDraft(e.target.value)}
                  placeholder="https://x.com/username/status/..."
                  className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                  style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                />
                <button type="button" onClick={addBlogFromUrl} className="btn-primary" disabled={previewLoading}>
                  {previewLoading ? "Fetching..." : "Add from URL"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {content.blogs.map((blog, idx) => (
                <div key={blog.id} className="rounded p-3" style={{ border: "1px solid rgb(var(--text) / 0.28)" }}>
                  <div className="grid gap-2">
                    <input
                      type="url"
                      value={blog.url}
                      onChange={(e) => updateBlog(idx, "url", e.target.value)}
                      placeholder="URL"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                    <input
                      type="text"
                      value={blog.title}
                      onChange={(e) => updateBlog(idx, "title", e.target.value)}
                      placeholder="Card title (editable)"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                    <textarea
                      value={blog.description || ""}
                      onChange={(e) => updateBlog(idx, "description", e.target.value)}
                      placeholder="What this blog is about"
                      rows={3}
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))", resize: "vertical" }}
                    />
                    <input
                      type="text"
                      value={blog.author || ""}
                      onChange={(e) => updateBlog(idx, "author", e.target.value)}
                      placeholder="Author"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => moveItem("blogs", idx, -1)} className="btn-ghost" style={{ fontSize: "11px", padding: "6px 10px" }}>
                      Up
                    </button>
                    <button type="button" onClick={() => moveItem("blogs", idx, 1)} className="btn-ghost" style={{ fontSize: "11px", padding: "6px 10px" }}>
                      Down
                    </button>
                    <button type="button" onClick={() => removeItem("blogs", idx)} className="btn-ghost" style={{ fontSize: "11px", padding: "6px 10px" }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section>
          <article className="anime-card card-yellow rounded-[18px] p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="section-title text-2xl md:text-3xl">Featured Projects</h2>
              <button type="button" onClick={addProject} className="btn-ghost" style={{ fontSize: "12px", padding: "8px 12px" }}>
                Add Project
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {(content.featuredProjects || []).map((project, idx) => (
                <div key={project.id || idx} className="rounded p-3" style={{ border: "1px solid rgb(var(--text) / 0.28)" }}>
                  <div className="grid gap-2">
                    <input
                      type="text"
                      value={project.title || ""}
                      onChange={(e) => updateProject(idx, "title", e.target.value)}
                      placeholder="Project title"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                    <input
                      type="text"
                      value={project.tagline || ""}
                      onChange={(e) => updateProject(idx, "tagline", e.target.value)}
                      placeholder="Tagline"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                    <input
                      type="url"
                      value={project.href || ""}
                      onChange={(e) => updateProject(idx, "href", e.target.value)}
                      placeholder="Project URL"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                    <textarea
                      value={project.summary || ""}
                      onChange={(e) => updateProject(idx, "summary", e.target.value)}
                      placeholder="Project summary"
                      rows={4}
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))", resize: "vertical" }}
                    />
                    <div className="grid gap-2 md:grid-cols-3">
                      <input
                        type="text"
                        value={project.status || ""}
                        onChange={(e) => updateProject(idx, "status", e.target.value)}
                        placeholder="Status"
                        className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                        style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                      />
                      <input
                        type="text"
                        value={project.date || ""}
                        onChange={(e) => updateProject(idx, "date", e.target.value)}
                        placeholder="Date label"
                        className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                        style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                      />
                      <input
                        type="text"
                        value={project.cta || ""}
                        onChange={(e) => updateProject(idx, "cta", e.target.value)}
                        placeholder="Button text"
                        className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                        style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                      />
                    </div>
                    <input
                      type="text"
                      value={Array.isArray(project.stack) ? project.stack.join(", ") : ""}
                      onChange={(e) => updateProject(idx, "stack", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))}
                      placeholder="Stack (comma separated)"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                    <input
                      type="text"
                      value={Array.isArray(project.tags) ? project.tags.join(", ") : ""}
                      onChange={(e) => updateProject(idx, "tags", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))}
                      placeholder="Tags (comma separated)"
                      className="w-full rounded bg-transparent px-2 py-1.5 text-sm"
                      style={{ border: "1px solid rgb(var(--text) / 0.32)", color: "rgb(var(--text))" }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => moveItem("featuredProjects", idx, -1)} className="btn-ghost" style={{ fontSize: "11px", padding: "6px 10px" }}>
                      Up
                    </button>
                    <button type="button" onClick={() => moveItem("featuredProjects", idx, 1)} className="btn-ghost" style={{ fontSize: "11px", padding: "6px 10px" }}>
                      Down
                    </button>
                    <button type="button" onClick={() => removeItem("featuredProjects", idx)} className="btn-ghost" style={{ fontSize: "11px", padding: "6px 10px" }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
