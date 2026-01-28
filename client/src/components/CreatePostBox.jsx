import { useEffect, useMemo, useState } from "react";
import { Star, FileText, Image } from "lucide-react";

function StarPicker({ value, onChange }) {
  const v = Number(value || 0);
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[1,2,3,4,5].map((s) => (
        <button
          key={s}
          type="button"
          className="btn"
          onClick={() => onChange?.(s)}
          style={{
            padding: "6px",
            background: s <= v ? "#ffd700" : undefined,
            borderColor: s <= v ? "#ffd700" : undefined,
            color: s <= v ? "#000" : undefined,
          }}
        >
          <Star size={16} fill={s <= v ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

export default function CreatePostBox({ restaurants = [], onCreated }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("status");
  const [restaurantId, setRestaurantId] = useState("");
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (type !== "review") {
      setRestaurantId("");
      setRating(5);
    }
  }, [type]);

  const headerPill = useMemo(() => {
    return type === "review" ? "Review" : "Status";
  }, [type]);

  async function submit(e) {
    e?.preventDefault?.();
    setErr("");
    if (!content.trim()) return setErr("Bạn chưa nhập nội dung.");

    const payload = {
      content: content.trim(),
      type,
      image_url: imageUrl.trim() || undefined,
    };

    if (type === "review") {
      if (!restaurantId) return setErr("Vui lòng chọn quán để review.");
      payload.restaurant_id = Number(restaurantId);
      payload.rating = Number(rating);
    }

    try {
      setBusy(true);
      await onCreated?.(payload);
      setContent("");
      setImageUrl("");
      setType("status");
    } catch {
      // parent handles
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card composer-card">
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>Tạo bài viết</h3>
      </div>

      <form onSubmit={submit} className="composer-form">
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <button
            type="button"
            className={`tab ${type === "status" ? "active" : ""}`}
            onClick={() => setType("status")}
          >
            <FileText size={16} style={{ marginRight: 6 }} />
            Status
          </button>
          <button
            type="button"
            className={`tab ${type === "review" ? "active" : ""}`}
            onClick={() => setType("review")}
          >
            <Star size={16} style={{ marginRight: 6 }} />
            Review
          </button>
        </div>

        {type === "review" && (
          <div style={{ marginBottom: 12 }}>
            <select
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              style={{ width: "100%", marginBottom: 8 }}
            >
              <option value="">Chọn quán...</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <StarPicker value={rating} onChange={setRating} />
          </div>
        )}

        <div className="composer-row">
          <div className="avatar">U</div>
          <div className="composer-input">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết gì đó..."
            />
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="URL ảnh..."
            style={{ marginBottom: 10 }}
          />
        </div>

        <div className="composer-actions">
          <button className="btn-primary" disabled={busy}>
            {busy ? "Đang đăng..." : "Đăng"}
          </button>
        </div>

        {err && <div className="err" style={{ marginTop: 10 }}>{err}</div>}
      </form>
    </div>
  );
}
