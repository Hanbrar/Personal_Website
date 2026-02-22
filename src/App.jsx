import { useEffect, useMemo, useState } from "react"
import { profileContent } from "./content/profileContent"

const THEME_KEY = "hb-theme"

const contactIconMap = {
  email: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M3.5 6.5h17a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 7.5l9 6 9-6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2A10 10 0 0 0 8.84 21.49c.5.09.66-.22.66-.48v-1.7c-2.76.6-3.34-1.17-3.34-1.17-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.88 1.52 2.31 1.08 2.88.83.08-.65.35-1.08.63-1.33-2.2-.25-4.52-1.1-4.52-4.91 0-1.08.39-1.96 1.03-2.65-.1-.25-.45-1.27.1-2.63 0 0 .84-.27 2.75 1.01A9.5 9.5 0 0 1 12 6.8a9.52 9.52 0 0 1 2.5.34c1.9-1.28 2.74-1.01 2.74-1.01.55 1.36.2 2.38.1 2.63.64.69 1.03 1.57 1.03 2.65 0 3.82-2.33 4.66-4.55 4.9.36.31.68.92.68 1.86V21c0 .27.18.58.67.48A10 10 0 0 0 12 2z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2h3.68l-8.03 9.18L24 22h-7.41l-5.8-6.75L4.88 22H1.2l8.6-9.83L.6 2h7.6l5.25 6.18L18.9 2zm-1.29 17.8h2.04L7.08 4.08H4.9L17.6 19.8z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3zM9 9h3.83v1.71h.05c.53-.95 1.84-1.95 3.8-1.95C20.75 8.76 22 11.12 22 14.2V21h-4v-5.98c0-1.43-.03-3.27-1.99-3.27s-2.3 1.56-2.3 3.17V21H9z" />
    </svg>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }

    const savedTheme = window.localStorage.getItem(THEME_KEY)
    if (savedTheme) {
      return savedTheme === "dark"
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    window.localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light")
  }, [darkMode])

  const lastUpdated = useMemo(() => {
    const date = new Date(profileContent.lastUpdated)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }, [])

  const currentBlock = profileContent.blocks[0]

  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-6 md:px-8 md:pt-10">
      <BackgroundEffects />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:gap-10">
        <header className="glass-panel grid rounded-3xl px-5 py-5 md:grid-cols-[1fr_auto] md:items-center md:px-7 md:py-6">
          <div>
            <p className="section-kicker">Personal Profile 2026</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-6xl">{profileContent.name}</h1>
            <p className="mt-2 text-sm text-[rgb(var(--text-soft))] md:text-base">
              {profileContent.title} · {profileContent.location}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 md:mt-0">
            <a
              href="#blocks"
              className="rounded-xl border border-white/55 bg-[rgb(var(--surface)/0.85)] px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 dark:border-white/10"
            >
              Jump to Blocks
            </a>
            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              className="soft-stroke rounded-xl border border-white/55 bg-[rgb(var(--surface)/0.72)] px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10"
              aria-label="Toggle dark mode"
            >
              {darkMode ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:gap-8">
          <article className="glass-panel neon-edge rounded-3xl p-6 md:p-8">
            <p className="section-kicker">What I am doing currently</p>
            <h2 className="section-title mt-2">Designing products that feel obvious and unforgettable.</h2>
            <p className="mt-4 text-base leading-relaxed text-[rgb(var(--text-soft))] md:text-lg">
              {profileContent.currentlyWorkingOn}
            </p>

            {currentBlock ? (
              <div className="mt-6 rounded-2xl border border-[rgb(var(--ring)/0.35)] bg-[rgb(var(--surface)/0.65)] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[rgb(var(--text-soft))]">Current status</p>
                <p className="mt-2 text-lg font-semibold">{currentBlock.title}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[rgb(var(--text-soft))]">
                  {currentBlock.date} · {currentBlock.context}
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              {profileContent.currentFocusAreas.map((focusArea) => (
                <span
                  key={focusArea}
                  className="glow-chip rounded-full border border-white/50 bg-[rgb(var(--surface)/0.74)] px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[rgb(var(--text-soft))] dark:border-white/10"
                >
                  {focusArea}
                </span>
              ))}
            </div>

            <p className="mt-5 font-mono text-xs text-[rgb(var(--text-soft))]">
              Last updated: {lastUpdated} · Edit <span className="font-semibold">src/content/profileContent.js</span>
            </p>
          </article>

          <aside className="relative mx-auto w-full max-w-md [perspective:1400px]">
            <div className="orbital-ring absolute -inset-5 rounded-[2.2rem]" />
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-teal-400/35 via-orange-300/20 to-transparent blur-2xl" />
            <div className="glass-panel relative rounded-[2rem] p-4 [transform-style:preserve-3d]">
              <div className="absolute inset-2 rounded-[1.5rem] border border-white/55 dark:border-white/10 [transform:translateZ(24px)]" />
              <img
                src="/profile.jpg"
                alt="Portrait of Hanryck Brar"
                className="relative z-10 h-[24rem] w-full rounded-[1.4rem] object-cover [transform:translateZ(34px)] md:h-[28rem]"
              />
              <div className="absolute bottom-8 left-8 z-20 rounded-full border border-white/70 bg-[rgb(var(--surface)/0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] dark:border-white/15">
                Product Design + Build
              </div>
            </div>
          </aside>
        </section>

        <section id="blocks" className="glass-panel neon-edge rounded-3xl p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr] md:gap-8">
            <div>
              <p className="section-kicker">Blocks</p>
              <h2 className="section-title mt-2">Live Status Feed</h2>
              <p className="mt-4 text-base leading-relaxed text-[rgb(var(--text-soft))]">
                This is your code-driven status timeline. Add a new object to <span className="font-semibold">blocks[]</span> in
                <span className="font-semibold"> src/content/profileContent.js</span>, and your newest update appears first.
              </p>
            </div>

            <div className="feed-shell relative overflow-hidden rounded-2xl border border-white/55 bg-[rgb(var(--surface)/0.72)] p-3 dark:border-white/10">
              <div className="scanline pointer-events-none absolute inset-0" />
              <ol className="relative z-10 divide-y divide-[rgb(var(--ring)/0.12)]">
                {profileContent.blocks.map((block) => (
                  <li key={`${block.date}-${block.title}`} className="feed-row grid items-start gap-3 px-2 py-3 sm:grid-cols-[100px_1fr] sm:gap-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[rgb(var(--text-soft))]">{block.date}</span>
                    <div>
                      <p className="text-sm font-medium leading-relaxed md:text-base">{block.title}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-soft))]">
                        {block.context}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="projects" className="glass-panel rounded-3xl p-6 md:p-8">
          <p className="section-kicker">What I have made so far</p>
          <h2 className="section-title mt-2">Selected Builds</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {profileContent.projects.map((project) => (
              <article
                key={project.title}
                className="group relative overflow-hidden rounded-2xl border border-white/50 bg-[rgb(var(--surface)/0.65)] p-4 transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-teal-400/20 blur-2xl transition group-hover:scale-125" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold">{project.title}</h3>
                    <span className="rounded-full border border-[rgb(var(--ring)/0.3)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[rgb(var(--text-soft))]">
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--text-soft))]">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[rgb(var(--surface-muted)/0.72)] px-2.5 py-1 text-[11px] font-medium text-[rgb(var(--text-soft))]"
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

        <section className="grid gap-6 md:grid-cols-[0.92fr_1.08fr] md:gap-8">
          <article id="about" className="glass-panel rounded-3xl p-6 md:p-8">
            <p className="section-kicker">About me</p>
            <h2 className="section-title mt-2">Who I am</h2>
            <p className="mt-4 text-base leading-relaxed text-[rgb(var(--text-soft))] md:text-lg">{profileContent.about}</p>
          </article>

          <article className="glass-panel rounded-3xl p-6 md:p-8">
            <p className="section-kicker">Links + Resume</p>
            <h2 className="section-title mt-2">Connect with me</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {profileContent.contacts.map((contact) => {
                const isExternal = contact.href.startsWith("http")

                return (
                  <a
                    key={contact.id}
                    href={contact.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/55 bg-[rgb(var(--surface)/0.8)] px-3 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10"
                  >
                    <span className="flex items-center gap-2 capitalize">
                      {contactIconMap[contact.id]}
                      {contact.label}
                    </span>
                    <span className="text-xs font-medium text-[rgb(var(--text-soft))]">{contact.value}</span>
                  </a>
                )
              })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href="/Hanryck_Brar_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-[rgb(var(--ring)/0.35)] bg-[rgb(var(--accent)/0.12)] px-4 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5"
              >
                View Resume
              </a>
              <a
                href="/Hanryck_Brar_Resume.pdf"
                download
                className="rounded-xl border border-white/55 bg-[rgb(var(--surface)/0.86)] px-4 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 dark:border-white/10"
              >
                Download Resume
              </a>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

function BackgroundEffects() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="neo-grid absolute inset-x-0 top-0 h-[32rem] opacity-60" />
      <div className="absolute left-1/2 top-14 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full border border-white/45 opacity-60 [transform:rotateX(71deg)] dark:border-white/10" />
      <div className="absolute left-1/2 top-20 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full border border-white/30 opacity-45 [transform:rotateX(71deg)] dark:border-white/5" />
      <div className="absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute -right-16 top-1/4 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
    </div>
  )
}

export default App
