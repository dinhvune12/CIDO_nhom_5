import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import http from "../api/http";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr("");
    try {
      setLoading(true);
      const res = await http.get(`/api/restaurants/${id}`);
      setRestaurant(res.data.restaurant);
    } catch (e) {
      setErr(e.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  return (
    <div className="feed-wrap col">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Link className="pill" to="/restaurants">← Back</Link>
        <Link className="pill" to="/appointments">Tạo cuộc hẹn →</Link>
      </div>

      {loading && <div className="pill">Đang tải...</div>}
      {err && <div className="err">{err}</div>}

      {restaurant && (
        <div className="card" style={{ padding: 16 }}>
          {restaurant.image_url && (
            <div style={{ marginBottom: 12 }}>
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 8, cursor: "pointer" }}
                onClick={() => window.open(restaurant.image_url, "_blank")}
              />
            </div>
          )}

          <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{restaurant.name}</div>

          {restaurant.address && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <MapPin size={16} />
              <span>{restaurant.address}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {restaurant.area && <span className="pill">{restaurant.area}</span>}
            {restaurant.type && <span className="pill">{restaurant.type}</span>}
            {restaurant.price_range && <span className="pill">{restaurant.price_range}</span>}
            {typeof restaurant.rating_avg !== "undefined" && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, backgroundColor: "#ffd700", color: "#333", padding: "6px 10px", borderRadius: "999px", fontWeight: "bold" }}>
                <Star size={14} fill="currentColor" />
                <span>{Number(restaurant.rating_avg).toFixed(1)}</span>
              </div>
            )}
          </div>

          {restaurant.description && (
            <div style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{restaurant.description}</div>
          )}
        </div>
      )}
    </div>
  );
}
