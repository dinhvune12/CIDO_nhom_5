import express from "express";
import pool from "../db/db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET /api/posts
// Public: trả bài viết mới nhất trước, kèm user + counts
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
          p.id,
          p.type,
          p.content,
          p.restaurant_id,
          p.restaurant_name,
          p.rating,
          p.image_url,
          p.status,
          p.visibility,
          p.created_at,
          u.id AS user_id,
          u.name AS user_name,
          (
            SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id
          ) AS like_count,
          (
            SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = p.id
          ) AS comment_count
        FROM posts p
        JOIN users u ON u.id = p.user_id
        WHERE p.visibility = 'public'
        ORDER BY p.created_at DESC
        LIMIT 200`
    );

    const posts = rows.map((r) => ({
      id: r.id,
      user: { id: r.user_id, name: r.user_name },
      type: r.type,
      content: r.content,
      restaurant_id: r.restaurant_id,
      restaurant_name: r.restaurant_name,
      rating: r.rating,
      image_url: r.image_url,
      status: r.status,
      visibility: r.visibility,
      created_at: r.created_at,
      like_count: Number(r.like_count ?? 0),
      comment_count: Number(r.comment_count ?? 0),
    }));

    return res.json({ posts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts (Auth required)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { content, type, restaurant_id, rating, image_url } = req.body || {};

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Invalid payload", msg: "Invalid payload" });
    }

    const postType = type || "status";
    if (postType !== "status" && postType !== "review") {
      return res.status(400).json({ message: "Invalid payload", msg: "Invalid payload" });
    }

    let restId = restaurant_id ?? null;
    let restName = null;
    let postRating = rating ?? null;

    if (postType === "review") {
      if (!restId) {
        return res.status(400).json({ message: "Invalid payload", msg: "Invalid payload" });
      }

      const parsed = Number(postRating);
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 5) {
        return res.status(400).json({ message: "Invalid payload", msg: "Invalid payload" });
      }
      // rating lưu tinyint -> ép về int
      postRating = Math.round(parsed);

      const [rrows] = await pool.execute(
        "SELECT id, name FROM restaurants WHERE id=?",
        [restId]
      );
      if (rrows.length === 0) {
        return res.status(400).json({ message: "Invalid payload", msg: "Invalid payload" });
      }
      restName = rrows[0].name;
    } else {
      restId = null;
      restName = null;
      postRating = null;
    }

    // Week 4 demo: tự approve để feed thấy ngay
    const status = "approved";

    const [result] = await pool.execute(
      `INSERT INTO posts (restaurant_name, rating, content, image_url, status, user_id, type, restaurant_id, visibility)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'public')`,
      [restName, postRating, content.trim(), image_url || null, status, uid, postType, restId]
    );

    const postId = result.insertId;

    const [created] = await pool.execute(
      `SELECT 
          p.id,
          p.type,
          p.content,
          p.restaurant_id,
          p.restaurant_name,
          p.rating,
          p.image_url,
          p.status,
          p.visibility,
          p.created_at,
          u.id AS user_id,
          u.name AS user_name
        FROM posts p
        JOIN users u ON u.id = p.user_id
        WHERE p.id=?`,
      [postId]
    );

    const row = created[0];
    return res.status(201).json({
      post: {
        id: row.id,
        user: { id: row.user_id, name: row.user_name },
        type: row.type,
        content: row.content,
        restaurant_id: row.restaurant_id,
        restaurant_name: row.restaurant_name,
        rating: row.rating,
        image_url: row.image_url,
        status: row.status,
        visibility: row.visibility,
        created_at: row.created_at,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", msg: "Server error" });
  }
});

export default router;
