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
  photos: [],
  updatedAt: ""
}

// Shared input style
const inputStyle = {
  border: "1px solid rgb(var(--text) / 0.18)",
  color: "rgb(var(--text))",
  background: "rgb(var(--surface-2) / 0.6)",
}

// Shared item wrapper style
const itemWrap = {
  background: "rgb(var(--surface-2))",
  border: "1px solid rgb(var(--text) / 0.1)",
  borderRadius: "12px",
  padding: "16px",
}

function AdminNav({ darkMode, setDarkMode, username, onLogout }) {
  return (
    <nav
      className="sticky top-0 z-50 px-6 md:px-10"
      style={{
        background: "rgb(var(--bg) / 0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgb(var(--text) / 0.07)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between">
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/live" className="nav-link">Live</Link>
          <Link to="/photos" className="nav-link hidden sm:inline">Photos</Link>
        </div>
        <div className="flex items-center gap-2">
          {username && (
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text-soft))" }}>
              {username}
            </span>
          )}
          <button
            type="button"
            onClick={() => setDarkMode(d => !d)}
            className="btn-ghost"
            style={{ fontSize: "11px", padding: "6px 13px" }}
            aria-label="Toggle theme"
          >
            <span className="hidden sm:inline">{darkMode ? "☀ Light" : "☽ Dark"}</span>
            <span className="sm:hidden">{darkMode ? "☀" : "☽"}</span>
          </button>
          {onLogout && (
            <button type="button" onClick={onLogout} className="btn-ghost" style={{ fontSize: "11px", padding: "6px 12px" }}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
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

  const [draftInputs, setDraftInputs] = useState({})

  const [photoFiles, setPhotoFiles] = useState({})
  const [photoUploading, setPhotoUploading] = useState({})

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
        const res = await fetch("/api/admin/load", { method: "GET", credentials: "include" })
        if (!active) return
        if (res.status === 401) { setAuthenticated(false); setLoading(false); return }
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load admin content")
        setAuthenticated(true)
        setUsername(json.username || "")
        setSha(json.sha || "")
        setContent({ ...EMPTY_CONTENT, ...(json.content || {}) })
        setLoading(false)
      } catch (err) {
        if (!active) return
        setErrorMessage(err instanceof Error ? err.message : "Failed to load admin")
        setLoading(false)
      }
    }
    loadAdmin()
    return () => { active = false }
  }, [])

  function updateBlock(index, key, value) {
    setContent((prev) => { const next = [...prev.blocks]; next[index] = { ...next[index], [key]: value }; return { ...prev, blocks: next } })
  }
  function updateBlog(index, key, value) {
    setContent((prev) => { const next = [...prev.blogs]; next[index] = { ...next[index], [key]: value }; return { ...prev, blogs: next } })
  }
  function updateProject(index, key, value) {
    setContent((prev) => { const next = [...prev.featuredProjects]; next[index] = { ...next[index], [key]: value }; return { ...prev, featuredProjects: next } })
  }
  function updatePhoto(index, key, value) {
    setContent((prev) => { const next = [...(prev.photos || [])]; next[index] = { ...next[index], [key]: value }; return { ...prev, photos: next } })
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
    setContent((prev) => { const list = [...prev[key]]; list.splice(index, 1); return { ...prev, [key]: list } })
  }

  function addBlock() {
    setContent((prev) => ({
      ...prev,
      blocks: [{ id: createId("status"), date: todayDate(), title: "", context: "", extended: "", url: "" }, ...prev.blocks]
    }))
  }
  function addEmptyBlog() {
    setContent((prev) => ({
      ...prev,
      blogs: [{ id: createId("blog"), url: "", title: "", description: "", author: "", publishedAt: "", image: "", source: "x", addedAt: new Date().toISOString() }, ...prev.blogs]
    }))
  }
  function addProject() {
    setContent((prev) => ({
      ...prev,
      featuredProjects: [{ id: createId("project"), title: "", tagline: "", href: "", summary: "", stack: [], tags: [], status: "Live", date: "", cta: "Visit Project" }, ...prev.featuredProjects]
    }))
  }
  function addPhoto() {
    setContent((prev) => ({
      ...prev,
      photos: [{ id: createId("photo"), filename: "", caption: "", description: "", date: todayDate() }, ...(prev.photos || [])]
    }))
  }

  async function addBlogFromUrl() {
    setErrorMessage(""); setStatusMessage("")
    const url = blogUrlDraft.trim()
    if (!url) { setErrorMessage("Paste an X URL first."); return }
    try {
      setPreviewLoading(true)
      const res = await fetch("/api/x/preview", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ url }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to fetch X preview")
      const preview = json.preview || {}
      setContent((prev) => ({
        ...prev,
        blogs: [{ id: createId("blog"), url: preview.url || url, title: preview.title || "", author: preview.author || "", description: "", publishedAt: preview.publishedAt || "", image: preview.image || "", source: "x", addedAt: new Date().toISOString() }, ...prev.blogs]
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
    setSaving(true); setErrorMessage(""); setStatusMessage("")
    try {
      const res = await fetch("/api/admin/save", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ sha, content }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Save failed")
      setSha(json.sha || "")
      setContent({ ...EMPTY_CONTENT, ...(json.content || content) })
      setStatusMessage(`Saved and pushed to main (${json.commitSha?.slice(0, 7) || "commit"}).`)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    try { await fetch("/api/auth/github/logout", { method: "POST", credentials: "include" }) } catch {}
    window.location.href = "/admin"
  }

  function handlePhotoFileChange(photoId, e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFiles((prev) => ({ ...prev, [photoId]: { file, previewUrl: URL.createObjectURL(file) } }))
  }

  async function handlePhotoUpload(photoId, photoIdx) {
    const fileInfo = photoFiles[photoId]
    if (!fileInfo) return
    setPhotoUploading((prev) => ({ ...prev, [photoId]: true }))
    setErrorMessage("")
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1]
      const ext = fileInfo.file.name.split(".").pop().toLowerCase() || "jpg"
      const filename = `photo-${Date.now()}.${ext}`
      try {
        const res = await fetch("/api/admin/upload-file", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ path: `public/photos/${filename}`, base64, message: `Upload photo ${filename}` }) })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Upload failed")
        updatePhoto(photoIdx, "filename", filename)
        setStatusMessage("Photo uploaded. Click Save and Publish to save metadata.")
        setPhotoFiles((prev) => { const next = { ...prev }; delete next[photoId]; return next })
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Photo upload failed")
      } finally {
        setPhotoUploading((prev) => ({ ...prev, [photoId]: false }))
      }
    }
    reader.readAsDataURL(fileInfo.file)
  }

  // ─── Loading ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <AdminNav darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="flex items-center justify-center py-40">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "rgb(var(--text-soft))" }}>
            Loading…
          </p>
        </div>
      </div>
    )
  }

  // ─── Unauthenticated ────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <AdminNav darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="mx-auto w-full max-w-xl px-6 pt-24 pb-36 md:px-10">
          <div className="anim-fade-rise">
            <p className="hero-eyebrow mb-6"><span className="hero-eyebrow-dot" /> Admin</p>
            <h1 className="section-title-2026 mb-2" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>Sign in</h1>
            <div className="hero-rule mb-8" />
            <article className="glass-card p-8">
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgb(var(--text-soft))" }}>
                Sign in with GitHub to edit Live Status, Blogs, Projects, and Photos. Only the configured owner account can publish.
              </p>
              {oauthError ? (
                <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-red-400">{oauthError}</p>
              ) : null}
              <div className="flex gap-3">
                <a href="/api/auth/github/start" className="btn-primary">Sign in with GitHub</a>
                <Link to="/" className="btn-ghost">Cancel</Link>
              </div>
            </article>
          </div>
        </main>
      </div>
    )
  }

  // ─── Main Admin ─────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AdminNav darkMode={darkMode} setDarkMode={setDarkMode} username={username} onLogout={handleLogout} />

      <main className="mx-auto w-full max-w-6xl px-6 pb-36 md:px-10">

        {/* Header + Save */}
        <header className="anim-fade-rise pt-16 pb-10 md:pt-20 md:pb-12">
          <p className="hero-eyebrow mb-6"><span className="hero-eyebrow-dot" /> Content Management</p>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="section-title-2026" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 0.95 }}>
                Admin
              </h1>
              <div className="hero-rule mt-4" />
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgb(var(--text-soft))", maxWidth: "50ch" }}>
                Edit status logs, X blog cards, featured projects, and photos, then publish to main.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <button type="button" onClick={handleSave} className="btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save and Publish"}
              </button>
              {statusMessage ? (
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#A3D900" }}>{statusMessage}</p>
              ) : null}
              {errorMessage ? (
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-red-400">{errorMessage}</p>
              ) : null}
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8">

          {/* ─── Live Status + Blogs ──────────────────────── */}
          <section className="grid gap-6 xl:grid-cols-2">

            {/* Live Status */}
            <article className="project-card-2026 p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker mb-1">Feed</p>
                  <h2 className="section-title-2026" style={{ fontSize: "1.4rem" }}>Live Status</h2>
                </div>
                <button type="button" onClick={addBlock} className="btn-ghost" style={{ fontSize: "11px", padding: "7px 13px" }}>
                  + Add Entry
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {content.blocks.map((block, idx) => (
                  <div key={block.id} style={itemWrap}>
                    <div className="grid gap-2">
                      <input type="date" value={block.date} onChange={(e) => updateBlock(idx, "date", e.target.value)}
                        className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                      <input type="text" value={block.title} onChange={(e) => updateBlock(idx, "title", e.target.value)}
                        placeholder="Status title" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                      <input type="text" value={block.context} onChange={(e) => updateBlock(idx, "context", e.target.value)}
                        placeholder="Context" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                      {block.extended !== undefined && block.extended !== null && (
                        <textarea value={block.extended} onChange={(e) => updateBlock(idx, "extended", e.target.value)}
                          placeholder="Extended notes — write more in depth about what's going on…" rows={4}
                          className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={{ ...inputStyle, resize: "vertical" }} />
                      )}
                      <input type="url" value={block.url || ""} onChange={(e) => updateBlock(idx, "url", e.target.value)}
                        placeholder="Optional URL" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => moveItem("blocks", idx, -1)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px" }}>↑ Up</button>
                      <button type="button" onClick={() => moveItem("blocks", idx, 1)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px" }}>↓ Down</button>
                      <button type="button"
                        onClick={() => updateBlock(idx, "extended", block.extended !== undefined && block.extended !== null ? null : "")}
                        className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px" }}>
                        {block.extended !== undefined && block.extended !== null ? "− Extended" : "+ Extended"}
                      </button>
                      <button type="button" onClick={() => removeItem("blocks", idx)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px", borderColor: "rgb(239 68 68 / 0.4)", color: "rgb(239 68 68)" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Blog Cards */}
            <article className="project-card-2026 p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker mb-1">Writing</p>
                  <h2 className="section-title-2026" style={{ fontSize: "1.4rem" }}>Blog Cards</h2>
                </div>
                <button type="button" onClick={addEmptyBlog} className="btn-ghost" style={{ fontSize: "11px", padding: "7px 13px" }}>
                  + Add Empty
                </button>
              </div>

              <div className="mb-4" style={itemWrap}>
                <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgb(var(--text-soft))" }}>
                  Paste X URL
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input type="url" value={blogUrlDraft} onChange={(e) => setBlogUrlDraft(e.target.value)}
                    placeholder="https://x.com/username/status/…" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                  <button type="button" onClick={addBlogFromUrl} className="btn-primary" disabled={previewLoading}>
                    {previewLoading ? "Fetching…" : "Add from URL"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {content.blogs.map((blog, idx) => (
                  <div key={blog.id} style={itemWrap}>
                    <div className="grid gap-2">
                      <input type="url" value={blog.url} onChange={(e) => updateBlog(idx, "url", e.target.value)}
                        placeholder="URL" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                      <input type="text" value={blog.title} onChange={(e) => updateBlog(idx, "title", e.target.value)}
                        placeholder="Card title" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                      <textarea value={blog.description || ""} onChange={(e) => updateBlog(idx, "description", e.target.value)}
                        placeholder="What this blog is about" rows={3}
                        className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={{ ...inputStyle, resize: "vertical" }} />
                      <input type="text" value={blog.author || ""} onChange={(e) => updateBlog(idx, "author", e.target.value)}
                        placeholder="Author" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => moveItem("blogs", idx, -1)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px" }}>↑ Up</button>
                      <button type="button" onClick={() => moveItem("blogs", idx, 1)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px" }}>↓ Down</button>
                      <button type="button" onClick={() => removeItem("blogs", idx)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px", borderColor: "rgb(239 68 68 / 0.4)", color: "rgb(239 68 68)" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* ─── Featured Projects ────────────────────────── */}
          <article className="project-card-2026 p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="section-kicker mb-1">Work</p>
                <h2 className="section-title-2026" style={{ fontSize: "1.4rem" }}>Featured Projects</h2>
              </div>
              <button type="button" onClick={addProject} className="btn-ghost" style={{ fontSize: "11px", padding: "7px 13px" }}>
                + Add Project
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {(content.featuredProjects || []).map((project, idx) => (
                <div key={project.id || idx} style={itemWrap}>
                  <div className="grid gap-2">
                    <div className="grid gap-2 md:grid-cols-2">
                      <input type="text" value={project.title || ""} onChange={(e) => updateProject(idx, "title", e.target.value)}
                        placeholder="Project title" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                      <input type="text" value={project.tagline || ""} onChange={(e) => updateProject(idx, "tagline", e.target.value)}
                        placeholder="Tagline" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                    </div>
                    <input type="url" value={project.href || ""} onChange={(e) => updateProject(idx, "href", e.target.value)}
                      placeholder="Project URL" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                    <textarea value={project.summary || ""} onChange={(e) => updateProject(idx, "summary", e.target.value)}
                      placeholder="Project summary" rows={4}
                      className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={{ ...inputStyle, resize: "vertical" }} />
                    <div className="grid gap-2 md:grid-cols-3">
                      <input type="text" value={project.status || ""} onChange={(e) => updateProject(idx, "status", e.target.value)}
                        placeholder="Status" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                      <input type="text" value={project.date || ""} onChange={(e) => updateProject(idx, "date", e.target.value)}
                        placeholder="Date label" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                      <input type="text" value={project.cta || ""} onChange={(e) => updateProject(idx, "cta", e.target.value)}
                        placeholder="Button text" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                    </div>
                    <input type="text"
                      value={draftInputs[`${project.id}-stack`] ?? (Array.isArray(project.stack) ? project.stack.join(", ") : "")}
                      onChange={(e) => setDraftInputs((prev) => ({ ...prev, [`${project.id}-stack`]: e.target.value }))}
                      onBlur={(e) => {
                        updateProject(idx, "stack", e.target.value.split(",").map(s => s.trim()).filter(Boolean))
                        setDraftInputs((prev) => { const next = { ...prev }; delete next[`${project.id}-stack`]; return next })
                      }}
                      placeholder="Stack (comma separated: React, Node, Postgres)"
                      className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                    <input type="text"
                      value={draftInputs[`${project.id}-tags`] ?? (Array.isArray(project.tags) ? project.tags.join(", ") : "")}
                      onChange={(e) => setDraftInputs((prev) => ({ ...prev, [`${project.id}-tags`]: e.target.value }))}
                      onBlur={(e) => {
                        updateProject(idx, "tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))
                        setDraftInputs((prev) => { const next = { ...prev }; delete next[`${project.id}-tags`]; return next })
                      }}
                      placeholder="Tags (comma separated: AI, SaaS, React)"
                      className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => moveItem("featuredProjects", idx, -1)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px" }}>↑ Up</button>
                    <button type="button" onClick={() => moveItem("featuredProjects", idx, 1)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px" }}>↓ Down</button>
                    <button type="button" onClick={() => removeItem("featuredProjects", idx)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px", borderColor: "rgb(239 68 68 / 0.4)", color: "rgb(239 68 68)" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* ─── Photos ───────────────────────────────────── */}
          <article className="project-card-2026 p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="section-kicker mb-1">Visual</p>
                <h2 className="section-title-2026" style={{ fontSize: "1.4rem" }}>Photos</h2>
              </div>
              <button type="button" onClick={addPhoto} className="btn-ghost" style={{ fontSize: "11px", padding: "7px 13px" }}>
                + Add Photo
              </button>
            </div>
            <p className="mb-5 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              Pick a file, fill in the details, click Upload Photo, then Save and Publish.
            </p>

            <div className="flex flex-col gap-3">
              {(content.photos || []).map((photo, idx) => {
                const fileInfo = photoFiles[photo.id]
                const previewSrc = fileInfo?.previewUrl || (photo.filename ? `/photos/${photo.filename}` : null)
                return (
                  <div key={photo.id} style={itemWrap}>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="flex-shrink-0">
                        {previewSrc ? (
                          <img src={previewSrc} alt="Preview" className="h-24 w-24 rounded-xl object-cover" style={{ border: "1px solid rgb(var(--text) / 0.15)" }} />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-xl" style={{ border: "1px solid rgb(var(--text) / 0.15)", color: "rgb(var(--text-soft))" }}>
                            <span className="font-mono text-[9px] uppercase tracking-widest">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        {photo.filename ? (
                          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#A3D900" }}>
                            Uploaded: {photo.filename}
                          </p>
                        ) : (
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <input type="file" accept="image/*" onChange={(e) => handlePhotoFileChange(photo.id, e)}
                              className="flex-1 text-sm" style={{ color: "rgb(var(--text))" }} />
                            <button type="button" onClick={() => handlePhotoUpload(photo.id, idx)} className="btn-primary"
                              disabled={!fileInfo || photoUploading[photo.id]} style={{ whiteSpace: "nowrap" }}>
                              {photoUploading[photo.id] ? "Uploading…" : "Upload Photo"}
                            </button>
                          </div>
                        )}
                        <input type="text" value={photo.caption || ""} onChange={(e) => updatePhoto(idx, "caption", e.target.value)}
                          placeholder="Caption (shown in grid)" className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                        <textarea value={photo.description || ""} onChange={(e) => updatePhoto(idx, "description", e.target.value)}
                          placeholder="Description (shown when user clicks)" rows={3}
                          className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={{ ...inputStyle, resize: "vertical" }} />
                        <input type="date" value={photo.date || ""} onChange={(e) => updatePhoto(idx, "date", e.target.value)}
                          className="w-full rounded-lg bg-transparent px-3 py-2 text-sm" style={inputStyle} />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => moveItem("photos", idx, -1)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px" }}>↑ Up</button>
                      <button type="button" onClick={() => moveItem("photos", idx, 1)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px" }}>↓ Down</button>
                      <button type="button" onClick={() => removeItem("photos", idx)} className="btn-ghost" style={{ fontSize: "10px", padding: "5px 10px", borderColor: "rgb(239 68 68 / 0.4)", color: "rgb(239 68 68)" }}>Delete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </article>

        </div>
      </main>
    </div>
  )
}
