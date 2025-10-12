import { Link, useNavigate } from "react-router-dom";

// Icon mũi tên trái
const ArrowLeft = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      d="M15 19l-7-7 7-7" />
  </svg>
);

/** Nút dạng pill (đặt trên đầu trang chi tiết) */
export function BackHome({ to = "/", label = "Về Trang chủ", className = "" }) {
  const nav = useNavigate();
  return (
    <button
      onClick={() => nav(-1)} // quay lại trang trước; nếu muốn về hẳn home: dùng <Link to={to}> ... </Link>
      className={
        "inline-flex items-center gap-2 rounded-2xl border px-3 py-2 " +
        "bg-white/80 text-blue-700 border-blue-200 shadow-sm " +
        "hover:bg-blue-50 hover:border-blue-300 " +
        "transition group " + className
      }
      aria-label={label}
    >
      <span className="grid place-items-center w-7 h-7 rounded-full bg-blue-600 text-white
                       group-hover:-translate-x-0.5 transition">
        <ArrowLeft className="w-4 h-4" />
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

/** Nút tròn nổi (tuỳ chọn) đặt góc phải dưới màn hình */
export function BackHomeFloating({ to = "/", className = "" }) {
  return (
    <Link
      to={to}
      className={
        "fixed bottom-6 right-6 z-50 grid place-items-center w-12 h-12 rounded-full " +
        "bg-blue-600 text-white shadow-lg hover:bg-blue-700 " +
        "transition focus:outline-none focus:ring-2 focus:ring-blue-400 " + className
      }
      aria-label="Về Trang chủ"
    >
      <ArrowLeft className="w-6 h-6" />
    </Link>
  );
}
