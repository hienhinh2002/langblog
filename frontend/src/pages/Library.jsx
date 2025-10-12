import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const topics = [
  { slug: 'vocabulary',  title: 'Từ vựng',   desc: 'Spaced repetition, collocations, flashcards…',  emoji: '🧠',  gradient: 'from-emerald-500 to-teal-500' },
  { slug: 'grammar',     title: 'Ngữ pháp',  desc: 'Cấu trúc cốt lõi, mẹo tránh lỗi thường gặp.',     emoji: '📐',  gradient: 'from-violet-500 to-indigo-500' },
  { slug: 'speaking',    title: 'Giao tiếp', desc: 'Shadowing, phản xạ, tình huống thực tế.',        emoji: '🎙️',  gradient: 'from-rose-500 to-orange-500' },
  { slug: 'listening',   title: 'Nghe hiểu', desc: 'Podcast, TED, phim ảnh có phụ đề.',               emoji: '🎧',  gradient: 'from-sky-500 to-cyan-500' },
  { slug: 'reading',     title: 'Đọc hiểu',  desc: 'Skimming, scanning, mở rộng vốn từ.',             emoji: '📚',  gradient: 'from-amber-500 to-yellow-500' },
  { slug: 'tips',        title: 'Mẹo học',   desc: 'Lộ trình, tài nguyên, thói quen học hiệu quả.',   emoji: '✨',  gradient: 'from-fuchsia-500 to-pink-500' },
]

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border bg-white/70 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  )
}

function TopicTile({ t }) {
  return (
    <Link
      to={`/?q=${encodeURIComponent(t.title)}#latest`} // điều hướng đơn giản về Home + filter query
      className="relative overflow-hidden rounded-2xl border bg-white/70 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className={`h-2 w-full bg-gradient-to-r ${t.gradient}`} />
      <div className="p-4">
        <div className="text-3xl">{t.emoji}</div>
        <h4 className="mt-2 font-semibold">{t.title}</h4>
        <p className="text-sm text-slate-600 line-clamp-2">{t.desc}</p>
      </div>
    </Link>
  )
}

export default function Library() {
  const [kw, setKw] = useState('')
  const nav = useNavigate()
  const search = (e) => {
    e.preventDefault()
    const q = kw.trim()
    nav(q ? `/?q=${encodeURIComponent(q)}#latest` : '/#latest')
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-sky-50 via-white to-white" />
        <Card className="p-6 md:p-8">
          <div className="text-sm text-slate-500">
            <Link to="/" className="hover:underline">Trang chủ</Link> <span className="mx-1">/</span> Kho bài viết
          </div>

          <div className="mt-2 grid md:grid-cols-[1.1fr,0.9fr] gap-6 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Kho bài viết<br />
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  cho người bận rộn
                </span>
              </h1>
              <p className="mt-2 text-slate-600">
                Tổng hợp chủ đề học Tiếng Anh &amp; Tiếng Trung: mẹo học, từ vựng, ngữ pháp, giao tiếp…
                Tất cả được biên soạn súc tích và dễ đọc.
              </p>

              <form onSubmit={search} className="mt-4 rounded-2xl border bg-white/80 p-3 flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" strokeWidth="2" />
                  <path d="M20 20L17 17" strokeWidth="2" />
                </svg>
                <input
                  value={kw}
                  onChange={(e) => setKw(e.target.value)}
                  placeholder="Tìm nhanh (ví dụ: shadowing, HSK 4, phrasal verbs…) "
                  className="flex-1 outline-none bg-transparent"
                />
                <button className="btn btn-primary">Tìm</button>
              </form>

              <div className="mt-3 text-xs text-slate-500">
                Gợi ý: speaking • podcast • ngữ pháp cơ bản • từ vựng theo chủ đề
              </div>

              <div className="mt-4 flex gap-2">
                <Link to="/#latest" className="btn btn-primary">Xem bài mới</Link>
                <Link to="/manage" className="btn btn-ghost">Quản lý (admin)</Link>
              </div>
            </div>

            {/* hình minh họa thư mục */}
            <div className="flex items-center justify-center">
              <div className="rounded-2xl border bg-white/60 w-full h-48 md:h-56 flex flex-col items-center justify-center">
                <div className="text-7xl">📁</div>
                <div className="mt-2 font-semibold">Tổng hợp chủ đề</div>
                <div className="text-sm text-slate-500">Mẹo học • Từ vựng • Ngữ pháp • Giao tiếp…</div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Hướng dẫn nhanh */}
      <section className="grid md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-3xl">🚀</div>
          <h3 className="mt-2 font-semibold">Bắt đầu như thế nào?</h3>
          <p className="text-slate-600 text-sm">
            Chọn 1 mục tiêu nhỏ (15–20 phút/ngày), theo dõi lộ trình 30 ngày để hình thành thói quen.
          </p>
          <Link to="/#latest" className="btn btn-ghost mt-3">Xem bài khởi động</Link>
        </Card>
        <Card className="p-5">
          <div className="text-3xl">🧰</div>
          <h3 className="mt-2 font-semibold">Bộ công cụ gợi ý</h3>
          <p className="text-slate-600 text-sm">
            Anki/Quizlet cho từ vựng, HelloTalk/Tandem cho giao tiếp, Spotify & TED cho nghe hiểu.
          </p>
          <a href="https://www.ankiweb.net" target="_blank" rel="noreferrer" className="btn btn-ghost mt-3">Thử ngay</a>
        </Card>
        <Card className="p-5">
          <div className="text-3xl">🗓️</div>
          <h3 className="mt-2 font-semibold">Lộ trình 30 ngày</h3>
          <p className="text-slate-600 text-sm">
            Tuần 1: từ vựng cơ bản • Tuần 2: nghe–nói • Tuần 3: đọc–ngữ pháp • Tuần 4: ôn & kiểm tra nhẹ.
          </p>
          <Link to="/#latest" className="btn btn-ghost mt-3">Xem lộ trình</Link>
        </Card>
      </section>

      {/* Topic grid */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Chủ đề nổi bật</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map(t => <TopicTile key={t.slug} t={t} />)}
        </div>
      </section>

      {/* Bắt đầu từ đây */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Bắt đầu từ đây</h2>
        <Card className="p-5">
          <ol className="grid md:grid-cols-4 gap-4 text-sm">
            <li className="rounded-xl border p-4">
              <div className="font-semibold">1) Xác định mục tiêu</div>
              <div className="text-slate-600 mt-1">VD: “mỗi ngày 15 phút nghe + 10 từ mới”.</div>
            </li>
            <li className="rounded-xl border p-4">
              <div className="font-semibold">2) Chọn 1 chủ đề</div>
              <div className="text-slate-600 mt-1">Tập trung trong 1–2 tuần (speaking / HSK / phrasal verbs…)</div>
            </li>
            <li className="rounded-xl border p-4">
              <div className="font-semibold">3) Lặp lại thông minh</div>
              <div className="text-slate-600 mt-1">Spaced repetition + mini test mỗi cuối tuần.</div>
            </li>
            <li className="rounded-xl border p-4">
              <div className="font-semibold">4) Ghi lại tiến độ</div>
              <div className="text-slate-600 mt-1">Nhật ký 1 dòng/ngày → giữ động lực đều đặn.</div>
            </li>
          </ol>
        </Card>
      </section>

      {/* FAQ ngắn */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Câu hỏi thường gặp</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="font-semibold">Mỗi ngày nên học bao lâu?</div>
            <div className="text-slate-600 text-sm mt-1">
              20–30 phút tập trung tốt hơn việc “cố” học 2–3 giờ/tuần.
            </div>
          </Card>
          <Card className="p-5">
            <div className="font-semibold">Không có partner nói chuyện thì sao?</div>
            <div className="text-slate-600 text-sm mt-1">
              Bắt đầu với shadowing + tự ghi âm, sau đó dùng HelloTalk/Tandem để giao tiếp nhẹ.
            </div>
          </Card>
          <Card className="p-5">
            <div className="font-semibold">Học từ vựng mãi không nhớ?</div>
            <div className="text-slate-600 text-sm mt-1">
              Học theo cụm & ngữ cảnh, dùng SRS (Anki/Quizlet) và ôn lại xen kẽ.
            </div>
          </Card>
          <Card className="p-5">
            <div className="font-semibold">Bắt đầu Tiếng Trung từ đâu?</div>
            <div className="text-slate-600 text-sm mt-1">
              Pinyin + 4 thanh điệu trước, sau đó tới từ/câu giao tiếp cơ bản (HSK 1–2).
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-2xl border bg-white/70 px-5 py-4">
          <div className="text-2xl">📰</div>
          <div className="text-left">
            <div className="font-semibold">Sẵn sàng đọc bài mới?</div>
            <div className="text-sm text-slate-600 -mt-0.5">Tổng hợp bài viết mới nhất, cập nhật hằng tuần.</div>
          </div>
          <Link to="/#latest" className="btn btn-primary ml-3">Xem ngay</Link>
        </div>
      </section>
    </div>
  )
}
