import { useEffect, useMemo, useState } from "react";
import http from "../api/http";
import RestaurantCard from "../components/RestaurantCard.jsx";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr("");
    try {
      setLoading(true);
      const res = await http.get("/api/restaurants");
      setRestaurants(res.data.restaurants || []);
    } catch (e) {
      setErr(e.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return restaurants;
    return restaurants.filter((r) => (r.name || "").toLowerCase().includes(s));
  }, [restaurants, q]);

  return (
    <div className="col">
      <div className="card" style={{ padding: 14 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>Quán ăn</h2>
          </div>
          <div style={{ minWidth: 260 }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search theo tên..." />
          </div>
        </div>
        {err && <div className="err" style={{ marginTop: 10 }}>{err}</div>}
      </div>

      {loading && <div className="pill">Đang tải...</div>}

      <div className="grid3">
        {filtered.map((r) => (
          <RestaurantCard key={r.id} r={r} />
        ))}
      </div>

      {!loading && !filtered.length && <div className="pill">Không có quán phù hợp</div>}
    </div>
  );
}
