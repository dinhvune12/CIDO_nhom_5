import React, { useEffect, useMemo, useState } from "react";
import http from "../api/http.js";
import { Link } from "react-router-dom";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await http.get("/api/restaurants");
        if (!mounted) return;
        setRestaurants(res.data?.restaurants || []);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || "Load failed");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return restaurants;
    return restaurants.filter((r) => (r.name || "").toLowerCase().includes(keyword));
  }, [q, restaurants]);

  return (
    <div style={{ padding: 16, maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Restaurants</h2>
        <Link to="/feed">← Back to Feed</Link>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name..."
        style={{ width: "100%", marginTop: 12, padding: 10, borderRadius: 10 }}
      />

      {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>Không tìm thấy quán.</p>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {filtered.map((r) => (
            <Link
              key={r.id}
              to={`/restaurants/${r.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                background: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <b>{r.name}</b>
                <span style={{ color: "#6b7280", fontSize: 12 }}>
                  ⭐ {r.rating_avg ?? "-"}
                </span>
              </div>
              <div style={{ marginTop: 6, color: "#374151", fontSize: 13 }}>
                {r.address || ""}
              </div>
              <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>
                {r.area || ""} {r.type ? `· ${r.type}` : ""} {r.price_range ? `· ${r.price_range}` : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
