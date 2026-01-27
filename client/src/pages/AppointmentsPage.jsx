import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";

function toMysqlDatetime(localValue) {
  // localValue: YYYY-MM-DDTHH:mm
  if (!localValue) return "";
  const [datePart, timePart] = localValue.split("T");
  if (!datePart || !timePart) return "";
  return `${datePart} ${timePart}:00`;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [title, setTitle] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [meetingTime, setMeetingTime] = useState(""); // datetime-local
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const restaurantsById = useMemo(() => {
    const m = new Map();
    restaurants.forEach((r) => m.set(String(r.id), r));
    return m;
  }, [restaurants]);

  async function load() {
    setErr("");
    try {
      const [a, r] = await Promise.all([
        http.get("/api/appointments"),
        http.get("/api/restaurants"),
      ]);
      setAppointments(a.data.appointments || []);
      setRestaurants(r.data.restaurants || []);
    } catch (e) {
      setErr(e.response?.data?.message || "Server error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    setErr("");

    if (!title.trim()) return setErr("Thiếu tiêu đề");
    if (!meetingTime) return setErr("Chọn thời gian");

    const payload = {
      title: title.trim(),
      meeting_time: toMysqlDatetime(meetingTime),
      description: description.trim() || undefined,
      restaurant_id: restaurantId ? Number(restaurantId) : undefined,
      max_participants: maxParticipants ? Number(maxParticipants) : undefined,
    };

    try {
      setLoading(true);
      await http.post("/api/appointments", payload);
      setTitle("");
      setRestaurantId("");
      setMeetingTime("");
      setDescription("");
      setMaxParticipants("");
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || "Tạo cuộc hẹn thất bại");
    } finally {
      setLoading(false);
    }
  }

  async function join(id) {
    try {
      await http.post(`/api/appointments/${id}/join`);
      await load();
    } catch {}
  }

  async function leave(id) {
    try {
      await http.post(`/api/appointments/${id}/leave`);
      await load();
    } catch {}
  }

  return (
    <div className="col" style={{ gap: 14 }}>
      <div className="card padded">
        <div style={{ fontWeight: 1000, fontSize: 18 }}>Cuộc hẹn</div>
        <div className="muted" style={{ marginTop: 4 }}>
          Tạo cuộc hẹn rủ bạn đi ăn • Join cuộc hẹn để xem chi tiết và chat trong phòng
        </div>

        <div className="grid" style={{ marginTop: 12 }}>
          <div>
            <label>Tiêu đề</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Ăn tối cuối tuần" />
          </div>
          <div>
            <label>Quán (tuỳ chọn)</label>
            <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)}>
              <option value="">-- không chọn --</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid" style={{ marginTop: 12 }}>
          <div>
            <label>Thời gian</label>
            <input type="datetime-local" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
          </div>
          <div>
            <label>Số người tối đa (tuỳ chọn)</label>
            <input
              type="number"
              min={2}
              max={200}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              placeholder="VD: 4"
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Mô tả (tuỳ chọn)</label>
          <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="VD: ai rảnh thì đi" />
        </div>

        {err && <div className="err" style={{ marginTop: 10 }}>{err}</div>}

        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="btn btn-primary" disabled={loading} onClick={create}>
            {loading ? "Đang tạo..." : "Tạo cuộc hẹn"}
          </button>
        </div>
      </div>

      <div className="grid3">
        {appointments.map((a) => (
          <div key={a.id} className="card padded">
            <div style={{ fontWeight: 1000 }}>{a.title}</div>

            <div className="muted" style={{ marginTop: 8 }}>⏰ {a.meeting_time}</div>

            {(a.restaurant?.name || restaurantsById.get(String(a.restaurant_id))?.name) && (
              <div className="muted" style={{ marginTop: 6 }}>
                🍽️ {a.restaurant?.name || restaurantsById.get(String(a.restaurant_id))?.name}
              </div>
            )}

            <div className="muted" style={{ marginTop: 6 }}>👥 {a.participants_count ?? 0} người</div>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn" to={`/appointments/${a.id}`}>Mở</Link>
              {a.joined_by_me ? (
                <button className="btn" onClick={() => leave(a.id)}>Rời</button>
              ) : (
                <button className="btn" onClick={() => join(a.id)}>Join</button>
              )}
            </div>

            {!a.joined_by_me && (
              <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
                * Muốn xem chat/detail bạn cần Join trước
              </div>
            )}
          </div>
        ))}
      </div>

      {!appointments.length && !err && <div className="pill">Chưa có cuộc hẹn</div>}
    </div>
  );
}
