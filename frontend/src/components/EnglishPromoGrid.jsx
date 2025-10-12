export default function EnglishPromoGrid() {
  const items = [
    {
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
      tag: 'HỌC TIẾNG ANH ONLINE',
      title: 'Dạy ngữ pháp tiếng Anh cho trẻ em thế nào? (Bí quyết đơn giản dễ áp dụng)',
      date: '12 THÁNG 9 2025'
    },
    {
      img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
      tag: 'HỌC TIẾNG ANH ONLINE',
      title: 'Phần mềm dịch tiếng Anh sang tiếng Việt miễn phí nào tốt nhất hiện nay cho bạn?',
      date: '12 THÁNG 9 2025'
    },
    {
      img: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop',
      tag: 'HỌC TIẾNG ANH ONLINE',
      title: 'Lớn tuổi học tiếng Anh có khó không? Trung tâm dạy tiếng Anh cho người lớn hiệu quả!',
      date: '12 THÁNG 9 2025'
    },
    {
      img: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop',
      tag: 'HỌC TIẾNG ANH ONLINE',
      title: 'Bố mẹ cần biết: Kinh nghiệm chọn sách luyện viết tiếng Anh cho trẻ em từ chuyên gia',
      date: '12 THÁNG 9 2025'
    }
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Chủ đề tiếng Anh tiêu biểu</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((it, idx) => (
          <article key={idx} className="">
            <div className="rounded-xl overflow-hidden border">
              <img src={it.img} alt={it.title} className="w-full h-48 md:h-56 object-cover" />
            </div>
            <div className="mt-3">
              <span className="badge badge-orange">{it.tag}</span>
              <h3 className="mt-2 text-xl font-extrabold leading-snug">{it.title}</h3>
              <div className="meta mt-1">{'\\u23F0'} {it.date}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
