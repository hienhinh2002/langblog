export default function StatsBar({ counts }) {
  const items = [
    { label: 'Bài viết', value: counts.total || 0, sub: 'Tổng số' },
    { label: 'Tiếng Anh', value: counts.en || 0, sub: 'Bài ENGLISH' },
    { label: 'Tiếng Trung', value: counts.zh || 0, sub: 'Bài CHINESE' },
  ]
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6">
      {items.map((it, i) => (
        <div key={i} className="card glass text-center">
          <div className="text-2xl font-bold">{it.value}</div>
          <div className="text-slate-700">{it.label}</div>
          <div className="text-xs text-slate-500">{it.sub}</div>
        </div>
      ))}
    </div>
  )
}
