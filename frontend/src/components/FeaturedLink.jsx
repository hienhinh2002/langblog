// src/components/FeaturedLink.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getDomain } from '../utils/url'
import ReactGA from 'react-ga4'

export default function FeaturedLink({ link = {} }) {
  const nav = useNavigate()
  if (!link) return null

  const id     = link.id ?? ''
  const url    = link.url ?? ''
  const title  = link.title ?? ''
  const lang   = link.language ?? ''
  const plat   = link.platform ?? ''
  const thumb  = link.thumbnail ?? ''
  const domain = getDomain(url)
  const dateStr =
    link.publishedAt || link.createdAt
      ? new Date(link.publishedAt || link.createdAt).toLocaleDateString('vi-VN')
      : ''

  const commonParams = {
    link_id: id || '(no-id)',
    link_title: title || '(no-title)',
    platform: plat || '',
    language: lang || '',
    domain: domain || '',
    url: url || '',
    component: 'FeaturedLink',
    position: 'featured',
  }

  const goDetail = () => {
    // GA4: click toàn card
    ReactGA.event('click_featured_card', {
      ...commonParams,
      transport_type: 'beacon',
    })

    if (id) nav(`/links/${id}`)
    else if (url) window.open(url, '_blank', 'noopener,noreferrer') // fallback nếu thiếu id
  }

  const openExternal = (e) => {
    e.stopPropagation()

    // GA4: click CTA (outbound)
    ReactGA.event('click_open_external', {
      ...commonParams,
      cta: 'Đăng ký ngay',
      outbound: true,
      transport_type: 'beacon',
    })

    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      ReactGA.event('keypress_featured_card', {
        ...commonParams,
        key: 'Enter',
        transport_type: 'beacon',
      })
      goDetail()
    }
  }

  return (
    <article
      onClick={goDetail}
      onKeyDown={onKey}
      role="button"
      tabIndex={0}
      className="relative grid md:grid-cols-2 gap-4 rounded-2xl border bg-white/70 overflow-hidden hover:shadow-md cursor-pointer transition"
      title={title}
      aria-label={`Xem chi tiết: ${title}`}
    >
      {thumb && (
        <img
          src={thumb}
          alt={title}
          loading="lazy"
          className="h-64 md:h-full w-full object-cover"
        />
      )}

      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs">
          {lang && <span className="px-2 py-0.5 rounded-full bg-slate-100">{lang}</span>}
          {plat && (
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {plat}
            </span>
          )}
          {domain && <span className="text-slate-500">{domain}</span>}
          {dateStr && <span className="ml-auto text-slate-500">{dateStr}</span>}
        </div>

        <h3 className="text-2xl font-semibold leading-snug group-hover:text-blue-600 line-clamp-2">
          {title}
        </h3>

        <button
          type="button"
          className="btn btn-primary"
          onClick={openExternal}
          disabled={!url}
          aria-label="Đăng ký ngay (mở liên kết ngoài)"
        >
          Đăng ký ngay
        </button>
      </div>
    </article>
  )
}
