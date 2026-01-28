import { useMemo } from "react";
import { Heart, MessageCircle, Share, Star } from "lucide-react";

function formatDateTime(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

function initials(name) {
  const n = (name || "U").trim();
  if (!n) return "U";
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PostCard({ post, onLike }) {
  const userName = post?.user?.name || "Unknown";
  const created = post?.created_at ? formatDateTime(post.created_at) : "";
  const isReview = post?.type === "review";

  const tagText = useMemo(() => {
    if (!isReview) return "status";
    const rName = post?.restaurant?.name || "Restaurant";
    return `review • ${rName}`;
  }, [isReview, post]);

  return (
    <div className="card post-card">
      <div className="post-head">
        <div className="post-left">
          <div className="avatar">{initials(userName)}</div>
          <div className="post-meta">
            <div className="post-author">{userName}</div>
            <div className="post-time">{created}</div>
          </div>
        </div>
        {isReview && (
          <div className="post-rating">
            <Star size={14} fill="currentColor" />
            <span>{post?.rating ?? 0}</span>
          </div>
        )}
      </div>

      <div className="post-content">{post?.content}</div>

      {post?.image_url && (
        <div className="post-media">
          <img src={post.image_url} alt="post" style={{ width: "100%", borderRadius: "8px" }} />
        </div>
      )}

      <div className="post-actions">
        <button type="button" className="act act-like" onClick={onLike}>
          <Heart size={16} />
          <span>{post?.like_count ?? 0}</span>
        </button>
        <button type="button" className="act act-comment" disabled>
          <MessageCircle size={16} />
          <span>{post?.comment_count ?? 0}</span>
        </button>
        <button type="button" className="act act-share" disabled>
          <Share size={16} />
        </button>
      </div>
    </div>
  );
}
