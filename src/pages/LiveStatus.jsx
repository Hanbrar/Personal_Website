import { Link } from "react-router-dom"
import { profileContent } from "../content/profileContent"

export default function LiveStatus({ darkMode, setDarkMode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-5 md:px-8 md:pt-7">

      {/* Background */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[48rem] neo-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #00A878, transparent 70%)" }} />
        <div className="absolute -right-28 top-1/4 h-72 w-72 rounded-full opacity-14"
          style={{ background: "radial-gradient(circle, #00CFCF, transparent 70%)" }} />
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8">

        {/* Nav */}
        <nav className="flex items-center justify-between">
          <Link to="/" className="nav-link">← Home</Link>
          <button
            type="button"
            onClick={() => setDarkMode(d => !d)}
            className="btn-ghost"
            style={{ fontSize: "12px", padding: "8px 16px" }}
            aria-label="Toggle theme"
          >
            {darkMode ? "☀ Light" : "☽ Dark"}
          </button>
        </nav>

        {/* Heading */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="rec-dot" />
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Live Status
            </h1>
          </div>
          <p className="font-mono text-sm leading-relaxed" style={{ color: "rgb(var(--text-soft))" }}>
            Every entry is what I am actively shipping, learning, or thinking about.
          </p>
        </div>

        {/* Feed */}
        <div className="feed-shell">
          <div className="feed-header-bar">
            <div className="feed-dot" />
            <div className="feed-dot" />
            <div className="feed-dot" />
            <span
              className="ml-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "rgb(0 0 0 / 0.55)" }}
            >
              status.log
            </span>
          </div>

          <div className="scanline-wrap">
            <div className="scanline" />
            <ol className="relative z-10">
              {profileContent.blocks.map((block) => (
                <li
                  key={`${block.date}-${block.title}`}
                  className="feed-row grid gap-3 px-5 py-5 sm:grid-cols-[100px_1fr] sm:gap-6"
                >
                  <span
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: "#00A878" }}
                  >
                    {block.date}
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-snug md:text-base">{block.title}</p>
                    <p
                      className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: "rgb(var(--text-soft))" }}
                    >
                      {block.context}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Back */}
        <div className="text-center">
          <Link to="/" className="btn-ghost">
            ← Back to Home
          </Link>
        </div>

      </main>
    </div>
  )
}
