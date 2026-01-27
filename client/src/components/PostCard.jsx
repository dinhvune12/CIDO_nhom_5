import React from "react";

function formatDate(dt) {
  try {
    const d = new Date(dt);
    return d.toLocaleString();
  } catch {
    return "";
  }
}

export default function PostCard({ post }) {
  if (!post) return null;

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        background: "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <b>{post.user?.name || "Unknown"}</b>
          <span style={{ marginLeft: 8, color: "#6b7280", fontSize: 12 }}>
            {formatDate(post.created_at)}
          </span>
        </div>
        <span
          style={{
            fontSize: 12,
            padding: "2px 8px",
            borderRadius: 999,
            background: post.type === "review" ? "#ecfeff" : "#f3f4f6",
            border: "1px solid #e5e7eb",
          }}
        >
          {post.type}
        </span>
      </div>

      {post.type === "review" && (
        <div style={{ marginTop: 8, color: "#111827" }}>
          <div>
            <b>Quán:</b> {post.restaurant_name || "(không có)"}
          </div>
          <div>
            <b>Rating:</b> {post.rating ?? "-"}/5
          </div>
        </div>
      )}

      <div style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{post.content}</div>

      {post.image_url && (
        <div style={{ marginTop: 10 }}>
          <img
            src={post.image_url}
            alt="post"
            style={{ maxWidth: "100%", borderRadius: 10 }}
          />
        </div>
      )}

      <div style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>
        👍 {post.like_count ?? 0} · 💬 {post.comment_count ?? 0}
      </div>
    </div>
  );
}
