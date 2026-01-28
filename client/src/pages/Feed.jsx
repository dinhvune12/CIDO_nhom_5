import { useEffect, useState } from "react";
import http from "../api/http";
import CreatePostBox from "../components/CreatePostBox.jsx";
import PostCard from "../components/PostCard.jsx";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      setLoading(true);
      const [p, r] = await Promise.all([
        http.get("/api/posts"),
        http.get("/api/restaurants"),
      ]);
      setPosts(p.data.posts || []);
      setRestaurants(r.data.restaurants || []);
    } catch (e) {
      setErr(e.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createPost(payload) {
    setErr("");
    try {
      await http.post("/api/posts", payload);
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || "Đăng bài thất bại");
    }
  }

  async function like(postId) {
    try {
      await http.post(`/api/posts/${postId}/like`);
      await load();
    } catch {}
  }

  return (
    <div className="feed-wrap col">
      <CreatePostBox restaurants={restaurants} onCreated={createPost} />
      {err && <div className="err">{err}</div>}
      {loading && <div className="pill">Loading...</div>}

      {posts.map((p) => (
        <PostCard key={p.id} post={p} onLike={() => like(p.id)} />
      ))}

      {!loading && !posts.length && <div className="pill">No posts yet</div>}
    </div>
  );
}
