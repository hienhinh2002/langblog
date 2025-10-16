// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    // giảm margin-top để “ăn” gần Home
    <footer className="relative mt-4 md:mt-6">
      <div className="max-w-6xl mx-auto px-3 md:px-4 pb-8">
        {/* separator mảnh, ít khoảng cách */}
        <div className="h-px bg-slate-200 rounded-full mb-4 md:mb-5" />

        {/* Slogan (giữa trang) */}
        <div className="rounded-2xl border bg-white px-4 py-3 md:px-6 md:py-4 mb-3 md:mb-4 text-center">
          <p className="text-[15px] md:text-base font-semibold text-slate-700">
            Biết thêm một ngôn ngữ, sống thêm một cuộc đời!
          </p>
        </div>

        {/* Liên hệ: liền khối, hover nhẹ */}
        <div className="grid gap-3 md:grid-cols-3">
          {/* Hotline */}
          <a
            href="tel:0989123456"
            className="rounded-2xl border bg-white p-4 flex items-center gap-3 hover:shadow-sm transition"
          >
            <span className="h-11 w-11 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600">
                <path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.03-.24c1.12.37 2.33.57 3.56.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.85 21 3 12.15 3 1a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.23.2 2.44.57 3.56a1 1 0 0 1-.24 1.03l-2.21 2.2Z" />
              </svg>
            </span>
            <div className="text-sm">
              <div className="text-slate-400">Hotline</div>
              <div className="font-semibold text-slate-800 text-xs">091 264 5095</div>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:contact@langblog.local"
            className="rounded-2xl border bg-white p-4 flex items-center gap-3 hover:shadow-sm transition"
          >
            <span className="h-11 w-11 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600">
                <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v.4l10 6.25L22 6.4V6a2 2 0 0 0-2-2Zm2 5.2-9.35 5.85a1 1 0 0 1-1.3 0L2 9.2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.2Z" />
              </svg>
            </span>
            <div className="text-sm">
              <div className="text-slate-400">Email</div>
              <div className="font-semibold text-slate-800 text-xs">deepenenglish@gmail.com</div>
            </div>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/tienganhmatcanban"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border bg-white p-4 flex items-center gap-3 hover:shadow-sm transition"
          >
            <span className="h-11 w-11 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
              {/* FB glyph đơn, đồng bộ kích thước với các icon khác */}
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600" aria-hidden>
                <path
                  fill="currentColor"
                  d="M13.5 22v-8h2.7l.4-3h-3.1V8.6c0-.87.24-1.46 1.5-1.46h1.6V4.5c-.28-.04-1.23-.12-2.33-.12-2.3 0-3.87 1.4-3.87 3.96V11H8v3h2.4v8h3.1Z"
                />
              </svg>
            </span>
            <div className="text-sm">
              <div className="text-slate-400">Facebook</div>
              <div className="font-semibold text-slate-800 hover:underline text-xs">
                https://www.facebook.com/tienganhmatcanban
              </div>
            </div>
          </a>

        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-slate-400 mt-4">
          © {new Date().getFullYear()} LangBlog
        </div>
      </div>
    </footer>
  );
}
