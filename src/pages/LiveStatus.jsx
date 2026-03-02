import { Link } from "react-router-dom"
import { useLiveContent } from "../hooks/useLiveContent"

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

export default function LiveStatus({ darkMode, setDarkMode }) {
  const { content: liveContent } = useLiveContent()

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pb-24 pt-5 md:px-8 md:pt-7">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[48rem] neo-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-32 top-1/3 h-80 w-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #00A878, transparent 70%)" }}
        />
        <div
          className="absolute -right-28 top-1/4 h-72 w-72 rounded-full opacity-14"
          style={{ background: "radial-gradient(circle, #00CFCF, transparent 70%)" }}
        />
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </div>
          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            className="btn-ghost"
            style={{ fontSize: "12px", padding: "8px 16px" }}
            aria-label="Toggle theme"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </nav>

        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="rec-dot" />
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Live Status
            </h1>
          </div>
          <p className="font-mono text-sm leading-relaxed" style={{ color: "rgb(var(--text-soft))" }}>
            Every entry is what I am actively shipping, learning, or thinking about.
          </p>
        </div>

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
              {liveContent.blocks.map((block) => (
                <li
                  key={block.id}
                  className="feed-row grid gap-3 px-5 py-5 sm:grid-cols-[110px_1fr] sm:gap-6"
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
                    {block.url ? (
                      <a
                        href={block.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex font-mono text-[10px] font-bold uppercase tracking-[0.15em]"
                        style={{ color: "#00A878" }}
                      >
                        Open Link
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="section-title text-2xl md:text-3xl">Blogs from X</h2>
          {liveContent.blogs.length === 0 ? (
            <article className="anime-card card-cyan rounded-[12px] p-4">
              <p className="text-sm" style={{ color: "rgb(var(--text-soft))" }}>
                No blog cards yet. Add links in Admin.
              </p>
            </article>
          ) : (
            <div className="grid gap-4">
              {liveContent.blogs.map((blog) => (
                <article key={blog.id} className="anime-card card-cyan rounded-[12px] p-4">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "rgb(var(--text-soft))" }}>
                    X Blog
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight md:text-[1.65rem]">
                    {blogHeadline(blog)}
                  </h3>
                  {blog.author ? (
                    <p className="mt-1 text-xs font-mono uppercase tracking-[0.12em]" style={{ color: "rgb(var(--text-soft))" }}>
                      {blog.author}
                    </p>
                  ) : null}
                  {blogSubline(blog) ? (
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgb(var(--text-soft))" }}>
                      {blogSubline(blog)}
                    </p>
                  ) : null}
                  <div className="mt-3">
                    <a href={blog.url} target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: "12px", padding: "8px 14px" }}>
                      Open on X
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <Link to="/" className="btn-ghost">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
