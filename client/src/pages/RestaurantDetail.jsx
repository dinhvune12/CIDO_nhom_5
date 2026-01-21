import React, { useEffect, useState } from "react";
import http from "../api/http.js";
import { Link, useParams } from "react-router-dom";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await http.get(`/api/restaurants/${id}`);
        if (!mounted) return;
        setRestaurant(res.data?.restaurant || null);
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
  }, [id]);

  return (
    <div style={{ padding: 16, maxWidth: 860, margin: "0 auto" }}>
      <Link to="/restaurants">← Back</Link>

      {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : !restaurant ? (
        <p>Không có dữ liệu.</p>
      ) : (
        <div
          style={{
            marginTop: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
            background: "white",
          }}
        >
          <h2 style={{ marginTop: 0 }}>{restaurant.name}</h2>
          <p style={{ margin: 0, color: "#374151" }}>{restaurant.address}</p>
          <p style={{ color: "#6b7280" }}>
            {restaurant.area || ""} {restaurant.type ? `· ${restaurant.type}` : ""} {restaurant.price_range ? `· ${restaurant.price_range}` : ""}
          </p>
          <p>
            ⭐ <b>{restaurant.rating_avg ?? "-"}</b>
          </p>
        </div>
      )}
    </div>
  );
}
