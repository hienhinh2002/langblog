import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { BackHome /*, BackHomeFloating*/ } from '../components/BackHome' // <-- thêm

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(() => setError('Không tải được bài viết'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="card">Đang tải…</div>
  if (error || !post) return <div className="card text-red-600">{error || 'Không tìm thấy bài viết'}</div>

  const dateStr = new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN')

  return (
    <article className="space-y-5">
      {/* Nút về trang trước (hoặc về Home nếu bạn dùng BackHomeFloating với to="/" ) */}
      <BackHome className="-ml-1" />

      <div className="flex items-center gap-2">
        {post.category && <span className="badge badge-orange">{post.category}</span>}
        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border">{post.language}</span>
        <span className="text-xs text-slate-500">• {dateStr}</span>
      </div>

      <h1 className="text-3xl font-extrabold">{post.title}</h1>

      {post.imageUrl && (
        <div className="rounded-xl overflow-hidden border">
          <img src={post.imageUrl} alt={post.title} className="w-full max-h-[420px] object-cover" />
        </div>
      )}

      {post?.content && (
        <article
          className="content-html mt-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {/* Nếu muốn luôn có nút nổi để về Home, bỏ comment dòng dưới: */}
      {/* <BackHomeFloating to="/" /> */}
    </article>
  )
}
