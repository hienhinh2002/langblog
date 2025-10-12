// src/pages/ManageLinks.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const LANGS = ["ALL", "ENGLISH", "CHINESE"];
const PLATFORMS = ["ALL", "FACEBOOK", "YOUTUBE", "TIKTOK", "WEBSITE"];
const PAGE_SIZE = 10;

export default function ManageLinks() {
  const [lang, setLang] = useState("ALL");
  const [platform, setPlatform] = useState("ALL");
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]); // luôn là mảng
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(new Set()); // id đã chọn (theo trang)
  const [page, setPage] = useState(1);

  // debounce search
  const qRef = useRef(q);

  useEffect(() => {
    qRef.current = q;
    const t = setTimeout(() => {
      load();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, platform, q]);

  async function load() {
    setLoading(true);
    try {
      const params = {};
      if (lang !== "ALL") params.language = lang;
      if (platform !== "ALL") params.platform = platform;
      if (qRef.current.trim()) params.q = qRef.current.trim();

      const res = await api.get("/links", { params });

      // Chuẩn hoá về mảng để luôn có thể .slice()
      const list =
        Array.isArray(res.data) ? res.data :
        Array.isArray(res.data?.content) ? res.data.content :
        Array.isArray(res.data?.items) ? res.data.items :
        [];

      setItems(list);
      setPage(1);
      setSelected(new Set());
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Phân trang client
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return Array.isArray(items) ? items.slice(start, start + PAGE_SIZE) : [];
  }, [items, page]);

  // Checkbox "chọn tất cả" (trang hiện tại)
  const allChecked = paged.length > 0 && paged.every((x) => selected.has(x.id));

  const toggleAll = (checked) => {
    setSelected(() => {
      if (!checked) return new Set();
      return new Set(paged.map((x) => x.id));
    });
  };

  const toggleOne = (id) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  // Xoá 1
  const delOne = async (id) => {
    if (!confirm("Xoá link này?")) return;
    await api.delete(`/links/${id}`);
    setItems((arr) => arr.filter((x) => x.id !== id));
    setSelected((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  };

  // Xoá hàng loạt (theo id đã chọn)
  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Xoá ${selected.size} link đã chọn?`)) return;
    await api.post("/links/bulk-delete", Array.from(selected));
    setItems((arr) => arr.filter((x) => !selected.has(x.id)));
    setSelected(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {LANGS.map((t) => (
            <button
              key={t}
              onClick={() => setLang(t)}
              className={`btn ${lang === t ? "btn-primary" : "btn-ghost"}`}
            >
              {t === "ALL" ? "Tất cả" : t === "ENGLISH" ? "Tiếng Anh" : "Tiếng Trung"}
            </button>
          ))}

          <select
            className="border rounded-xl px-3 py-2"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p === "ALL" ? "Mọi nền tảng" : p}
              </option>
            ))}
          </select>

          <input
            className="border rounded-xl px-3 py-2 w-56"
            placeholder="Tìm theo tiêu đề / url"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`btn ${selected.size ? "btn-danger" : "btn-ghost"}`}
            disabled={!selected.size}
            onClick={bulkDelete}
          >
            Xoá đã chọn ({selected.size})
          </button>
          {/* <Link to="/create" className="btn btn-primary">
            Đăng link
          </Link> */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  onChange={(e) => toggleAll(e.target.checked)}
                  checked={allChecked}
                />
              </th>
              <th className="p-3">Tiêu đề</th>
              <th className="p-3">Nền tảng</th>
              <th className="p-3">Ngôn ngữ</th>
              <th className="p-3">Ngày đăng</th>
              <th className="p-3 w-44">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4" colSpan={6}>Đang tải…</td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td className="p-6 text-center text-slate-500" colSpan={6}>
                  Không có link nào. <Link className="text-blue-600 underline" to="/create">Đăng link</Link>
                </td>
              </tr>
            ) : (
              paged.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(l.id)}
                      onChange={() => toggleOne(l.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-semibold">{l.title}</div>
                    <a
                      className="text-xs text-blue-600 hover:underline break-all"
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      title={l.url}
                    >
                      {l.url}
                    </a>
                  </td>
                  <td className="p-3 text-xs">{l.platform}</td>
                  <td className="p-3 text-xs">{l.language}</td>
                  <td className="p-3 text-xs">
                    {new Date(l.publishedAt || l.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link to={`/editLink/${l.id}`} className="btn btn-ghost">Sửa</Link>
                      <button className="btn btn-ghost" onClick={() => delOne(l.id)}>Xoá</button>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost"
                        title="Mở link"
                      >
                        Xem
                      </a>
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
        <div className="flex items-center justify-center gap-2">
          <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage(1)}>
            «
          </button>
          <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ‹ Trước
          </button>
          <span className="px-3 text-sm text-slate-600">
            Trang {page}/{totalPages}
          </span>
          <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Sau ›
          </button>
          <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
            »
          </button>
        </div>
      )}
    </div>
  );
}
