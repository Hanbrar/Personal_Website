import { useEffect, useState } from "react"
import { Link, Route, Routes } from "react-router-dom"
import { profileContent } from "./content/profileContent"
import LiveStatus from "./pages/LiveStatus"
import Admin from "./pages/Admin"
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
      <Route path="/admin" element={<Admin darkMode={darkMode} setDarkMode={setDarkMode} />} />
    </Routes>
  )
}

function Home({ darkMode, setDarkMode }) {
  const { content: liveContent } = useLiveContent()
  const latestBlogs = [...(liveContent.blogs || [])].slice(0, 3)

  return (
    <div className="relative overflow-x-hidden px-4 pb-24 pt-5 md:px-8 md:pt-7">
      <div className="pointer-events-none fixed inset-0 -z-10 neo-grid opacity-90" />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 md:gap-9">
        <nav className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "rgb(var(--text-soft))" }}>
            HB 2026
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/live" className="nav-link">Live</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
            <a href="/Hanryck_Brar_Resume.pdf" target="_blank" rel="noreferrer" className="nav-link">
              Resume
            </a>
          </div>
        </nav>

        <header id="top" className="anime-card card-yellow overflow-hidden rounded-[18px]">
          <div className="stripe-overlay" />
          <div className="relative p-6 md:p-8">
            <div className="absolute right-5 top-5 md:right-7 md:top-7">
              <button
                type="button"
                onClick={() => setDarkMode((d) => !d)}
                className="btn-ghost"
                style={{ fontSize: "12px", padding: "8px 16px" }}
                aria-label="Toggle theme"
              >
                {darkMode ? "Use light" : "Use dark"}
              </button>
            </div>

            <div className="pr-32 md:pr-40">
              <h1
                className="name-glitch font-display text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
                data-text={profileContent.name}
              >
                {profileContent.name}
              </h1>
              <p className="mt-3 font-display text-xl font-bold tracking-tight md:text-2xl">
                {profileContent.title}
              </p>
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "rgb(var(--text-soft))" }}>
                {profileContent.subtitle}
              </p>
              <p className="mt-1 font-mono text-xs font-semibold tracking-wider" style={{ color: "rgb(var(--text-soft))" }}>
                {profileContent.location}
              </p>

              <div className="mt-5 flex flex-wrap gap-4">
                {profileContent.contacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] transition hover:opacity-60"
                    style={{ color: "rgb(var(--text-soft))" }}
                  >
                    {contactIconMap[contact.id]}
                    {contact.label}
                  </a>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/Hanryck_Brar_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ fontSize: "12px", padding: "9px 18px" }}
                >
                  View Resume
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2 md:gap-7">
          <article id="about" className="anime-card card-lime flex flex-col justify-center rounded-[18px] p-6 md:p-8">
            <p className="section-kicker mb-3">About me</p>
            <h2 className="section-title">Who I am</h2>
            <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: "rgb(var(--text-soft))" }}>
              {profileContent.about}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {profileContent.currentFocusAreas.map((area) => (
                <span key={area} className="skill-chip">{area}</span>
              ))}
            </div>
          </article>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="profile-frame w-full max-w-sm">
              <img
                src="/profile.jpg"
                alt={`Portrait of ${profileContent.name}`}
                className="h-[20rem] w-full object-cover md:h-[30rem]"
              />
            </div>
            <span className="cyber-badge" style={{ color: "rgb(var(--text-soft))", borderColor: "rgb(var(--line-bold))" }}>
              Product Design and Build
            </span>
          </div>
        </section>

        <section id="projects">
          <div className="mb-5">
            <h2 className="section-title">Featured Projects</h2>
          </div>

          <div className="grid gap-5">
            {profileContent.featuredProjects.map((project) => (
              <article key={project.title} className="anime-card card-yellow overflow-hidden rounded-[18px]">
                <div className="h-1.5 bg-black/90" />
                <div className="p-6 md:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="live-dot" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text))" }}>
                          {project.status}
                        </span>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text-soft))" }}>
                          {project.date}
                        </span>
                      </div>

                      <h3 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                        {project.title}
                      </h3>
                      <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text-soft))" }}>
                        {project.tagline}
                      </p>

                      <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: "rgb(var(--text-soft))" }}>
                        {project.summary}
                      </p>

                      <div className="mt-5">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text))" }}>Tech stack</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.stack.map((tech) => (
                            <span key={tech} className="skill-chip">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
                            style={{ border: "1px solid rgb(var(--text) / 0.35)", color: "rgb(var(--text))" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
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

        <section>
          <div className="mb-5">
            <h2 className="section-title">Blogs from X</h2>
          </div>

          {latestBlogs.length === 0 ? (
            <article className="anime-card card-cyan rounded-[14px] p-5">
              <p className="text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                No blog cards yet. Add one from the Admin page by pasting an X post URL.
              </p>
            </article>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {latestBlogs.map((blog) => (
                <article key={blog.id} className="anime-card card-cyan flex flex-col rounded-[14px] p-5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "rgb(var(--text-soft))" }}>
                    X Blog
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug">{blog.title}</h3>
                  {blog.author ? (
                    <p className="mt-1 text-xs font-mono uppercase tracking-[0.12em]" style={{ color: "rgb(var(--text-soft))" }}>
                      {blog.author}
                    </p>
                  ) : null}
                  <div className="mt-4">
                    <a href={blog.url} target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: "12px", padding: "8px 14px" }}>
                      Open on X
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-5">
            <h2 className="section-title">School Projects</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {profileContent.schoolProjects.map((project) => (
              <article key={project.title} className="anime-card card-lime flex flex-col overflow-hidden rounded-[14px]">
                <div className="h-1.5 bg-black/90" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-bold leading-snug md:text-lg">{project.title}</h3>
                      <p className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgb(var(--text-soft))" }}>
                        {project.tagline}
                      </p>
                    </div>
                    <span className="cyber-badge flex-shrink-0" style={{ color: "rgb(var(--text-soft))", borderColor: "rgb(var(--line-bold))" }}>
                      {project.status}
                    </span>
                  </div>

                  <p className="mt-3 flex-1 text-sm leading-relaxed" style={{ color: "rgb(var(--text-soft))" }}>
                    {project.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
                        style={{ border: "1px solid rgb(var(--text) / 0.35)", color: "rgb(var(--text))" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
