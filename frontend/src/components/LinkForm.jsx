import { useEffect, useState } from "react";
import api, { uploadImage } from "../services/api";
import { useNavigate } from "react-router-dom";

const LANGS = ["ENGLISH", "CHINESE"];
const PLATFORMS = ["FACEBOOK", "YOUTUBE", "TIKTOK", "WEBSITE"];

export default function LinkForm({ initial, idForEdit }) {
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    url: "",
    platform: "FACEBOOK",
    language: "ENGLISH",
    category: "",
    thumbnail: "",
    notes: "",
    publishedAt: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        url: initial.url || "",
        platform: initial.platform || "FACEBOOK",
        language: initial.language || "ENGLISH",
        category: initial.category || "",
        thumbnail: initial.thumbnail || "",
        notes: initial.notes || "",
        publishedAt: toDateInput(initial.publishedAt || initial.createdAt),
      });
    }
  }, [initial]);

  const toISODate = (dateStr) =>
    dateStr ? new Date(dateStr + "T00:00:00Z").toISOString() : null;
  const toDateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const res = await uploadImage(f, setProgress);
      setForm((s) => ({ ...s, thumbnail: res.data.url }));
    } catch (err) {
      alert("Upload ảnh lỗi: " + (err?.response?.data?.message || err.message));
    } finally {
      setProgress(0);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      alert("Vui lòng nhập tiêu đề và URL.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        publishedAt: toISODate(form.publishedAt),
      };
      if (idForEdit) {
        await api.put(`/links/${idForEdit}`, payload);
      } else {
        await api.post("/links", payload);
      }
      nav("/manageLink");
    } catch (err) {
      alert("Lưu thất bại: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4">
      <h2 className="text-xl font-semibold">
        {idForEdit ? "Sửa link tuyển sinh" : "Đăng link tuyển sinh"}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Tiêu đề *</label>
          <input
            className="w-full border rounded-xl px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">URL (FB/Youtube/…)*</label>
          <input
            type="url"
            className="w-full border rounded-xl px-3 py-2"
            placeholder="https://facebook.com/…"
            value={form.url}
            onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Nền tảng</label>
          <select
            className="w-full border rounded-xl px-3 py-2"
            value={form.platform}
            onChange={(e) => setForm((s) => ({ ...s, platform: e.target.value }))}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Ngôn ngữ</label>
          <select
            className="w-full border rounded-xl px-3 py-2"
            value={form.language}
            onChange={(e) => setForm((s) => ({ ...s, language: e.target.value }))}
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {l === "ENGLISH" ? "Tiếng Anh" : "Tiếng Trung"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Ngày đăng</label>
          <input
            type="date"
            className="w-full border rounded-xl px-3 py-2"
            value={form.publishedAt}
            onChange={(e) => setForm((s) => ({ ...s, publishedAt: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Danh mục (tuỳ chọn)</label>
          <input
            className="w-full border rounded-xl px-3 py-2"
            placeholder="Tuyển học viên, Khoá A1…"
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Ảnh thumbnail (tuỳ chọn)</label>
          <div className="flex items-center gap-3">
            <input
              className="flex-1 border rounded-xl px-3 py-2"
              placeholder="https://…"
              value={form.thumbnail}
              onChange={(e) => setForm((s) => ({ ...s, thumbnail: e.target.value }))}
            />
            <label className="btn btn-ghost cursor-pointer">
              Chọn ảnh
              <input type="file" className="hidden" onChange={onFile} accept="image/*" />
            </label>
          </div>
          {progress > 0 && (
            <div className="h-2 rounded bg-slate-100 mt-2">
              <div className="h-2 rounded bg-blue-500" style={{ width: `${progress}%` }} />
            </div>
          )}
          {form.thumbnail && (
            <img
              src={form.thumbnail}
              alt="thumb"
              className="mt-2 h-28 rounded-lg border object-cover"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Ghi chú (tuỳ chọn)</label>
        <textarea
          className="w-full border rounded-xl px-3 py-2 h-28"
          placeholder="Điều kiện, học phí, thời gian, liên hệ…"
          value={form.notes}
          onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
        />
      </div>

      <div className="flex gap-2">
        <button disabled={saving} className="btn btn-primary">
          {saving ? "Đang lưu…" : "Lưu"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => nav(-1)}>
          Huỷ
        </button>
      </div>
    </form>
  );
}
