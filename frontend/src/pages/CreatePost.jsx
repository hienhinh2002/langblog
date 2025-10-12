import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import RichEditor from '../components/RichEditor';
const toISODate = (d) => d ? new Date(d + 'T00:00:00Z').toISOString() : null

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('ENGLISH')
  const [category, setCategory] = useState('HỌC TIẾNG ANH ONLINE')
  const [publishedAt, setPublishedAt] = useState(() => new Date().toISOString().slice(0, 10))
  // file ảnh & preview
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')

  const [error, setError] = useState('')
  const nav = useNavigate()

  const onPickFile = (e) => {
    const f = e.target.files?.[0]
    setImageFile(f || null)
    setPreview(f ? URL.createObjectURL(f) : '')
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      let imageUrl = ''
      // 1) upload ảnh nếu người dùng chọn
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const r = await api.post('/uploads', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        imageUrl = r.data.url
      }

      // 2) tạo bài viết
      await api.post('/posts', { title, content, language, category, imageUrl, publishedAt: toISODate(publishedAt) });
      nav('/')
    } catch (err) {
      const msg = err?.response?.data?.message || err.message
      setError('Không thể tạo bài viết: ' + msg)
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h2 className="text-xl font-semibold">Tạo mới bài post</h2>
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Tiêu đề</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Danh mục</label>
          <input value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-lg p-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Nội dung</label>
        <RichEditor value={content} onChange={setContent} />
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm mb-1">Chủ đề ngôn ngữ</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} className="border rounded-lg p-2">
            <option value="ENGLISH">Tiếng Anh</option>
            <option value="CHINESE">Tiếng Trung</option>
          </select>
        </div>

        {/* File upload */}
        <div>
          <label className="block text-sm mb-1">Ảnh đại diện (chọn từ máy)</label>
          <input type="file" accept="image/*"
            onChange={onPickFile}
            className="w-full border rounded-lg p-2 bg-white" />
          {preview && (
            <img src={preview} alt="preview"
              className="mt-2 h-28 w-full object-cover rounded-lg border" />
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Ngày đăng</label>
          <input type="date" value={publishedAt}
            onChange={e => setPublishedAt(e.target.value)}
            className="w-full border rounded-lg p-2" />
        </div>
      </div>

      <button className="btn btn-primary">Đăng bài</button>
    </form>
  )
}
