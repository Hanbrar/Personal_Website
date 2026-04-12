import { useState } from "react"
import { Link } from "react-router-dom"
import { useLiveContent } from "../hooks/useLiveContent"

export default function Photos({ darkMode, setDarkMode }) {
  const { content, loading } = useLiveContent()
  const photos = content.photos || []
  const [expandedId, setExpandedId] = useState(null)

  function toggle(id) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">

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

        {/* ─── Header ──────────────────────────────────────── */}
        <header className="anim-fade-rise pt-16 pb-10 md:pt-20 md:pb-14">
          <p className="hero-eyebrow mb-5">
            <span className="hero-eyebrow-dot" />
            Visual archive
          </p>
          <h1 className="section-title-2026" style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)", letterSpacing: "-0.03em", lineHeight: 0.95 }}>
            Photos
          </h1>
          <div className="hero-rule mt-4" />
        </header>

        {/* ─── Grid / Empty state ──────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "rgb(var(--text-soft))" }}>
              Loading…
            </p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "rgb(var(--text-soft))" }}>
              Nothing here yet
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((photo) => (
              <div key={photo.id} className="flex flex-col">
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => toggle(photo.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggle(photo.id)}
                  aria-label={photo.caption || "View photo description"}
                  style={{ border: "1px solid rgb(var(--text) / 0.1)" }}
                >
                  <img
                    src={`/photos/${photo.filename}`}
                    alt={photo.caption || "Photo"}
                    className="h-64 w-full object-cover transition-all duration-300 group-hover:grayscale"
                  />
                  <div className="absolute inset-0 flex items-end justify-center bg-black/55 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                      Click for description
                    </span>
                  </div>
                </div>

                {photo.caption ? (
                  <p className="mt-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgb(var(--text-soft))" }}>
                    {photo.caption}
                  </p>
                ) : null}

                {expandedId === photo.id ? (
                  <div className="mt-2 rounded-xl p-4" style={{ background: "rgb(var(--surface-2))", border: "1px solid rgb(var(--text) / 0.1)" }}>
                    {photo.description ? (
                      <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--text-soft))" }}>
                        {photo.description}
                      </p>
                    ) : (
                      <p className="text-sm italic" style={{ color: "rgb(var(--text-soft))" }}>No description.</p>
                    )}
                    {photo.date ? (
                      <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#A3D900" }}>
                        {photo.date}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}
