import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'
import ReadingProgress from '../components/ReadingProgress'

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold
                     bg-white/70 text-slate-700">
      {children}
    </span>
  )
}

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.get(`/posts/${id}`)
      .then(async (res) => {
        const p = res.data
        setPost(p)
        // nạp bài liên quan theo cùng ngôn ngữ, bỏ bài đang xem
        const r = await api.get(`/posts?language=${p.language}`)
        setRelated(r.data.filter(x => x.id !== p.id).slice(0, 3))
      })
      .catch(() => setError('Không tải được bài viết'))
      .finally(() => setLoading(false))
  }, [id])

  const meta = useMemo(() => {
    if (!post) return { date: '', read: 0 }
    const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN')
    const words = (post.content || '').trim().split(/\s+/).length
    return { date, read: Math.max(1, Math.ceil(words / 220)) } // 220 wpm
  }, [post])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Đã sao chép liên kết!')
    } catch { /* ignore */ }
  }

  if (loading) return (
    <div className="space-y-3">
      <ReadingProgress />
      <div className="animate-pulse h-7 w-52 bg-slate-200 rounded" />
      <div className="animate-pulse h-9 w-4/5 bg-slate-200 rounded" />
      <div className="animate-pulse h-64 w-full bg-slate-200 rounded-xl" />
      <div className="animate-pulse h-40 w-full bg-slate-200 rounded-xl" />
    </div>
  )
  if (error || !post) return <div className="card text-red-600">{error || 'Không tìm thấy bài viết'}</div>

  return (
    <article className="space-y-6">
      <ReadingProgress />
      {/* breadcrumb */}
      <div className="text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-800">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span>{post.language === 'ENGLISH' ? 'Tiếng Anh' : 'Tiếng Trung'}</span>
      </div>

      {/* title + meta */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {post.category && (
            <span className="inline-flex items-center rounded-full bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 border border-orange-200">
              {post.category}
            </span>
          )}
          <Pill>{post.language === 'ENGLISH' ? 'Tiếng Anh' : 'Tiếng Trung'}</Pill>
          <Pill>📅 {meta.date}</Pill>
          <Pill>⏱ {meta.read} phút đọc</Pill>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight
                       bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
          {post.title}
        </h1>
      </header>

      {/* hero image */}
      {post.imageUrl && (
        <figure className="rounded-2xl overflow-hidden border bg-slate-50">
          <img src={post.imageUrl} alt={post.title}
               className="w-full max-h-[460px] object-cover" />
        </figure>
      )}

      {/* share row */}
      <div className="flex items-center gap-2">
        <button onClick={copyLink} className="btn btn-ghost">🔗 Sao chép liên kết</button>
        <a
          className="btn btn-ghost"
          target="_blank" rel="noreferrer"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
        >📘 Chia sẻ Facebook</a>
        <a
          className="btn btn-ghost"
          target="_blank" rel="noreferrer"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
        >🐦 Twitter/X</a>
      </div>

      {/* content */}
      <section className="prose max-w-none prose-p:leading-8 prose-p:text-lg prose-headings:scroll-mt-24">
        <p className="whitespace-pre-line">{post.content}</p>
      </section>

      {/* author box */}
      <section className="rounded-2xl border p-4 md:p-6 bg-gradient-to-tr from-slate-50 to-white">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-slate-200 grid place-items-center text-slate-600 font-bold">
            {(post.author || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{post.author || 'LangBlog Team'}</div>
            <div className="text-sm text-slate-600">Chia sẻ kiến thức Anh & Trung mỗi tuần.</div>
          </div>
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Bài liên quan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map(p => (
              <Link key={p.id} to={`/posts/${p.id}`} className="card hover:shadow-lg transition">
                {p.imageUrl && (
                  <div className="rounded-xl overflow-hidden border mb-3">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-36 object-cover" />
                  </div>
                )}
                <div className="text-sm text-slate-500">
                  {new Date(p.publishedAt || p.createdAt).toLocaleDateString('vi-VN')}
                </div>
                <h3 className="mt-1 font-semibold line-clamp-2">{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* back to top */}
      <div className="text-center">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="btn btn-ghost">↑ Lên đầu trang</button>
      </div>
    </article>
  )
}