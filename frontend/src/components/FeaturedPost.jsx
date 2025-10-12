import { Link } from 'react-router-dom'
import { htmlToText, truncate } from '../utils/text'

export default function FeaturedPost({ post }) {
  if (!post) return null

  const excerpt = truncate(htmlToText(post.content), 260)
  const url = `/posts/${post.id}`

  return (
    <Link
      to={url}
      aria-label={`Xem chi tiết: ${post.title}`}
      className="
        block rounded-2xl border overflow-hidden bg-white/70
        hover:shadow-md transition focus:outline-none
        focus:ring-2 focus:ring-violet-500
      "
    >
      <div className="grid md:grid-cols-2">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}

        <div className="p-6 space-y-3">
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
            <span className="text-slate-500">
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          <h2 className="text-2xl font-bold group-hover:text-violet-700">
            {post.title}
          </h2>

          <p className="text-slate-700">{excerpt}</p>

          {/* nút hiển thị (thực chất là span), vì toàn bộ card đã là Link */}
          <span className="inline-flex items-center px-3 py-2 rounded-xl bg-blue-600 text-white mt-1 w-fit">
            Đọc tiếp
          </span>
        </div>
      </div>
    </Link>
  )
}
