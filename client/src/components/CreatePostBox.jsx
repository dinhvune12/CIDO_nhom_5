import { useEffect, useMemo, useRef, useState } from "react";
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
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
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
      image_url: undefined,
    };

    // if a file was selected, convert to data URL
    if (imageFile) {
      const fileToDataUrl = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      try {
        payload.image_url = await fileToDataUrl(imageFile);
      } catch {
        // ignore conversion error
      }
    }

    if (type === "review") {
      if (!restaurantId) return setErr("Vui lòng chọn quán để review.");
      payload.restaurant_id = Number(restaurantId);
      payload.rating = Number(rating);
    }

    try {
      setBusy(true);
      await onCreated?.(payload);
      setContent("");
      setImageFile(null);
      setPreviewUrl("");
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
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setImageFile(f);
              try { setPreviewUrl(URL.createObjectURL(f)); } catch {}
            }}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button type="button" className="btn" onClick={() => fileInputRef.current?.click()}>
              <Image size={16} style={{ marginRight: 8 }} /> Chọn ảnh
            </button>
            {previewUrl ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <img src={previewUrl} alt="preview" style={{ width: 72, height: 52, objectFit: "cover", borderRadius: 6 }} />
                <button type="button" className="btn" onClick={() => { setImageFile(null); setPreviewUrl(""); fileInputRef.current.value = null; }}>
                  Xoá
                </button>
              </div>
            ) : (
              <div className="muted">Không có ảnh</div>
            )}
          </div>
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
