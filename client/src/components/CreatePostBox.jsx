import React, { useEffect, useMemo, useState } from "react";
import http from "../api/http.js";

export default function CreatePostBox({ onCreated }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("status");
  const [restaurantId, setRestaurantId] = useState("");
  const [rating, setRating] = useState("5");
  const [imageUrl, setImageUrl] = useState("");

  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const isReview = type === "review";

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingRestaurants(true);
      try {
        const res = await http.get("/api/restaurants");
        if (!mounted) return;
        setRestaurants(res.data?.restaurants || []);
      } catch {
        // ignore
      } finally {
        if (mounted) setLoadingRestaurants(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const canSubmit = useMemo(() => {
    if (!content.trim()) return false;
    if (!isReview) return true;
    if (!restaurantId) return false;
    const r = Number(rating);
    return Number.isFinite(r) && r >= 0 && r <= 5;
  }, [content, isReview, restaurantId, rating]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const payload = {
        content: content.trim(),
        type,
        image_url: imageUrl.trim() || null,
      };
      if (isReview) {
        payload.restaurant_id = Number(restaurantId);
        payload.rating = Number(rating);
      }

      await http.post("/api/posts", payload);
      setOk("Đăng bài thành công!");
      setContent("");
      setImageUrl("");
      setType("status");
      setRestaurantId("");
      setRating("5");
      onCreated?.();
    } catch (e2) {
      const msg = e2?.response?.data?.message || e2?.response?.data?.msg || "Tạo bài thất bại";
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        background: "white",
      }}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#374151" }}>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="status">status</option>
            <option value="review">review</option>
          </select>
        </label>

        {isReview && (
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#374151" }}>Restaurant</span>
            <select
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              disabled={loadingRestaurants}
            >
              <option value="">-- chọn quán --</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {isReview && (
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#374151" }}>Rating</span>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Bạn đang nghĩ gì?"
        style={{ width: "100%", marginTop: 10, padding: 10, borderRadius: 10 }}
      />

      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="(tuỳ chọn) Image URL"
        style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 10 }}
      />

      {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}
      {ok && <div style={{ color: "green", marginTop: 8 }}>{ok}</div>}

      <button
        type="submit"
        disabled={!canSubmit || submitting}
        style={{ marginTop: 10 }}
      >
        {submitting ? "Đang đăng..." : "Đăng bài"}
      </button>
    </form>
  );
}
