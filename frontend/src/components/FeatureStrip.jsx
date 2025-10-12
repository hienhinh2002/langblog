export default function FeatureStrip() {
  const feats = [
    { icon: '🎯', title: 'Tập trung thực dụng', desc: 'Ưu tiên ví dụ & hội thoại' },
    { icon: '🧠', title: 'Gợi nhớ thông minh', desc: 'Nhắc lại theo ngữ cảnh' },
    { icon: '📚', title: 'Chủ đề đa dạng', desc: 'Từ vựng, ngữ pháp, tips' },
    { icon: '🚀', title: 'Đọc nhanh', desc: 'Bố cục rõ ràng – dễ xem' },
  ]
  return (
    <div className="grid md:grid-cols-4 gap-3 md:gap-4 mb-6">
      {feats.map((f, idx) => (
        <div key={idx} className="card flex items-start gap-3">
          <div className="text-3xl">{f.icon}</div>
          <div>
            <div className="font-semibold">{f.title}</div>
            <div className="text-sm text-slate-600">{f.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
