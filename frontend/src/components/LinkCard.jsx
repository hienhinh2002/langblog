// src/components/LinkCard.jsx
import { useNavigate, Link } from 'react-router-dom';
import { getDomain } from '../utils/url';
import ReactGA from 'react-ga4';

export default function LinkCard({ link = {} }) {
  const nav = useNavigate();

  const id      = link.id ?? '';
  const url     = link.url ?? '';
  const title   = link.title ?? '';
  const lang    = link.language ?? '';
  const plat    = link.platform ?? '';
  const thumb   = link.thumbnail ?? '';
  const domain  = getDomain(url);
  const dateStr =
    link.publishedAt || link.createdAt
      ? new Date(link.publishedAt || link.createdAt).toLocaleDateString('vi-VN')
      : '';

  const commonParams = {
    link_id: id || '(no-id)',
    link_title: title,
    platform: plat || '',
    language: lang || '',
    domain: domain || '',
    url: url || '',
    component: 'LinkCard',
  };

  const onOpenDetail = () => {
    // GA4: click toàn card -> vào chi tiết
    ReactGA.event('click_link_detail', {
      ...commonParams,
      position: 'card',
      transport_type: 'beacon',
    });

    if (id) nav(`/links/${id}`);
    else if (url) {
      // Fallback nếu thiếu id: mở ngoài
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const onOpenExternal = (e) => {
    e.stopPropagation(); // không điều hướng vào trang chi tiết

    // GA4: click CTA -> mở tab ngoài
    ReactGA.event('click_link_external', {
      ...commonParams,
      position: 'card',
      outbound: true,
      transport_type: 'beacon',
    });

    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const onKey = (e) => {
    if (e.key === 'Enter') {
      // GA4: enter trên card
      ReactGA.event('keypress_link_detail', {
        ...commonParams,
        key: 'Enter',
        position: 'card',
        transport_type: 'beacon',
      });
      onOpenDetail();
    }
  };

  const ctaLabel =
    plat === 'FACEBOOK' ? 'Đăng ký ngay (Facebook)'
  : plat === 'YOUTUBE'  ? 'Xem trên YouTube'
  : plat === 'TIKTOK'   ? 'Xem trên TikTok'
  :                       'Mở liên kết';

  return (
    <article
      className="relative group overflow-hidden rounded-2xl border bg-white/70 hover:shadow-md transition cursor-pointer"
      onClick={onOpenDetail}
      onKeyDown={onKey}
      role="button"
      tabIndex={0}
      title={title}
      aria-label={`Xem chi tiết: ${title}`}
    >
      {thumb ? (
        <img
          src={thumb}
          alt={title}
          loading="lazy"
          className="h-48 w-full object-cover transition group-hover:scale-[1.02]"
        />
      ) : (
        <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-400">
          Không có ảnh
        </div>
      )}

      <div className="p-4 space-y-2">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {lang && <span className="px-2 py-0.5 rounded-full bg-slate-100">{lang}</span>}
          {plat && (
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {plat}
            </span>
          )}
          {domain && <span className="text-slate-500">{domain}</span>}
          {dateStr && <span className="text-slate-500 ml-auto">{dateStr}</span>}
        </div>

        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600">
          {title}
        </h3>

        <div className="pt-1 flex gap-2">
          <button
            type="button"
            onClick={onOpenExternal}
            className="btn btn-primary"
            disabled={!url}
            aria-label={ctaLabel}
          >
            {ctaLabel}
          </button>

          {id && (
            <Link
              to={`/links/${id}`}
              onClick={(e) => {
                e.stopPropagation();
                // GA4: click link "Chi tiết"
                ReactGA.event('click_link_detail_anchor', {
                  ...commonParams,
                  position: 'card',
                  element: 'anchor',
                  transport_type: 'beacon',
                });
              }}
              className="btn btn-ghost"
              aria-label="Xem chi tiết"
            >
              Chi tiết
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
