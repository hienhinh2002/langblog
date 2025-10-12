import { Link } from 'react-router-dom'
import { htmlToText, truncate } from '../utils/text'

export default function PostCard({ post }) {
  if (!post) return null
  const excerpt = truncate(htmlToText(post.content), 180)
  const url = `/posts/${post.id}`

  return (
    <Link
      to={url}
      aria-label={`Xem chi tiết: ${post.title}`}
      className="
        block overflow-hidden rounded-2xl border bg-white/70
        hover:shadow-md transition
        focus:outline-none focus:ring-2 focus:ring-violet-500
      "
    >
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      )}

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          {post.language && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100">
              {post.language}
            </span>
          )}
          {post.category && (
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              {post.category}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
        <p className="text-slate-600 text-sm">{excerpt}</p>

        <div className="text-xs text-slate-500">
          {post.author ? `by ${post.author}` : ''} •{' '}
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN')}
        </div>
      </div>
    </Link>
  )
}
