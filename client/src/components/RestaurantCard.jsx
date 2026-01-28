import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Eye } from "lucide-react";

export default function RestaurantCard({ r }) {
  return (
    <Link to={`/restaurants/${r.id}`} className="card" style={{ display: "block", textDecoration: "none" }}>
      {r.image_url ? (
        <div className="restaurant-card-image">
          <img src={r.image_url} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "pointer" }} />
        </div>
      ) : null}

      <div style={{ padding: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{r.name}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          {r.area && <span className="pill">{r.area}</span>}
          {r.type && <span className="pill">{r.type}</span>}
          {r.price_range && <span className="pill">{r.price_range}</span>}
        </div>

        {r.address && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <MapPin size={14} />
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{r.address}</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {r.rating_avg != null && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Star size={16} fill="#ffd700" color="#ffd700" />
              <span style={{ fontWeight: 700 }}>{Number(r.rating_avg).toFixed(1)}</span>
            </div>
          )}
          <Eye size={16} />
        </div>
      </div>
    </Link>
  );
}
