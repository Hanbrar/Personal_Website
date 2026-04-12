import { useEffect, useState } from "react"
import { Link, Route, Routes } from "react-router-dom"
import { profileContent } from "./content/profileContent"
import LiveStatus from "./pages/LiveStatus"
import Admin from "./pages/Admin"
import Photos from "./pages/Photos"
import { useLiveContent } from "./hooks/useLiveContent"

const THEME_KEY = "hb-theme"

const contactIconMap = {
  github: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12 2A10 10 0 0 0 8.84 21.49c.5.09.66-.22.66-.48v-1.7c-2.76.6-3.34-1.17-3.34-1.17-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.88 1.52 2.31 1.08 2.88.83.08-.65.35-1.08.63-1.33-2.2-.25-4.52-1.1-4.52-4.91 0-1.08.39-1.96 1.03-2.65-.1-.25-.45-1.27.1-2.63 0 0 .84-.27 2.75 1.01A9.5 9.5 0 0 1 12 6.8a9.52 9.52 0 0 1 2.5.34c1.9-1.28 2.74-1.01 2.74-1.01.55 1.36.2 2.38.1 2.63.64.69 1.03 1.57 1.03 2.65 0 3.82-2.33 4.66-4.55 4.9.36.31.68.92.68 1.86V21c0 .27.18.58.67.48A10 10 0 0 0 12 2z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2h3.68l-8.03 9.18L24 22h-7.41l-5.8-6.75L4.88 22H1.2l8.6-9.83L.6 2h7.6l5.25 6.18L18.9 2zm-1.29 17.8h2.04L7.08 4.08H4.9L17.6 19.8z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3zM9 9h3.83v1.71h.05c.53-.95 1.84-1.95 3.8-1.95C20.75 8.76 22 11.12 22 14.2V21h-4v-5.98c0-1.43-.03-3.27-1.99-3.27s-2.3 1.56-2.3 3.17V21H9z" />
    </svg>
  )
}

function isUrlLikeTitle(value) {
  const text = (value || "").trim()
  if (!text) return false
  return /^(https?:\/\/|www\.|x\.com\/|twitter\.com\/|t\.co\/)/i.test(text)
}

function blogHeadline(blog) {
  const title = (blog?.title || "").trim()
  const description = (blog?.description || "").trim()
  if (title && !isUrlLikeTitle(title)) return title
  if (description) return description
  return "X Post"
}

function blogSubline(blog) {
  const title = (blog?.title || "").trim()
  const description = (blog?.description || "").trim()
  if (title && !isUrlLikeTitle(title)) return description
  return ""
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false
    const saved = window.localStorage.getItem(THEME_KEY)
    if (saved) return saved === "dark"
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    window.localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light")
  }, [darkMode])

  return (
    <Routes>
      <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/live" element={<LiveStatus darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/photos" element={<Photos darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/admin" element={<Admin darkMode={darkMode} setDarkMode={setDarkMode} />} />
    </Routes>
  )
}

function Home({ darkMode, setDarkMode }) {
  const { content: liveContent } = useLiveContent()
  const latestBlogs = [...(liveContent.blogs || [])].slice(0, 3)
  const featuredProjects = liveContent.featuredProjects?.length
    ? liveContent.featuredProjects
    : profileContent.featuredProjects

  return (
    <div className="relative overflow-x-hidden">

      {/* ─── Sticky frosted nav ──────────────────────────── */}
      <nav
        className="sticky top-0 z-50 px-6 md:px-10"
        style={{
          background: "rgb(var(--bg) / 0.88)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgb(var(--text) / 0.07)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "rgb(var(--text-soft))" }}>
            HB · 2026
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/live" className="nav-link">Live</Link>
            <Link to="/photos" className="nav-link">Photos</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
            <a href="/Hanryck_Brar_Resume.pdf" target="_blank" rel="noreferrer" className="nav-link">Resume</a>
            <button
              type="button"
              onClick={() => setDarkMode(d => !d)}
              className="btn-ghost"
              style={{ fontSize: "11px", padding: "6px 13px", marginLeft: "6px" }}
              aria-label="Toggle theme"
            >
              {darkMode ? "☀ Light" : "☽ Dark"}
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl px-6 pb-36 md:px-10">

        {/* ─── HERO ────────────────────────────────────────── */}
        <header id="top" className="anim-fade-rise pt-20 pb-16 md:pt-28 md:pb-20">
          <p className="hero-eyebrow mb-7">
            <span className="hero-eyebrow-dot" />
            {profileContent.location}
          </p>

          <h1 className="hero-name name-glitch" data-text={profileContent.name}>
            {profileContent.name}
          </h1>
          <div className="hero-rule" />

          <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
            <span className="font-display text-xl font-bold tracking-tight md:text-2xl">
              {profileContent.title}
            </span>
            <span className="font-mono text-sm" style={{ color: "rgb(var(--text-soft))" }}>·</span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text-soft))" }}>
              {profileContent.subtitle}
            </span>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-5">
              {profileContent.contacts.map((contact) => (
                <a
                  key={contact.id}
                  href={contact.href}
                  target="_blank"
                  rel="noreferrer"
                  className="opacity-40 transition-opacity hover:opacity-100"
                  style={{ color: "rgb(var(--text))" }}
                  aria-label={contact.label}
                >
                  {contactIconMap[contact.id]}
                </a>
              ))}
            </div>
            <a
              href="/Hanryck_Brar_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ fontSize: "12px", padding: "10px 22px" }}
            >
              View Resume ↗
            </a>
          </div>
        </header>

        {/* ─── WHO I AM ────────────────────────────────────── */}
        <section className="anim-fade-rise mb-20 md:mb-28" style={{ animationDelay: "0.1s" }}>
          <article className="glass-card p-8 md:p-12">
            <p className="section-kicker mb-5">About me</p>
            <p className="about-text">{profileContent.about}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {profileContent.currentFocusAreas.map((area) => (
                <span key={area} className="skill-chip">{area}</span>
              ))}
            </div>
          </article>
        </section>

        {/* ─── FEATURED PROJECTS ───────────────────────────── */}
        <section id="projects" className="mb-20 md:mb-28">
          <div className="mb-10">
            <p className="section-kicker mb-3">Work</p>
            <h2 className="section-title-2026">Featured Projects</h2>
          </div>

          <div className="flex flex-col gap-4">
            {featuredProjects.map((project, i) => (
              <article
                key={project.title}
                className="project-card-2026 anim-fade-rise"
                style={{ animationDelay: `${0.14 + i * 0.07}s` }}
              >
                <div className="p-7 md:p-10">
                  <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="project-number-badge">0{i + 1}</span>
                        <div className="live-dot" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text-soft))" }}>
                          {project.status} · {project.date}
                        </span>
                      </div>

                      <h3
                        className="font-display font-extrabold tracking-tight"
                        style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.0 }}
                      >
                        {project.title}
                      </h3>
                      <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#FFD84A" }}>
                        {project.tagline}
                      </p>

                      <p className="mt-5 text-base leading-relaxed md:text-lg" style={{ color: "rgb(var(--text-soft))", maxWidth: "62ch" }}>
                        {project.summary}
                      </p>

                      {(project.stack || []).length > 0 && (
                        <div className="mt-6">
                          <p className="mb-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgb(var(--text-soft))" }}>Stack</p>
                          <div className="flex flex-wrap gap-2">
                            {project.stack.map((tech) => (
                              <span key={tech} className="skill-chip">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(project.tags || []).length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
                              style={{ border: "1px solid rgb(var(--text) / 0.18)", color: "rgb(var(--text-soft))" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 md:pt-1">
                      <a href={project.href} target="_blank" rel="noreferrer" className="btn-primary">
                        {project.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── BLOGS FROM X ────────────────────────────────── */}
        <section className="mb-20 md:mb-28">
          <div className="mb-10">
            <p className="section-kicker mb-3">Writing</p>
            <h2 className="section-title-2026">Blogs from X</h2>
          </div>

          {latestBlogs.length === 0 ? (
            <p className="font-mono text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              No posts yet — add one from the Admin page.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {latestBlogs.map((blog) => (
                <article key={blog.id} className="blog-glass-card flex flex-col p-6">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "#00CFCF" }}>
                    X Post
                  </span>
                  <h3 className="mt-3 font-display text-xl font-extrabold leading-tight tracking-tight md:text-2xl">
                    {blogHeadline(blog)}
                  </h3>
                  {blog.author && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "rgb(var(--text-soft))" }}>
                      {blog.author}
                    </p>
                  )}
                  {blogSubline(blog) && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed" style={{ color: "rgb(var(--text-soft))" }}>
                      {blogSubline(blog)}
                    </p>
                  )}
                  <div className="mt-5">
                    <a href={blog.url} target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: "11px", padding: "7px 14px" }}>
                      Open on X ↗
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ─── SCHOOL PROJECTS ─────────────────────────────── */}
        <section>
          <div className="mb-10">
            <p className="section-kicker mb-3">Academia</p>
            <h2 className="section-title-2026">School Projects</h2>
          </div>

          <div style={{ borderTop: "1px solid rgb(var(--text) / 0.1)", borderBottom: "1px solid rgb(var(--text) / 0.1)" }}>
            {profileContent.schoolProjects.map((project, i) => (
              <article
                key={project.title}
                className="school-project-row py-8"
                style={i < profileContent.schoolProjects.length - 1 ? { borderBottom: "1px solid rgb(var(--text) / 0.08)" } : undefined}
              >
                <div className="flex flex-wrap items-center gap-3 mb-1.5">
                  <h3 className="font-display text-xl font-bold md:text-2xl">{project.title}</h3>
                  <span className="cyber-badge" style={{ color: "rgb(var(--text-soft))", borderColor: "rgb(var(--text) / 0.2)" }}>
                    {project.status}
                  </span>
                </div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "rgb(var(--text-soft))" }}>
                  {project.tagline}
                </p>
                <p className="text-sm leading-relaxed md:text-base mb-4" style={{ color: "rgb(var(--text-soft))", maxWidth: "60ch" }}>
                  {project.summary}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
                      style={{ border: "1px solid rgb(var(--text) / 0.18)", color: "rgb(var(--text-soft))" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

export default App
