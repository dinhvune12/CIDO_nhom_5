import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http.js";

export default function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    try {
      const res = await http.post("/api/auth/register", { name, email, password });
      setOk(res.data?.message || "Đăng ký thành công. Mời đăng nhập.");
      nav("/login");
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || "Register failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%" }} />
        </div>
        {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}
        {ok && <div style={{ color: "green", marginBottom: 8 }}>{ok}</div>}
        <button type="submit">Create account</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}
