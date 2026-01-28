import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock, Utensils, User } from "lucide-react";
import http from "../api/http";

function formatDateTime(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export default function AppointmentDetail() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [err, setErr] = useState("");
  const lastIdRef = useRef(0);

  async function loadDetail() {
    setErr("");
    try {
      const res = await http.get(`/api/appointments/${id}`);
      setAppointment(res.data.appointment);
      setParticipants(res.data.participants || []);
    } catch (e) {
      setErr(e.response?.data?.message || "Không xem được cuộc hẹn (cần join trước)");
      setAppointment(null);
      setParticipants([]);
    }
  }

  async function loadMessages() {
    try {
      const afterId = lastIdRef.current || 0;
      const res = await http.get(`/api/appointments/${id}/messages?afterId=${afterId}`);
      const newMsgs = res.data.messages || [];
      if (newMsgs.length) {
        lastIdRef.current = newMsgs[newMsgs.length - 1].id;
        setMessages((prev) => [...prev, ...newMsgs]);
      }
    } catch {}
  }

  useEffect(() => {
    lastIdRef.current = 0;
    setMessages([]);
    loadDetail();
    const t = setInterval(loadMessages, 2000);
    loadMessages();
    return () => clearInterval(t);
  }, [id]);

  async function send() {
    if (!content.trim()) return;
    setErr("");
    try {
      await http.post(`/api/appointments/${id}/messages`, { content: content.trim() });
      setContent("");
      await loadMessages();
    } catch (e) {
      setErr(e.response?.data?.message || "Gửi tin nhắn thất bại");
    }
  }

  return (
    <div className="col" style={{ gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link className="pill" to="/appointments">← Back</Link>
        {appointment && <div className="pill">{appointment.title}</div>}
      </div>

      {err && <div className="err">{err}</div>}

      {appointment && (
        <div className="card padded">
          <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 12 }}>{appointment.title}</div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Clock size={16} color="#007bff" />
            <span>{formatDateTime(appointment.meeting_time)}</span>
          </div>

          {appointment.restaurant?.name && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Utensils size={16} color="#28a745" />
              <span>{appointment.restaurant.name}</span>
            </div>
          )}

          {appointment.description && (
            <div style={{ marginBottom: 12, lineHeight: 1.6 }}>{appointment.description}</div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {participants.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", backgroundColor: "rgba(111, 66, 193, 0.1)", borderRadius: "999px", fontSize: 14 }}>
                <User size={14} color="#6f42c1" />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card padded">
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Chat</div>

        <div className="chat-list">
          {messages.map((m) => (
            <div key={m.id} className="chat-bubble">
              <div style={{ fontWeight: 900 }}>{m.user?.name || "User"}</div>
              <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{m.content}</div>
              <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>{formatDateTime(m.created_at)}</div>
            </div>
          ))}
          {!messages.length && <div className="muted">Chưa có tin nhắn</div>}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nhập tin nhắn..." />
          <button className="btn btn-primary" onClick={send}>Gửi</button>
        </div>
      </div>
    </div>
  );
}
