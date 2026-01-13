import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

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

    // TODO (BE-2): check email exists, hash password, insert user, return success
    return res.status(501).json({ message: "TODO: implement register" });
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

    // TODO (BE-2): find user, check locked, bcrypt compare, sign token, return token+user
    return res.status(501).json({ message: "TODO: implement login" });
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
    // Option A: return decoded payload only
    // Option B (recommended): fetch full user from DB by req.user.uid
    return res.json({ user: req.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
