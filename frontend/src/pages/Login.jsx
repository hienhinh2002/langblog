// src/pages/Login.jsx
import { useState } from 'react'
import api from '../services/api'
import { scheduleAutoLogout } from '../utils/auth'
export default function Login() {
  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  const fillDemo = () => {
    setUsername('admin')
    setPassword('admin123')
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { username, password })
      const { token } = res.data
      localStorage.setItem('token', token)
      scheduleAutoLogout()
      // nếu bạn KHÔNG dùng axios interceptor, có thể bật dòng dưới:
      // api.defaults.headers.Authorization = `Bearer ${token}`
      // Reload để navbar + app nhận trạng thái đăng nhập
      window.location.assign('/')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Đăng nhập thất bại. Vui lòng kiểm tra tài khoản/mật khẩu.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[70vh] md:min-h-[75vh] grid place-items-center
                    bg-gradient-to-b from-blue-50 via-white to-white">
      {/* hero décor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl opacity-30
                        bg-gradient-to-tr from-blue-300 to-violet-300" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-25
                        bg-gradient-to-tr from-rose-300 to-amber-300" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl grid md:grid-cols-2 gap-6 px-4">
        {/* Left: hero copy + image */}
        <div className="hidden md:flex flex-col justify-center">
          <div className="rounded-3xl overflow-hidden border bg-white/60 backdrop-blur p-6 shadow-sm">
            <div className="text-sm font-semibold text-blue-600">Welcome back 👋</div>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight">
              Học tiếng <span className="text-blue-600">Anh</span> &{' '}
              <span className="text-violet-600">Trung</span> hiệu quả mỗi ngày
            </h1>
            <p className="mt-3 text-slate-600">
              Đăng nhập để đăng bài, quản lý nội dung và lưu lại các chủ đề yêu thích.
            </p>
            <div className="mt-4 rounded-2xl overflow-hidden border">
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
                alt="English study"
                className="w-full h-52 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right: form card */}
        <form onSubmit={submit}
              className="rounded-3xl border bg-white/70 backdrop-blur p-6 md:p-8 shadow-sm space-y-5">
          <div>
            <div className="text-sm font-semibold text-blue-600">LangBlog</div>
            <h2 className="text-2xl font-bold mt-1">Đăng nhập tài khoản</h2>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
              <input
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                placeholder="Ví dụ: admin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="w-full rounded-xl border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button type="button"
                        onClick={()=>setShowPass(v=>!v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                  {showPass ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.01-2.92 3.07-5.23 5.66-6.58M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.73 11.73 0 0 1-2.26 3.34M15 12a3 3 0 1 1-6 0" />
                      <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 select-none">
                <input type="checkbox" className="rounded border-slate-300" /> Ghi nhớ tôi
              </label>
              <span className="text-slate-500">Quên mật khẩu?</span>
            </div>
          </div>

          <button
            className="btn btn-primary w-full h-11 text-[15px] font-semibold"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>

          <div className="text-center text-sm text-slate-500">
            Chưa có tài khoản? <span className="text-slate-700">Liên hệ quản trị để được cấp.</span>
          </div>
        </form>
      </div>
    </div>
  )
}
