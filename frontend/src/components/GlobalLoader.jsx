import { useEffect, useRef, useState } from 'react';

export default function GlobalLoader() {
  const [active, setActive] = useState(false);     // có request đang chạy
  const [visible, setVisible] = useState(false);   // mount/unmount mượt
  const showT = useRef(null), hideT = useRef(null);

  useEffect(() => {
    const onLoading = (e) => {
      const isActive = !!e.detail;
      setActive(isActive);

      // Chống nhấp nháy: chờ 120ms mới hiện
      if (isActive) {
        clearTimeout(hideT.current);
        showT.current = setTimeout(() => setVisible(true), 120);
      } else {
        clearTimeout(showT.current);
        // Giữ tối thiểu 250ms để cảm giác mượt
        hideT.current = setTimeout(() => setVisible(false), 250);
      }
    };
    document.addEventListener('app:loading', onLoading);
    return () => document.removeEventListener('app:loading', onLoading);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] pointer-events-none transition-opacity duration-300
        ${visible ? 'opacity-100' : 'opacity-0'} ${visible ? '' : 'invisible'}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                      flex flex-col items-center">
        {/* Spinner */}
        <div className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="mt-3 text-sm text-slate-600">Đang tải…</p>
      </div>
    </div>
  );
}
