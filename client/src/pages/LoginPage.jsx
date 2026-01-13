import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http.js";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await http.post("/api/auth/login", { email, password });
      const { token, user } = res.data || {};
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user || {}));
      nav("/feed");
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%" }} />
        </div>
        {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}
        <button type="submit">Sign in</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}
