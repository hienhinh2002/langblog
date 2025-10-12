export default function About() {
  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-white/70 backdrop-blur p-6 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-300 to-violet-300 blur-3xl opacity-30" />
        <div className="pointer-events-none absolute -left-20 -bottom-24 h-80 w-80 rounded-full bg-gradient-to-tr from-rose-300 to-amber-300 blur-3xl opacity-25" />

        <div className="grid md:grid-cols-2 gap-6 items-center relative z-10">
          <div>
            <span className="text-sm font-semibold text-blue-600">Về LangBlog</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
              Học <span className="text-blue-600">Tiếng Anh</span> &{" "}
              <span className="text-violet-600">Tiếng Trung</span> mỗi ngày, nhẹ nhàng mà hiệu quả
            </h1>
            <p className="mt-3 text-slate-600">
              LangBlog là nơi chia sẻ bài viết gọn – dễ hiểu – áp dụng ngay: ngữ pháp, từ vựng,
              phát âm, mẹo luyện thi, kèm ví dụ đời thường cho cả người học Anh & Trung.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-semibold">
                ✍️ Micro-lessons 5–7 phút
              </span>
              <span className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-semibold">
                📚 EN &amp; ZH song hành
              </span>
              <span className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-semibold">
                ✅ Dễ áp dụng
              </span>
            </div>
          </div>

          <figure className="rounded-2xl overflow-hidden border">
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop"
              alt="Học ngoại ngữ mỗi ngày"
              className="w-full h-64 object-cover"
            />
          </figure>
        </div>
      </section>

      {/* TẠI SAO CHỌN CHÚNG TÔI */}
      <section className="grid md:grid-cols-4 gap-4">
        {[
          { icon: "🎯", title: "Dễ hiểu", desc: "Giải thích khái niệm khó bằng ví dụ gần gũi." },
          { icon: "🧩", title: "Dễ áp dụng", desc: "Mỗi bài có phần thực hành nhanh 5 phút." },
          { icon: "🌐", title: "Song ngữ", desc: "Lộ trình riêng cho English & HSK." },
          { icon: "💬", title: "Cộng đồng", desc: "Đón nhận góp ý & câu hỏi từ người học." },
        ].map((f) => (
          <div key={f.title} className="card">
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-1 font-semibold">{f.title}</h3>
            <p className="text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* QUY TRÌNH BIÊN TẬP */}
      <section className="card">
        <h2 className="text-xl font-bold mb-3">Chúng tôi biên tập như thế nào?</h2>
        <ol className="grid md:grid-cols-4 gap-3 text-sm">
          <li className="rounded-xl border p-3">
            <div className="font-semibold">1) Chọn đề tài</div>
            <p className="text-slate-600">Từ câu hỏi của cộng đồng & xu hướng thi cử.</p>
          </li>
          <li className="rounded-xl border p-3">
            <div className="font-semibold">2) Soạn & kiểm chứng</div>
            <p className="text-slate-600">Đọc chéo, đối chiếu từ điển/nguồn đáng tin.</p>
          </li>
          <li className="rounded-xl border p-3">
            <div className="font-semibold">3) Ví dụ & minh hoạ</div>
            <p className="text-slate-600">Ưu tiên ngữ cảnh đời thực, dễ ghi nhớ.</p>
          </li>
          <li className="rounded-xl border p-3">
            <div className="font-semibold">4) Cập nhật định kỳ</div>
            <p className="text-slate-600">Sửa/đính chính khi có thay đổi.</p>
          </li>
        </ol>
      </section>

      {/* SỐ LIỆU / MỤC TIÊU */}
      <section className="grid md:grid-cols-3 gap-4">
        {[
          { n: "500+", label: "bài viết chọn lọc" },
          { n: "20K+", label: "độc giả mỗi tháng" },
          { n: "92%", label: "độc giả áp dụng được ngay" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border bg-white/70 p-6 text-center">
            <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {s.n}
            </div>
            <div className="text-sm text-slate-600 mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ĐỘI NGŨ */}
      <section className="card">
        <h2 className="text-xl font-bold mb-3">Đội ngũ</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: "Minh Anh", role: "Biên tập English", initial: "M" },
            { name: "Hải Đăng", role: "Biên tập Chinese", initial: "H" },
            { name: "Tech Team", role: "Kỹ thuật & Thiết kế", initial: "T" },
          ].map((m) => (
            <div key={m.name} className="flex items-center gap-3 rounded-xl border p-3">
              <div className="h-12 w-12 rounded-full bg-slate-200 grid place-items-center text-slate-700 font-bold">
                {m.initial}
              </div>
              <div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-slate-600">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA ĐĂNG KÝ */}
      <section className="rounded-3xl border bg-gradient-to-tr from-blue-50 to-violet-50 p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-4 items-center">
          <div>
            <h3 className="text-xl font-bold">Nhận bài mới mỗi tuần</h3>
            <p className="text-slate-600 text-sm">
              Để không bỏ lỡ mẹo học hay cho Tiếng Anh & Tiếng Trung.
            </p>
          </div>
          <form className="flex gap-2">
            <input
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Nhập email của bạn"
              type="email"
            />
            <button type="button" className="btn btn-primary">Đăng ký</button>
          </form>
        </div>
      </section>
    </div>
  )
}
