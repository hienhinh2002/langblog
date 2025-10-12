import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getDomain } from '../utils/url';
import ReactGA from 'react-ga4';

const ALLOWED_LANGS = ['ALL', 'ENGLISH', 'CHINESE'];

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  // đọc language từ URL
  const rawLang = (searchParams.get('language') || 'ALL').toUpperCase();
  const language = ALLOWED_LANGS.includes(rawLang) ? rawLang : 'ALL';
  const langLabel =
    language === 'ENGLISH' ? 'Tiếng Anh' :
    language === 'CHINESE' ? 'Tiếng Trung' : 'Tất cả';

  // tải dữ liệu theo language
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (language !== 'ALL') params.set('language', language);
        params.set('page', 0);
        params.set('size', 100);
        params.set('sort', 'publishedAt,desc');
        const res = await api.get(`/links?${params.toString()}`);
        const data = res?.data?.content || res?.data || [];
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [language]);

  // split featured + older
  const newest = items[0] || null;
  const older  = useMemo(() => (items.length > 1 ? items.slice(1) : []), [items]);

  // GA impression featured
  useEffect(() => {
    if (!newest) return;
    ReactGA.event('impression_featured', {
      link_id: newest.id ?? '(no-id)',
      link_title: newest.title ?? '',
      platform: newest.platform ?? '',
      language: newest.language ?? '',
      url: newest.url ?? '',
      position: 'featured_top',
    });
  }, [newest]);

  // CTA helpers
  const ctaLabel =
    (newest?.platform || '') === 'FACEBOOK'
      ? 'Đăng ký ngay (Facebook)'
      : (newest?.platform || '') === 'YOUTUBE'
      ? 'Xem trên YouTube'
      : (newest?.platform || '') === 'TIKTOK'
      ? 'Xem trên TikTok'
      : 'Đăng ký ngay';

  const dateStr =
    newest?.publishedAt || newest?.createdAt
      ? new Date(newest.publishedAt || newest.createdAt).toLocaleDateString('vi-VN')
      : '';

  const featuredClick = () => {
    if (!newest) return;
    ReactGA.event('click_featured_card', {
      link_id: newest.id ?? '(no-id)',
      link_title: newest.title ?? '',
      platform: newest.platform ?? '',
      language: newest.language ?? '',
      domain: getDomain(newest.url || ''),
      url: newest.url ?? '',
      position: 'featured',
    });
    nav(`/links/${newest.id}`);
  };

  const featuredCTA = (e) => {
    e.stopPropagation();
    if (!newest?.url) return;
    ReactGA.event('click_open_external', {
      link_id: newest.id ?? '(no-id)',
      link_title: newest.title ?? '',
      platform: newest.platform ?? '',
      language: newest.language ?? '',
      domain: getDomain(newest.url || ''),
      url: newest.url ?? '',
      position: 'featured',
      cta: ctaLabel,
      outbound: true,
    });
    window.open(newest.url, '_blank', 'noopener,noreferrer');
  };

  const onClickOlder = (it) => {
    ReactGA.event('click_sidebar_item', {
      link_id: it.id ?? '(no-id)',
      link_title: it.title ?? '',
      position: 'older_sidebar',
    });
  };

  // Skeletons
  const SkFeatured = () => (
    <div className="rounded-2xl border bg-white/60 animate-pulse h-[420px]" />
  );
  const SkItem = () => (
    <div className="rounded-xl border bg-white/70 p-3 flex items-start gap-3 min-h-[96px]">
      <div className="w-16 h-16 rounded-md bg-gray-200 animate-pulse" />
      <div className="flex-1 h-10 bg-gray-200/70 rounded-md animate-pulse" />
    </div>
  );

  // Sidebar: scrollbar khi > 5 item
  const ROW_H = 96;
  const GAP   = 16;
  const visibleCount = 5;
  const MAX_H = ROW_H * visibleCount + GAP * (visibleCount - 1);

  return (
    <div className="bg-slate-50">
      <main className="max-w-6xl mx-auto px-4 pt-6 pb-6 md:pt-8 md:pb-8 space-y-8">
        {/* CARD lớn bao 2 cột giống mock */}
        <section className="rounded-2xl border bg-white p-3 md:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            {/* LEFT - Featured */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-[20px] md:text-[22px] font-extrabold tracking-tight">Nổi bật</h2>
                <span className="pill">{langLabel}</span>
              </div>

              {loading ? (
                <SkFeatured />
              ) : !newest ? (
                <div className="rounded-xl border bg-white/60 p-6">
                  Không có bài tuyển sinh cho bộ lọc “{langLabel}”.
                </div>
              ) : (
                <article
                  className="group overflow-hidden rounded-2xl border bg-white hover:shadow-sm transition cursor-pointer"
                  onClick={featuredClick}
                  role="button"
                  tabIndex={0}
                  title={newest.title}
                  aria-label={`Xem chi tiết: ${newest.title}`}
                >
                  {/* Ảnh trên */}
                  {newest.thumbnail ? (
                    <img
                      src={newest.thumbnail}
                      alt={newest.title}
                      className="w-full h-[280px] md:h-[360px] object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-[280px] md:h-[360px] bg-slate-100 flex items-center justify-center text-slate-400">
                      Không có ảnh
                    </div>
                  )}

                  {/* Thông tin dưới */}
                  <div className="p-4 md:p-5 space-y-3">
                    <div className="flex items-center flex-wrap gap-2 text-xs">
                      {newest.language && (
                        <span className="pill-soft">{newest.language}</span>
                      )}
                      {newest.platform && (
                        <span className="pill-blue">{newest.platform}</span>
                      )}
                      <span className="text-slate-500">{getDomain(newest.url || '')}</span>
                      {dateStr && <span className="text-slate-500 ml-auto">{dateStr}</span>}
                    </div>

                    <h3 className="text-xl md:text-2xl font-extrabold leading-snug">
                      {newest.title}
                    </h3>

                    {newest.summary && (
                      <p className="text-[15px] leading-relaxed text-slate-600">
                        {newest.summary}
                      </p>
                    )}

                    <div className="pt-1 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={featuredCTA}
                        className="btn-primary"
                        aria-label={ctaLabel}
                      >
                        {ctaLabel}
                      </button>

                      <Link
                        to={`/links/${newest.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="btn-ghost"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </article>
              )}
            </div>

            {/* RIGHT - Older list */}
            <div className="lg:col-span-4">
              <h2 className="text-[20px] md:text-[22px] font-extrabold tracking-tight mb-3">
                Các đợt tuyển sinh trước
              </h2>

              <div
                className={`flex flex-col gap-3 ${older.length > visibleCount ? 'overflow-y-auto pr-2 overscroll-contain scrollbar-thin scrollbar-stable' : ''}`}
                style={older.length > visibleCount ? { maxHeight: `${MAX_H}px` } : undefined}
              >
                {loading
                  ? Array.from({ length: visibleCount }).map((_, i) => <SkItem key={i} />)
                  : older.map((it) => {
                      const d =
                        it.publishedAt || it.createdAt
                          ? new Date(it.publishedAt || it.createdAt).toLocaleDateString('vi-VN')
                          : '';
                      return (
                        <Link
                          key={it.id}
                          to={`/links/${it.id}`}
                          onClick={() => onClickOlder(it)}
                          className="rounded-xl border bg-white p-3 hover:bg-slate-50 transition flex items-start gap-3"
                        >
                          {it.thumbnail ? (
                            <img
                              src={it.thumbnail}
                              alt={it.title}
                              className="w-16 h-16 object-cover rounded-md border flex-shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-md border bg-gray-100 flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="line-clamp-2 leading-snug font-medium text-slate-800">
                              {it.title}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                              <span>{getDomain(it.url || '')}</span>
                              {d && <span aria-hidden>•</span>}
                              {d && <span>{d}</span>}
                            </div>
                          </div>
                        </Link>
                      );
                    })}

                {!loading && older.length === 0 && newest && (
                  <div className="text-sm text-gray-500 py-2">Không có thêm bài cho bộ lọc “{langLabel}”.</div>
                )}
                {!loading && !newest && (
                  <div className="text-sm text-gray-500 py-2">Không có bài cho bộ lọc “{langLabel}”.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer cards (đặt riêng component bên dưới) */}
      </main>
    </div>
  );
}
