import { useMemo, useRef, useState } from 'react'
import PostCard from './PostCard'

export default function PromoGrid({ title, posts = [], pageSize = 4 }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize))
  const boxRef = useRef(null)

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return posts.slice(start, start + pageSize)
  }, [posts, page, pageSize])

  const go = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
    // cuộn về đầu section cho gọn
    setTimeout(() => boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  if (!posts.length) return null

  return (
    <section ref={boxRef} className="space-y-3">
      <h3 className="text-xl font-bold">{title}</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {pageItems.map(p => <PostCard key={p.id} post={p} />)}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button className="btn btn-ghost" onClick={() => go(page - 1)} disabled={page === 1}>‹ Trước</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`btn ${n === page ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => go(n)}
            >
              {n}
            </button>
          ))}
          <button className="btn btn-ghost" onClick={() => go(page + 1)} disabled={page === totalPages}>Sau ›</button>
        </div>
      )}
    </section>
  )
}
