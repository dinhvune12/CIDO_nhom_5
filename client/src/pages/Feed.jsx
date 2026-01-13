import React, { useEffect, useState } from "react";
import http from "../api/http.js";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await http.get("/api/auth/me");
        setMe(res.data?.user || null);
      } catch (e) {
        setErr(e?.response?.data?.message || "Session invalid");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        nav("/login", { replace: true });
      }
    };
    load();
  }, [nav]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login", { replace: true });
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Feed</h2>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      {me ? (
        <>
          <p>
            Xin chào: <b>{me.name}</b> ({me.email}) - role: <b>{me.role}</b>
          </p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
