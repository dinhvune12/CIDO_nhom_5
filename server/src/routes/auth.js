import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.js";
import authMiddleware from "../middleware/auth.js";


const router = express.Router();

const signToken = (payload) => {
  const expiresIn = process.env.JWT_EXPIRE || "1d";
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * POST /api/auth/register
 * body: { name, email, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // Check email exists
    const [rows] = await pool.execute("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user (default role=user, locked=0)
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password_hash, role, locked) VALUES (?, ?, ?, 'user', 0)",
      [name, email, password_hash]
    );

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: { id: result.insertId, name, email, role: "user" },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    const [rows] = await pool.execute(
      "SELECT id, name, email, password_hash, role, locked FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Sai tài khoản/mật khẩu" });
    }

    const user = rows[0];

    if (user.locked === 1) {
      return res.status(403).json({ message: "Tài khoản bị khóa" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Sai tài khoản/mật khẩu" });
    }

    // JWT payload
    const token = signToken({ uid: user.id, role: user.role });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/auth/me
 * header: Authorization: Bearer <token>
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Invalid token" });

    const [rows] = await pool.execute(
      "SELECT id, name, email, role, locked, created_at FROM users WHERE id = ?",
      [uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const u = rows[0];
    return res.json({
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        locked: u.locked,
        created_at: u.created_at,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;
