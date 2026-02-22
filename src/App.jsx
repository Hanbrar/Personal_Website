import { useEffect, useMemo, useState } from "react"
import { profileContent } from "./content/profileContent"

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
    if (typeof window === "undefined") return true
    const saved = window.localStorage.getItem(THEME_KEY)
    if (saved) return saved === "dark"
    return true
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    window.localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light")
  }, [darkMode])

  const lastUpdated = useMemo(() => {
    const d = new Date(profileContent.lastUpdated)
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
  }, [])

  const currentBlock = profileContent.blocks[0]

  return (
    <div className="relative overflow-hidden px-4 pb-24 pt-5 md:px-8 md:pt-7">

      {/* Background grid */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[48rem] neo-grid opacity-60" />

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #00CFCF, transparent 70%)" }} />
        <div className="absolute -right-28 top-1/4 h-80 w-80 rounded-full opacity-14"
          style={{ background: "radial-gradient(circle, #0066FF, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #A3D900, transparent 70%)" }} />
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 md:gap-9">

        {/* ──────────────────── NAV ──────────────────── */}
        <nav className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold tracking-[0.22em] uppercase" style={{ color: "rgb(var(--text-soft))" }}>
            HB · 2026
          </span>
          <div className="flex items-center gap-1">
            <a href="#top" className="nav-link">Home</a>
            <a
              href="https://www.linkedin.com/in/hanryck-brar/"
              target="_blank"
              rel="noreferrer"
              className="nav-link"
            >
              Profile
            </a>
            <a
              href="/Hanryck_Brar_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="nav-link"
            >
              Resume ↗
            </a>
          </div>
        </nav>

        {/* ──────────────────── HEADER ──────────────────── */}
        <header id="top" className="anime-card card-yellow rounded-[18px] overflow-hidden">
          <div className="stripe-overlay" />
          <div className="relative p-6 md:p-8">

            {/* Buttons — top right corner */}
            <div className="absolute right-5 top-5 flex gap-2 md:right-7 md:top-7">
              <a href="#blocks" className="btn-primary" style={{ fontSize: "12px", padding: "8px 16px" }}>
                Live Status ↓
              </a>
              <button
                type="button"
                onClick={() => setDarkMode(d => !d)}
                className="btn-ghost"
                style={{ fontSize: "12px", padding: "8px 16px" }}
                aria-label="Toggle theme"
              >
                {darkMode ? "☀ Light" : "☽ Dark"}
              </button>
            </div>

            {/* Name block — full width left */}
            <div className="pr-52 md:pr-64">
              <p className="section-kicker mb-4">Personal Profile 2026</p>
              <h1
                className="name-glitch font-display text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
                data-text={profileContent.name}
              >
                {profileContent.name}
              </h1>
              <p className="mt-3 font-display text-xl font-bold tracking-tight md:text-2xl">
                {profileContent.title}
              </p>
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#00CFCF" }}>
                {profileContent.subtitle}
              </p>
              <p className="mt-2 font-mono text-xs font-semibold tracking-wider" style={{ color: "rgb(var(--text-soft))" }}>
                {profileContent.location}
              </p>
            </div>
          </div>
        </header>

        {/* ──────────────── WORK + PROFILE ──────────────── */}
        <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-8">

          {/* Current work */}
          <article className="anime-card card-cyan rounded-[18px] p-6 md:p-8">
            <p className="section-kicker mb-3">What I am doing currently</p>
            <h2 className="section-title">Designing products that feel obvious and unforgettable.</h2>

            <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: "rgb(var(--text-soft))" }}>
              {profileContent.currentlyWorkingOn}
            </p>

            {currentBlock && (
              <div className="mt-5 rounded-xl p-4" style={{ border: "2px solid #00A878", background: "rgb(0 168 120 / 0.07)" }}>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#00A878" }}>
                  ▸ Current status
                </p>
                <p className="mt-2 text-base font-bold">{currentBlock.title}</p>
                <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text-soft))" }}>
                  {currentBlock.date} · {currentBlock.context}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {profileContent.currentFocusAreas.map((area) => (
                <span key={area} className="skill-chip">{area}</span>
              ))}
            </div>

            <p className="mt-6 font-mono text-[10px]" style={{ color: "rgb(var(--text-soft))" }}>
              Last updated: {lastUpdated}
            </p>
          </article>

          {/* Profile image */}
          <aside className="flex flex-col items-center justify-center gap-5">
            <div className="profile-frame w-full max-w-sm">
              <img
                src="/image.png"
                alt={`Portrait of ${profileContent.name}`}
                className="h-[26rem] w-full object-cover md:h-[30rem]"
              />
            </div>
            <span
              className="cyber-badge"
              style={{ color: "#FFD84A", borderColor: "#FFD84A", background: "rgb(255 216 74 / 0.1)" }}
            >
              Product Design + Build
            </span>
          </aside>
        </section>

        {/* ──────────────── LIVE STATUS FEED ────────────── */}
        <section id="blocks" className="anime-card card-teal rounded-[18px] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-8">
            <div>
              <p className="section-kicker mb-3">Blocks</p>
              <h2 className="section-title">Live Status Feed</h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: "rgb(var(--text-soft))" }}>
                Code-driven status timeline. Add a new entry to{" "}
                <code className="font-mono font-bold" style={{ color: "#00CFCF" }}>profileContent.js</code>{" "}
                and your newest update appears first.
              </p>
            </div>

            <div className="feed-shell">
              <div className="feed-header-bar">
                <div className="feed-dot" />
                <div className="feed-dot" />
                <div className="feed-dot" />
                <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgb(0 0 0 / 0.55)" }}>
                  status.log
                </span>
              </div>

              <div className="scanline-wrap">
                <div className="scanline" />
                <ol className="relative z-10">
                  {profileContent.blocks.map((block) => (
                    <li
                      key={`${block.date}-${block.title}`}
                      className="feed-row grid gap-3 px-4 py-4 sm:grid-cols-[92px_1fr] sm:gap-5"
                    >
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#00A878" }}>
                        {block.date}
                      </span>
                      <div>
                        <p className="text-sm font-semibold leading-snug md:text-base">{block.title}</p>
                        <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text-soft))" }}>
                          {block.context}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────── FEATURED BUILD ──────────────── */}
        <section id="projects">
          <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="section-kicker">Main Build</p>
            <h2 className="section-title">Featured Project</h2>
          </div>

          <article className="anime-card card-yellow rounded-[18px] overflow-hidden">
            <div className="h-1.5" style={{ background: "#FFD84A" }} />
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                {/* Info */}
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="live-dot" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#A3D900" }}>
                      Live
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text-soft))" }}>
                      · {profileContent.mainProject.date}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                    {profileContent.mainProject.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "rgb(var(--text-soft))" }}>
                    {profileContent.mainProject.tagline}
                  </p>

                  <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: "rgb(var(--text-soft))" }}>
                    {profileContent.mainProject.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {profileContent.mainProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
                        style={{ background: "rgb(255 216 74 / 0.12)", color: "#FFD84A" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                  <a
                    href={profileContent.mainProject.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    deepconverge.ai ↗
                  </a>
                </div>

              </div>
            </div>
          </article>
        </section>

        {/* ──────────────── SCHOOL PROJECTS ─────────────── */}
        <section>
          <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="section-kicker">Engineering</p>
            <h2 className="section-title">School Projects</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {profileContent.schoolProjects.map((project, i) => {
              const scheme = i === 0
                ? { card: "card-lime",  color: "#A3D900", bg: "rgb(163 217 0  / 0.10)" }
                : { card: "card-teal",  color: "#00A878", bg: "rgb(0 168 120  / 0.10)" }

              return (
                <article
                  key={project.title}
                  className={`anime-card ${scheme.card} flex flex-col overflow-hidden rounded-[14px]`}
                >
                  <div className="h-1.5" style={{ background: scheme.color }} />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-base font-bold leading-snug md:text-lg">{project.title}</h3>
                        <p className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: scheme.color }}>
                          {project.tagline}
                        </p>
                      </div>
                      <span
                        className="cyber-badge flex-shrink-0"
                        style={{ color: scheme.color, borderColor: scheme.color, background: scheme.bg }}
                      >
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
                          style={{ background: scheme.bg, color: scheme.color }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ──────────────── ABOUT + CONTACT ─────────────── */}
        <section className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-8">

          <article id="about" className="anime-card card-lime rounded-[18px] p-6 md:p-8">
            <p className="section-kicker mb-3">About me</p>
            <h2 className="section-title">Who I am</h2>
            <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: "rgb(var(--text-soft))" }}>
              {profileContent.about}
            </p>
          </article>

          <article className="anime-card card-blue rounded-[18px] p-6 md:p-8">
            <p className="section-kicker mb-3">Links + Resume</p>
            <h2 className="section-title">Connect with me</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {profileContent.contacts.map((contact) => {
                const isExternal = contact.href.startsWith("http")
                return (
                  <a
                    key={contact.id}
                    href={contact.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    className="contact-link"
                  >
                    <span className="flex items-center gap-2 capitalize">
                      {contactIconMap[contact.id]}
                      {contact.label}
                    </span>
                    <span className="truncate font-mono text-[11px] font-semibold" style={{ color: "rgb(var(--text-soft))" }}>
                      {contact.value}
                    </span>
                  </a>
                )
              })}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a href="/Hanryck_Brar_Resume.pdf" target="_blank" rel="noreferrer" className="btn-primary justify-center">
                View Resume ↗
              </a>
              <a href="/Hanryck_Brar_Resume.pdf" download className="btn-ghost justify-center">
                Download ↓
              </a>
            </div>
          </article>

        </section>
      </main>
    </div>
  )
}

export default App
