import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl hero-gradient p-8 md:p-12 mb-8 border">
      <div className="absolute -right-24 -top-24 w-80 h-80 bg-blue-200 rounded-full opacity-40 blur-3xl floating" />
      <div className="absolute -left-16 top-10 w-64 h-64 bg-indigo-200 rounded-full opacity-40 blur-3xl" />
      <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm border mb-3">Blog Anh • Trung</span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Học ngoại ngữ mỗi ngày<br className="hidden md:block" />
            với các <span className="text-blue-600">bài viết chất lượng</span>
          </h1>
          <p className="text-slate-600 mt-3 md:text-lg">
            Khám phá bài viết Tiếng Anh & Tiếng Trung được biên soạn súc tích, dễ đọc,
            tối ưu cho người bận rộn.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#latest" className="btn btn-primary">Xem bài tuyển dụng mới nhất</a>
            {/* <a href="/create" className="btn btn-ghost">Tạo bài post</a> */}
          </div>
          <div className="mt-6 flex gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2"><span>⭐</span> Không quảng cáo</div>
            <div className="flex items-center gap-2"><span>🕒</span> Cập nhật hàng tuần</div>
            <div className="flex items-center gap-2"><span>🌐</span> Song ngữ Anh/Trung</div>
          </div>
        </div>
        <div className="order-first md:order-none">
          <div className="aspect-[4/3] md:aspect-[5/4] rounded-2xl border shadow-inner bg-gradient-to-br from-blue-50 to-indigo-50 grid place-items-center">
            <div className="text-center p-6">
              <div className="text-7xl md:text-8xl mb-3">🗂️</div>
              <Link to="/library" className="btn btn-ghost">Kho bài viết</Link>
              <p className="text-slate-500 text-sm">Mẹo học, từ vựng, ngữ pháp, giao tiếp…</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
