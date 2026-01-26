import React, { useEffect, useState } from "react";
import http from "../api/http.js";
import { Link, useNavigate } from "react-router-dom";
import CreatePostBox from "../components/CreatePostBox.jsx";
import PostCard from "../components/PostCard.jsx";

export default function Feed() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [err, setErr] = useState("");

  const loadMe = async () => {
    const res = await http.get("/api/auth/me");
    setMe(res.data?.user || null);
  };

  const loadPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await http.get("/api/posts");
      setPosts(res.data?.posts || []);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadMe();
        await loadPosts();
      } catch (e) {
        setErr(e?.response?.data?.message || "Session invalid");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        nav("/login", { replace: true });
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login", { replace: true });
  };

  return (
    <div style={{ padding: 16, maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Feed</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/restaurants">Restaurants</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {err && <div style={{ color: "crimson", marginTop: 8 }}>{err}</div>}

      {me ? (
        <p style={{ color: "#374151" }}>
          Xin chào: <b>{me.name}</b> ({me.email}) — role: <b>{me.role}</b>
        </p>
      ) : (
        <p>Loading user...</p>
      )}

      <CreatePostBox onCreated={loadPosts} />

      <div style={{ marginTop: 10 }}>
        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>Chưa có bài viết nào.</p>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>
    </div>
  );
}
