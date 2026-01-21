import express from "express";
import pool from "../db/db.js";

const router = express.Router();

// GET /api/restaurants
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
          r.id,
          r.name,
          r.address,
          r.area,
          r.type,
          r.price_range,
          r.image_url,
          r.created_at,
          (
            SELECT ROUND(AVG(p.rating), 1)
            FROM posts p
            WHERE p.type='review' AND p.status='approved' AND p.visibility='public' AND p.restaurant_id = r.id
          ) AS rating_avg
        FROM restaurants r
        ORDER BY r.created_at DESC, r.id DESC
        LIMIT 500`
    );

    const restaurants = rows.map((r) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      area: r.area,
      type: r.type,
      price_range: r.price_range,
      image_url: r.image_url,
      rating_avg: r.rating_avg !== null ? Number(r.rating_avg) : null,
      created_at: r.created_at,
    }));

    return res.json({ restaurants });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/restaurants/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const [rows] = await pool.execute(
      `SELECT 
          r.id,
          r.name,
          r.address,
          r.area,
          r.type,
          r.price_range,
          r.image_url,
          r.created_at,
          (
            SELECT ROUND(AVG(p.rating), 1)
            FROM posts p
            WHERE p.type='review' AND p.status='approved' AND p.visibility='public' AND p.restaurant_id = r.id
          ) AS rating_avg
        FROM restaurants r
        WHERE r.id=?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const r = rows[0];
    return res.json({
      restaurant: {
        id: r.id,
        name: r.name,
        address: r.address,
        area: r.area,
        type: r.type,
        price_range: r.price_range,
        image_url: r.image_url,
        rating_avg: r.rating_avg !== null ? Number(r.rating_avg) : null,
        created_at: r.created_at,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
