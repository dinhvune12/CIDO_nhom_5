import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import http from "../api/http";

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
          <div style={{ fontWeight: 1000, fontSize: 18 }}>{appointment.title}</div>
          <div className="muted" style={{ marginTop: 8 }}>⏰ {appointment.meeting_time}</div>
          {appointment.restaurant?.name && (
            <div className="muted" style={{ marginTop: 6 }}>🍽️ {appointment.restaurant.name}</div>
          )}
          {appointment.description && (
            <div style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{appointment.description}</div>
          )}

          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {participants.map((p) => (
              <span key={p.id} className="pill">👤 {p.name}</span>
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
              <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>{m.created_at}</div>
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
