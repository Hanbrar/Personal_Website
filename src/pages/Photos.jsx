import { useState } from "react"
import { Link } from "react-router-dom"
import { useLiveContent } from "../hooks/useLiveContent"

export default function Photos({ darkMode, setDarkMode }) {
  const { content } = useLiveContent()
  const photos = content.photos || []
  const [expandedId, setExpandedId] = useState(null)

  function toggle(id) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-5 md:px-8 md:pt-7">
      <div className="pointer-events-none fixed inset-0 -z-10 neo-grid opacity-90" />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/live" className="nav-link">Live</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </div>
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

        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">Photos</h1>
          <p className="mt-2 font-mono text-sm" style={{ color: "rgb(var(--text-soft))" }}>
            A collection of photos.
          </p>
        </div>

        {photos.length === 0 ? (
          <article className="anime-card card-lime rounded-[14px] p-5">
            <p className="text-sm" style={{ color: "rgb(var(--text-soft))" }}>
              No photos yet. Add some from the Admin page.
            </p>
          </article>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((photo) => (
              <div key={photo.id} className="flex flex-col">
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-[14px]"
                  onClick={() => toggle(photo.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggle(photo.id)}
                  aria-label={photo.caption || "View photo description"}
                >
                  <img
                    src={`/photos/${photo.filename}`}
                    alt={photo.caption || "Photo"}
                    className="h-56 w-full object-cover transition-all duration-300 group-hover:grayscale"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-end justify-center bg-black/50 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                      Click for description
                    </span>
                  </div>
                </div>

                {/* Caption */}
                {photo.caption ? (
                  <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgb(var(--text-soft))" }}>
                    {photo.caption}
                  </p>
                ) : null}

                {/* Expanded description */}
                {expandedId === photo.id ? (
                  <div className="mt-2 rounded-[10px] p-3" style={{ border: "1px solid rgb(var(--text) / 0.2)" }}>
                    {photo.description ? (
                      <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--text-soft))" }}>
                        {photo.description}
                      </p>
                    ) : (
                      <p className="text-sm italic" style={{ color: "rgb(var(--text-soft))" }}>No description.</p>
                    )}
                    {photo.date ? (
                      <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#00A878" }}>
                        {photo.date}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/" className="btn-ghost">Back to Home</Link>
        </div>
      </main>
    </div>
  )
}
