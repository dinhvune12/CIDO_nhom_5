import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http.js";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await http.post("/api/auth/login", { email, password });
      const token = res.data?.token;
      const user = res.data?.user;
      if (!token) throw new Error("No token");
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user || {}));
      nav("/feed", { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Đăng nhập thất bại");
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
            <div className="muted" style={{ marginTop: 6 }}>Đăng nhập</div>
          </div>

          {err && <div className="err" style={{ marginBottom: 12 }}>{err}</div>}

          <form onSubmit={submit} className="stack" style={{ gap: 12 }}>
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
                  placeholder="Mật khẩu"
                  type={showPwd ? "text" : "password"}
                  style={{ flex: 1 }}
                />
                <button type="button" className="btn small" onClick={() => setShowPwd((s) => !s)} style={{ whiteSpace: "nowrap" }}>
                  {showPwd ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <button className="btn btn-primary full" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <div className="muted">Chưa có tài khoản?</div>
              <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>Đăng ký</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
