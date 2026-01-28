import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http.js";

export default function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim()) return setErr("Vui lòng nhập họ tên");
    if (!email.trim()) return setErr("Vui lòng nhập email");
    if (!password) return setErr("Vui lòng nhập mật khẩu");
    if (password.length < 6) return setErr("Mật khẩu phải >= 6 ký tự");
    if (password !== confirm) return setErr("Mật khẩu không khớp");

    setLoading(true);
    try {
      await http.post("/api/auth/register", { name: name.trim(), email: email.trim(), password });
      nav("/login", { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-right" style={{ width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <div className="brand-badge" style={{ width: 56, height: 56, margin: "0 auto 10px" }} />
            <h1 style={{ margin: 0, fontSize: 22 }}>Foodbook</h1>
            <div className="muted" style={{ marginTop: 6 }}>Tạo tài khoản</div>
          </div>

          {err && <div className="err" style={{ marginBottom: 12 }}>{err}</div>}

          <form onSubmit={submit} className="stack" style={{ gap: 12 }}>
            <div>
              <label>Họ tên</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" />
            </div>

            <div>
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email" />
            </div>

            <div>
              <label>Mật khẩu</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu (>=6 ký tự)"
                  type={showPwd ? "text" : "password"}
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn small" onClick={() => setShowPwd((s) => !s)} style={{ whiteSpace: "nowrap" }}>
                  {showPwd ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <div>
              <label>Xác nhận mật khẩu</label>
              <input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Nhập lại mật khẩu" type={showPwd ? "text" : "password"} />
            </div>

            <button className="btn btn-primary full" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo tài khoản"}
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <div className="muted">Đã có tài khoản?</div>
              <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Đăng nhập</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
