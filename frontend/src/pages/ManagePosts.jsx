// src/pages/ManagePosts.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const TABS = ['ENGLISH', 'CHINESE']
const PAGE_SIZE = 10
const DEBOUNCE = 300

export default function ManagePosts() {
  const [active, setActive] = useState('ENGLISH')
  const [loading, setLoading] = useState(false)

  // dữ liệu & selection theo từng tab
  const [data, setData] = useState({ ENGLISH: [], CHINESE: [] })
  const [selected, setSelected] = useState({ ENGLISH: new Set(), CHINESE: new Set() })

  // tìm kiếm theo tab (debounce)
  const [qInput, setQInput] = useState({ ENGLISH: '', CHINESE: '' }) // text người dùng gõ
  const [kw, setKw]         = useState({ ENGLISH: '', CHINESE: '' }) // keyword đã debounce
  const typingRef = useRef()

  // phân trang theo tab
  const [pageByTab, setPageByTab] = useState({ ENGLISH: 1, CHINESE: 1 })

  // tải bài theo tab
  useEffect(() => { loadTab(active) }, [active])

  async function loadTab(lang) {
    setLoading(true)
    try {
      const res = await api.get(`/posts?language=${lang}`)
      setData(d => ({ ...d, [lang]: res.data }))
    } finally {
      setLoading(false)
    }
  }

  // debounce cho search theo tab
  const onChangeSearch = (lang, value) => {
    setQInput(s => ({ ...s, [lang]: value }))
    clearTimeout(typingRef.current)
    typingRef.current = setTimeout(() => {
      setKw(k => ({ ...k, [lang]: value.trim() }))
      setPageByTab(p => ({ ...p, [lang]: 1 })) // về trang 1 khi đổi keyword
    }, DEBOUNCE)
  }

  // data, selection, keyword, page hiện tại của tab
  const items  = data[active] ?? []
  const selSet = selected[active]
  const keyword = kw[active]
  const page    = pageByTab[active]

  // lọc theo tiêu đề (client-side)
  const filtered = useMemo(() => {
    if (!keyword) return items
    const k = keyword.toLowerCase()
    return items.filter(p => (p.title || '').toLowerCase().includes(k))
  }, [items, keyword])

  // phân trang
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const end   = start + PAGE_SIZE
  const pageItems = filtered.slice(start, end)

  const goPage = (n) => {
    if (n < 1 || n > totalPages) return
    setPageByTab(p => ({ ...p, [active]: n }))
  }

  // chọn tất cả trong TRANG
  const allChecked = useMemo(
    () => pageItems.length > 0 && pageItems.every(p => selSet.has(p.id)),
    [pageItems, selSet]
  )

  const toggleAll = () => {
    setSelected(prev => {
      const copy = { ...prev }
      const set = new Set(copy[active])
      if (allChecked) {
        // bỏ chọn các id trong trang
        pageItems.forEach(p => set.delete(p.id))
      } else {
        // chọn tất cả id trong trang
        pageItems.forEach(p => set.add(p.id))
      }
      copy[active] = set
      return copy
    })
  }

  const toggleOne = (id) => {
    setSelected(prev => {
      const copy = { ...prev }
      const set = new Set(copy[active])
      set.has(id) ? set.delete(id) : set.add(id)
      copy[active] = set
      return copy
    })
  }

  const selectedCount = selSet.size

  // bulk delete
  const bulkDelete = async () => {
    if (!selectedCount) return
    if (!window.confirm(`Xóa ${selectedCount} bài viết ở tab hiện tại?`)) return
    try {
      const ids = Array.from(selSet)
      await api.post('/posts/bulk-delete', ids)
      await loadTab(active)
      // giữ các tab khác, reset tab hiện tại
      setSelected(prev => ({ ...prev, [active]: new Set() }))
    } catch (e) {
      alert('Xóa thất bại: ' + (e?.response?.data?.message || e.message))
    }
  }

  // xóa 1 bài
  const deleteOne = async (id) => {
    if (!window.confirm('Xóa bài này?')) return
    await api.delete(`/posts/${id}`)
    await loadTab(active)
    setSelected(prev => {
      const copy = { ...prev }
      const set = new Set(copy[active])
      set.delete(id)
      copy[active] = set
      return copy
    })
  }

  return (
    <div className="space-y-4">
      {/* Thanh công cụ (sticky) */}
      <div className="sticky top-16 z-10 bg-white/80 backdrop-blur border-b">
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-2">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`btn ${active === t ? 'btn-primary' : 'btn-ghost'}`}
              >
                {t === 'ENGLISH' ? 'Bài viết Tiếng Anh' : 'Bài viết Tiếng Trung'}{' '}
                <span className="ml-1 text-xs text-slate-500">
                  ({data[t]?.length || 0})
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              className="border rounded-xl px-3 py-2 w-64"
              placeholder="Tìm theo tiêu đề…"
              value={qInput[active]}
              onChange={e => onChangeSearch(active, e.target.value)}
            />
            <button
              onClick={bulkDelete}
              disabled={!selectedCount}
              className={`btn ${selectedCount ? 'btn-danger' : 'btn-ghost'}`}
              title="Xóa những bài đã chọn trong tab hiện tại"
            >
              Xóa đã chọn ({selectedCount})
            </button>
            <Link to="/create" className="btn btn-primary">Tạo bài</Link>
          </div>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-auto rounded-xl border">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="p-3 w-10">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} />
              </th>
              <th className="p-3">Tiêu đề</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Ngày</th>
              <th className="p-3 w-40">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse border-t">
                  <td className="p-3"><div className="h-4 w-4 bg-slate-200 rounded" /></td>
                  <td className="p-3"><div className="h-4 w-64 bg-slate-200 rounded" /></td>
                  <td className="p-3"><div className="h-4 w-36 bg-slate-200 rounded" /></td>
                  <td className="p-3"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                  <td className="p-3"><div className="h-8 w-24 bg-slate-200 rounded" /></td>
                </tr>
              ))
            ) : pageItems.length === 0 ? (
              <tr><td className="p-6 text-center text-slate-500" colSpan={5}>Không có bài viết phù hợp.</td></tr>
            ) : (
              pageItems.map(p => (
                <tr key={p.id} className="border-t hover:bg-slate-50/60">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selSet.has(p.id)}
                      onChange={() => toggleOne(p.id)}
                      aria-label={`Chọn: ${p.title}`}
                    />
                  </td>
                  <td className="p-3 max-w-[560px]">
                    <div className="truncate" title={p.title}>{p.title}</div>
                  </td>
                  <td className="p-3 text-xs">{p.category || '-'}</td>
                  <td className="p-3 text-xs">
                    {new Date(p.publishedAt || p.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link to={`/edit/${p.id}`} className="btn btn-ghost">Sửa</Link>
                      <button className="btn btn-ghost text-rose-600 hover:bg-rose-50"
                              onClick={() => deleteOne(p.id)}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button className="btn btn-ghost" disabled={page === 1} onClick={() => goPage(page - 1)}>‹ Trước</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`btn ${n === page ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => goPage(n)}
            >{n}</button>
          ))}
          <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => goPage(page + 1)}>Sau ›</button>
        </div>
      )}
    </div>
  )
}
