// src/services/api.js
import axios from 'axios'

// Ưu tiên env Vite, fallback localhost
const BASE_URL =
  (import.meta.env && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : 'https://langblog-2.onrender.com/api')

// Khởi tạo instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 150000,
  // withCredentials: true, // bật nếu backend cần cookie
})

// --------- GLOBAL LOADING EMITTER ----------
let pending = 0
const emitLoading = () =>
  document.dispatchEvent(new CustomEvent('app:loading', { detail: pending > 0 }))

// --------- REQUEST INTERCEPTOR -------------
api.interceptors.request.use(
  (config) => {
    pending++
    emitLoading()

    // Token
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    // Content-Type
    if (config.data instanceof FormData) {
      // để trình duyệt tự set boundary
      delete config.headers['Content-Type']
    } else {
      config.headers['Content-Type'] ||= 'application/json'
      config.headers['Accept'] ||= 'application/json'
    }

    // Tuỳ chọn: đánh dấu AJAX
    // config.headers['X-Requested-With'] = 'XMLHttpRequest'

    return config
  },
  (error) => {
    pending = Math.max(0, pending - 1)
    emitLoading()
    return Promise.reject(error)
  }
)

// --------- RESPONSE INTERCEPTOR ------------
api.interceptors.response.use(
  (res) => {
    pending = Math.max(0, pending - 1)
    emitLoading()
    return res
  },
  (error) => {
    pending = Math.max(0, pending - 1)
    emitLoading()

    const status = error?.response?.status

    // Chuẩn hoá message
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      'Request error'
    error.normalizedMessage = message

    // Hết hạn/không hợp lệ → phát sự kiện để app xử lý (chuyển login,…)
    if (status === 401) {
      localStorage.removeItem('token')
      document.dispatchEvent(new CustomEvent('app:auth-expired'))
    }

    return Promise.reject(error)
  }
)

export default api

// Helper upload ảnh
export const uploadImage = (file, onProgress) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post('/uploads', fd, {
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    },
  })
}
