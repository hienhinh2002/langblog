import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import RichEditor from '../components/RichEditor';
const toISODate = (d) => (d ? new Date(d + 'T00:00:00Z').toISOString() : null)
const toDateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10))

export default function EditPost() {
  const { id } = useParams()
  const nav = useNavigate()

  const [form, setForm] = useState({
    title: '', content: '', language: 'ENGLISH', category: '',
    imageUrl: '', publishedAt: new Date().toISOString().slice(0, 10)
  })

  const [imageFile, setImageFile] = useState(null) // file mới (nếu có)
  const [preview, setPreview] = useState('')     // ảnh preview
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) { nav('/login'); return }

    setLoading(true)
    api.get(`/posts/${id}`).then(res => {
      const p = res.data
      setForm({
        title: p.title || '',
        content: p.content || '',
        language: p.language || 'ENGLISH',
        category: p.category || '',
        imageUrl: p.imageUrl || '',
        publishedAt: toDateInput(p.publishedAt || p.createdAt)
      })
      setPreview(p.imageUrl || '')
    }).catch(() => setError('Không tải được bài viết'))
      .finally(() => setLoading(false))
  }, [id, nav])

  const onPickFile = (e) => {
    const f = e.target.files?.[0]
    setImageFile(f || null)
    setPreview(f ? URL.createObjectURL(f) : form.imageUrl || '')
  }

  const removeImage = () => {
    setImageFile(null)
    setForm(s => ({ ...s, imageUrl: '' }))
    setPreview('')
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      let imageUrl = form.imageUrl || ''
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const r = await api.post('/uploads', fd) // interceptor tự set multipart
        imageUrl = r.data.url
      }

      await api.put(`/posts/${id}`, {
        title: form.title,
        content: form.content,
        language: form.language,
        category: form.category,
        imageUrl,
        publishedAt: toISODate(form.publishedAt)
      })

      nav('/manage')
    } catch (err) {
      const msg = err?.response?.data?.message || err.message
      setError('Cập nhật thất bại: ' + msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="card">Đang tải…</div>

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h2 className="text-xl font-semibold">Chỉnh sửa bài viết #{id}</h2>
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Tiêu đề</label>
          <input
            value={form.title}
            onChange={e => setForm(s => ({ ...s, title: e.target.value }))}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Danh mục</label>
          <input
            value={form.category}
            onChange={e => setForm(s => ({ ...s, category: e.target.value }))}
            className="w-full border rounded-lg p-2"
            placeholder="Ví dụ: HỌC TIẾNG ANH ONLINE"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Nội dung</label>
        <RichEditor
          value={form.content}
          onChange={(v) => setForm(s => ({ ...s, content: v }))}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm mb-1">Chủ đề ngôn ngữ</label>
          <select
            value={form.language}
            onChange={e => setForm(s => ({ ...s, language: e.target.value }))}
            className="border rounded-lg p-2"
          >
            <option value="ENGLISH">Tiếng Anh</option>
            <option value="CHINESE">Tiếng Trung</option>
          </select>
        </div>

        {/* chọn ảnh từ máy */}
        <div>
          <label className="block text-sm mb-1">Ảnh đại diện</label>
          <input
            type="file"
            accept="image/*"
            onChange={onPickFile}
            className="w-full border rounded-lg p-2 bg-white"
          />
          {preview && (
            <div className="mt-2 space-y-2">
              <img src={preview} alt="preview"
                className="h-28 w-full object-cover rounded-lg border" />
              <button type="button" className="btn btn-ghost" onClick={removeImage}>
                Xóa ảnh
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Ngày đăng</label>
          <input
            type="date"
            value={form.publishedAt}
            onChange={e => setForm(s => ({ ...s, publishedAt: e.target.value }))}
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn btn-primary" disabled={saving}>
          {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
        <button type="button" onClick={() => nav(-1)} className="btn btn-ghost">
          Huỷ
        </button>
      </div>
    </form>
  )
}
