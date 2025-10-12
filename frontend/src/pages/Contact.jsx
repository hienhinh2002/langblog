import { useState } from "react"

const CONTACT_EMAIL = "contact@langblog.local"
const FACEBOOK_URL  = "https://fb.me/langblog"
const MESSENGER_URL = "https://m.me/langblog"

export default function Contact() {
  const [name, setName]       = useState("")
  const [email, setEmail]     = useState("")
  const [topic, setTopic]     = useState("Hỗ trợ")
  const [message, setMessage] = useState("")
  const [info, setInfo]       = useState("")

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setInfo("Đã sao chép địa chỉ email!")
      setTimeout(() => setInfo(""), 2000)
    } catch {
      setInfo("Không thể sao chép. Vui lòng dùng Ctrl/Cmd+C.")
    }
  }

  const submit = (e) => {
    e.preventDefault()
    // mở ứng dụng email của người dùng (mailto)
    const subject = `📬 ${topic} — ${name || "Khách"}`
    const body = [
      `Xin chào LangBlog,`,
      ``,
      message || "(Chưa có nội dung)",
      ``,
      "-------------------------",
      `Người gửi: ${name || "(Ẩn danh)"}`,
      `Email liên hệ: ${email || "(không cung cấp)"}`,
    ].join("\n")
    const link = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = link
    setInfo("Đang mở ứng dụng email của bạn…")
    setTimeout(() => setInfo(""), 2500)
  }

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border bg-white/70 backdrop-blur p-6 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-300 to-violet-300 blur-3xl opacity-30" />
        <div className="pointer-events-none absolute -left-20 -bottom-24 h-80 w-80 rounded-full bg-gradient-to-tr from-rose-300 to-amber-300 blur-3xl opacity-25" />

        <div className="relative z-10 text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold">Liên hệ với LangBlog</h1>
          <p className="text-slate-600">
            Góp ý nội dung, hợp tác, hay đơn giản là muốn nói lời chào – chúng mình luôn sẵn sàng! ✨
          </p>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-2xl">✉️</div>
          <h3 className="mt-1 font-semibold">Email</h3>
          <p className="text-sm text-slate-600">{CONTACT_EMAIL}</p>
          <div className="mt-2 flex gap-2">
            <a className="btn btn-primary" href={`mailto:${CONTACT_EMAIL}`}>Gửi email</a>
            <button className="btn btn-ghost" onClick={copyEmail}>Sao chép</button>
          </div>
        </div>

        <div className="card">
          <div className="text-2xl">💬</div>
          <h3 className="mt-1 font-semibold">Facebook</h3>
          <p className="text-sm text-slate-600">Fanpage & Hộp thư Messenger</p>
          <div className="mt-2 flex gap-2">
            <a className="btn btn-primary" href={FACEBOOK_URL} target="_blank" rel="noreferrer">Fanpage</a>
            <a className="btn btn-ghost" href={MESSENGER_URL} target="_blank" rel="noreferrer">Messenger</a>
          </div>
        </div>

        <div className="card">
          <div className="text-2xl">📍</div>
          <h3 className="mt-1 font-semibold">Giờ làm việc</h3>
          <p className="text-sm text-slate-600">T2–T6: 9:00–18:00 • T7: 9:00–12:00</p>
          <p className="text-sm text-slate-600">Hà Nội, Việt Nam (Online-first)</p>
        </div>
      </section>

      {/* FORM */}
      <section className="rounded-3xl border bg-white/70 p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4">Gửi lời nhắn cho chúng mình</h2>
        {info && <div className="mb-3 text-sm text-blue-600">{info}</div>}

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Họ tên</label>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Tên của bạn"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email của bạn</label>
            <input
              type="email"
              className="w-full border rounded-xl px-3 py-2"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Chủ đề</label>
            <select
              className="w-full border rounded-xl px-3 py-2"
              value={topic}
              onChange={(e)=>setTopic(e.target.value)}
            >
              <option>Hỗ trợ</option>
              <option>Góp ý nội dung</option>
              <option>Hợp tác</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Nội dung</label>
            <textarea
              className="w-full border rounded-xl px-3 py-2 h-40"
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              placeholder="Bạn muốn nhắn gì cho LangBlog?"
              required
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button className="btn btn-primary">Mở email để gửi</button>
            <a className="btn btn-ghost" href={FACEBOOK_URL} target="_blank" rel="noreferrer">Nhắn qua Facebook</a>
          </div>
        </form>
      </section>

      {/* MAP (tuỳ chọn, có thể sửa vị trí) */}
      <section className="rounded-3xl overflow-hidden border">
        <iframe
          title="LangBlog location"
          src="https://www.google.com/maps?q=Hanoi%2C%20Vietnam&output=embed"
          className="w-full h-72"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  )
}
