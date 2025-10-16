// src/pages/LinkDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { getDomain } from "../utils/url";
// import { trackCtaClick, trackViewLinkDetail, trackLeadSubmit } from "../utils/analytics";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2.5 py-1 text-xs font-semibold">
      {children}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-72 rounded-2xl bg-slate-200" />
      <div className="h-6 w-1/2 rounded bg-slate-200" />
      <div className="h-4 w-1/3 rounded bg-slate-200" />
      <div className="h-24 rounded bg-slate-200" />
    </div>
  );
}

export default function LinkDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [link, setLink] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // tải chi tiết + vài link liên quan
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/links/${id}`);
        if (!mounted) return;

        // một số backend có thể trả object trực tiếp
        const obj = res?.data && !Array.isArray(res.data) ? res.data : null;
        setLink(obj);

        // track view chi tiết
        if (obj?.id) {
          trackViewLinkDetail({
            id: obj.id,
            platform: obj.platform,
            language: obj.language,
          });
        }

        // related theo language/category nếu có
        const params = {};
        if (obj?.language) params.language = obj.language;
        if (obj?.category) params.category = obj.category;
        params.page = 0; params.size = 12; params.sort = "publishedAt,desc";
        const r = await api.get("/links", { params });

        const list = Array.isArray(r.data?.content) ? r.data.content
          : Array.isArray(r.data) ? r.data
            : [];
        const filtered = list.filter((x) => x.id !== obj?.id).slice(0, 6);
        if (mounted) setRelated(filtered);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [id]);

  const domain = useMemo(() => getDomain(link?.url || ""), [link]);

  const ctaLabel =
    link?.platform === "FACEBOOK" ? "Đăng ký ngay (Facebook)"
      : link?.platform === "YOUTUBE" ? "Xem trên YouTube"
        : link?.platform === "TIKTOK" ? "Xem trên TikTok"
          : "Mở liên kết";

  const openExternal = () => {
    if (!link?.url) return;
    // track CTA
    trackCtaClick({
      id: link.id,
      text: ctaLabel,
      url: link.url,
      location: "link_detail_hero",
      platform: link.platform,
      language: link.language,
    });
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(link?.url || "");
      alert("Đã sao chép link!");
    } catch {
      alert("Không thể sao chép. Bạn hãy copy thủ công nhé.");
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: link?.title || "Link tuyển học viên",
          url: link?.url || window.location.href,
        });
      } else {
        await copyUrl();
      }
    } catch (_) { }
  };

  if (loading) return <Skeleton />;
  if (!link) {
    return (
      <div className="text-center py-24">
        <p className="text-lg text-slate-600">Không tìm thấy link.</p>
        <button className="btn btn-ghost mt-3" onClick={() => nav(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-20">
      {/* Hero */}
      <section className="rounded-2xl border shadow-sm overflow-hidden bg-white">
        <div className="grid md:grid-cols-2">
          <div className="relative">
            <img
              src={
                link.thumbnail ||
                link.imageUrl ||
                "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop"
              }
              alt={link.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-center gap-5">
            <div className="flex flex-wrap items-center gap-2">
              {link.language && <Badge>{link.language}</Badge>}
              {link.platform && <Badge>{link.platform}</Badge>}
              {domain && <Badge>{domain}</Badge>}
              <span className="text-xs text-slate-500">
                {new Date(link.publishedAt || link.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {link.title}
            </h1>

            {link.notes && (
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {link.notes}
              </p>
            )}

            <div className="flex items-center gap-2 flex-nowrap pt-1">
              <button
                className="btn btn-primary px-3 py-1.5 text-sm rounded-lg shrink-0"
                onClick={openExternal}
                disabled={!link.url}
              >
                {ctaLabel}
              </button>

              <button className="btn btn-ghost px-3 py-1.5 text-sm rounded-lg shrink-0" onClick={share}>
                Chia sẻ
              </button>

              <button className="btn btn-ghost px-3 py-1.5 text-sm rounded-lg shrink-0" onClick={copyUrl}>
                Sao chép link
              </button>

              <button className="btn btn-ghost px-3 py-1.5 text-sm rounded-lg shrink-0" onClick={() => nav(-1)}>
                Quay lại
              </button>
            </div>


          </div>
        </div>
      </section>

      {/* Thông tin nhanh */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-slate-500 text-sm">Nền tảng</div>
          <div className="font-semibold">{link.platform || "-"}</div>
        </div>
        <div className="card">
          <div className="text-slate-500 text-sm">Ngôn ngữ</div>
          <div className="font-semibold">{link.language || "-"}</div>
        </div>
        <div className="card">
          <div className="text-slate-500 text-sm">Ngày đăng</div>
          <div className="font-semibold">
            {new Date(link.publishedAt || link.createdAt).toLocaleDateString("vi-VN")}
          </div>
        </div>
      </section>

      {/* Nội dung chi tiết (tuỳ chọn) */}
      {link.longDescription && (
        <section className="card">
          <h3 className="text-lg font-semibold mb-2">Chi tiết khoá / mô tả</h3>
          <article className="prose max-w-none">
            <p className="whitespace-pre-wrap">{link.longDescription}</p>
          </article>
        </section>
      )}

      {/* Liên quan */}
      {related.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Link liên quan</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((r) => (
              <div key={r.id} className="rounded-2xl overflow-hidden border bg-white">
                <Link to={`/links/${r.id}`}>
                  <img
                    src={
                      r.thumbnail ||
                      r.imageUrl ||
                      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={r.title}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                </Link>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    {r.language && <Badge>{r.language}</Badge>}
                    {r.platform && <Badge>{r.platform}</Badge>}
                  </div>
                  <Link to={`/links/${r.id}`} className="font-semibold line-clamp-2 hover:underline">
                    {r.title}
                  </Link>
                  <div className="text-xs text-slate-500">{getDomain(r.url)}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(r.publishedAt || r.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="pt-1">
                    <a
                      className="btn btn-ghost"
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {r.platform === "FACEBOOK" ? "Mở Facebook"
                        : r.platform === "YOUTUBE" ? "Xem trên YouTube"
                          : r.platform === "TIKTOK" ? "Xem trên TikTok"
                            : "Mở liên kết"}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
