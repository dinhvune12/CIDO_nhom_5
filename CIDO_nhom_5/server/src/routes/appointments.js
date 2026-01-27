import express from "express";
import pool from "../db/db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

function dbErrorMessage(err){
  const code = err?.code || "";
  if (code === "ER_NO_SUCH_TABLE") {
    return "Thiếu bảng appointments. Hãy import server/sql/week5.sql vào DB foodbook rồi chạy lại.";
  }
  if (code === "ER_BAD_FIELD_ERROR") {
    return "Sai cột DB (schema chưa cập nhật). Hãy kiểm tra lại file SQL tuần 5.";
  }
  return "Server error";
}


async function isParticipant(appointmentId, userId) {
  const [rows] = await pool.execute(
    "SELECT 1 FROM appointment_participants WHERE appointment_id=? AND user_id=? LIMIT 1",
    [appointmentId, userId]
  );
  return rows.length > 0;
}

/**
 * GET /api/appointments
 * Auth required
 * - list cuộc hẹn (open/closed, không cancelled)
 * - kèm restaurant name (nếu có), participants_count, joined_by_me
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;

    const [rows] = await pool.execute(
      `
      SELECT 
        a.id, a.title, a.description, a.meeting_time, a.max_participants, a.status, a.created_at,
        a.creator_id,
        r.id AS restaurant_id, r.name AS restaurant_name,
        (SELECT COUNT(*) FROM appointment_participants ap WHERE ap.appointment_id=a.id) AS participants_count,
        (SELECT COUNT(*) FROM appointment_participants ap2 WHERE ap2.appointment_id=a.id AND ap2.user_id=?) AS joined_count
      FROM appointments a
      LEFT JOIN restaurants r ON r.id = a.restaurant_id
      WHERE a.status <> 'cancelled'
      ORDER BY a.meeting_time ASC
      LIMIT 100
      `,
      [uid]
    );

    const appointments = rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      meeting_time: r.meeting_time,
      max_participants: r.max_participants,
      status: r.status,
      created_at: r.created_at,
      creator_id: r.creator_id,
      restaurant: r.restaurant_id
        ? { id: r.restaurant_id, name: r.restaurant_name }
        : null,
      participants_count: Number(r.participants_count || 0),
      joined_by_me: Number(r.joined_count || 0) > 0,
    }));

    return res.json({ appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: dbErrorMessage(err) });
  }
});

/**
 * POST /api/appointments
 * Auth required
 * Body: { title, description?, meeting_time, restaurant_id?, max_participants? }
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { title, description, meeting_time, restaurant_id, max_participants } = req.body || {};

    if (!title || String(title).trim().length < 3) {
      return res.status(400).json({ message: "title is required (min 3 chars)" });
    }
    if (!meeting_time) {
      return res.status(400).json({ message: "meeting_time is required" });
    }
    const dt = new Date(meeting_time);
    if (Number.isNaN(dt.getTime())) {
      return res.status(400).json({ message: "meeting_time is invalid" });
    }

    let rid = restaurant_id ? Number(restaurant_id) : null;
    if (rid != null) {
      if (!Number.isFinite(rid) || rid <= 0) return res.status(400).json({ message: "restaurant_id is invalid" });
      const [rRows] = await pool.execute("SELECT id FROM restaurants WHERE id=?", [rid]);
      if (rRows.length === 0) return res.status(400).json({ message: "restaurant_id not found" });
    }

    let maxP = max_participants == null || max_participants === "" ? null : Number(max_participants);
    if (maxP != null) {
      if (!Number.isFinite(maxP) || maxP < 2 || maxP > 200) {
        return res.status(400).json({ message: "max_participants must be 2..200" });
      }
      maxP = Math.round(maxP);
    }

    const [result] = await pool.execute(
      `
      INSERT INTO appointments (creator_id, restaurant_id, title, description, meeting_time, max_participants, status)
      VALUES (?, ?, ?, ?, ?, ?, 'open')
      `,
      [
        uid,
        rid,
        title.trim(),
        description || null,
        dt.toISOString().slice(0, 19).replace("T", " "),
        maxP,
      ]
    );

    const apptId = result.insertId;
    // auto join creator
    await pool.execute(
      "INSERT IGNORE INTO appointment_participants (appointment_id, user_id) VALUES (?, ?)",
      [apptId, uid]
    );

    return res.status(201).json({
      appointment: { id: apptId, title: title.trim(), meeting_time: dt.toISOString(), status: "open" },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: dbErrorMessage(err) });
  }
});

/**
 * GET /api/appointments/:id
 * Auth required
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    // must be participant to view detail/chat
    const ok = await isParticipant(id, uid);
    if (!ok) return res.status(403).json({ message: "You must join this appointment" });

    const [aRows] = await pool.execute(
      `
      SELECT 
        a.*, r.name AS restaurant_name
      FROM appointments a
      LEFT JOIN restaurants r ON r.id = a.restaurant_id
      WHERE a.id=?
      `,
      [id]
    );
    if (aRows.length === 0) return res.status(404).json({ message: "Appointment not found" });

    const a = aRows[0];

    const [pRows] = await pool.execute(
      `
      SELECT u.id, u.name, ap.joined_at
      FROM appointment_participants ap
      JOIN users u ON u.id = ap.user_id
      WHERE ap.appointment_id=?
      ORDER BY ap.joined_at ASC
      `,
      [id]
    );

    return res.json({
      appointment: {
        id: a.id,
        title: a.title,
        description: a.description,
        meeting_time: a.meeting_time,
        max_participants: a.max_participants,
        status: a.status,
        created_at: a.created_at,
        creator_id: a.creator_id,
        restaurant: a.restaurant_id ? { id: a.restaurant_id, name: a.restaurant_name } : null,
      },
      participants: pRows.map((p) => ({ id: p.id, name: p.name, joined_at: p.joined_at })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: dbErrorMessage(err) });
  }
});

/**
 * POST /api/appointments/:id/join
 */
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    const [aRows] = await pool.execute(
      "SELECT id, status, max_participants FROM appointments WHERE id=?",
      [id]
    );
    if (aRows.length === 0) return res.status(404).json({ message: "Appointment not found" });
    if (aRows[0].status !== "open") return res.status(400).json({ message: "Appointment is not open" });

    const [countRows] = await pool.execute(
      "SELECT COUNT(*) AS c FROM appointment_participants WHERE appointment_id=?",
      [id]
    );
    const current = Number(countRows[0].c || 0);
    const maxP = aRows[0].max_participants;
    if (maxP != null && current >= maxP) {
      return res.status(400).json({ message: "Appointment is full" });
    }

    await pool.execute(
      "INSERT IGNORE INTO appointment_participants (appointment_id, user_id) VALUES (?, ?)",
      [id, uid]
    );
    return res.json({ message: "Joined" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: dbErrorMessage(err) });
  }
});

/**
 * POST /api/appointments/:id/leave
 */
router.post("/:id/leave", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    const [aRows] = await pool.execute("SELECT creator_id FROM appointments WHERE id=?", [id]);
    if (aRows.length === 0) return res.status(404).json({ message: "Appointment not found" });
    if (aRows[0].creator_id === uid) {
      return res.status(400).json({ message: "Creator cannot leave. Cancel in future week." });
    }

    await pool.execute(
      "DELETE FROM appointment_participants WHERE appointment_id=? AND user_id=?",
      [id, uid]
    );
    return res.json({ message: "Left" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: dbErrorMessage(err) });
  }
});

/**
 * GET /api/appointments/:id/messages?afterId=123
 */
router.get("/:id/messages", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    const ok = await isParticipant(id, uid);
    if (!ok) return res.status(403).json({ message: "You must join this appointment" });

    const afterId = req.query.afterId ? Number(req.query.afterId) : 0;
    const [rows] = await pool.execute(
      `
      SELECT m.id, m.content, m.created_at, u.id AS user_id, u.name AS user_name
      FROM appointment_messages m
      JOIN users u ON u.id = m.user_id
      WHERE m.appointment_id=? AND m.id > ?
      ORDER BY m.id ASC
      LIMIT 200
      `,
      [id, afterId]
    );

    const messages = rows.map((r) => ({
      id: r.id,
      content: r.content,
      created_at: r.created_at,
      user: { id: r.user_id, name: r.user_name },
    }));

    return res.json({ messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: dbErrorMessage(err) });
  }
});

/**
 * POST /api/appointments/:id/messages
 * Body: { content }
 */
router.post("/:id/messages", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    const ok = await isParticipant(id, uid);
    if (!ok) return res.status(403).json({ message: "You must join this appointment" });

    const { content } = req.body || {};
    if (!content || String(content).trim().length === 0) {
      return res.status(400).json({ message: "content is required" });
    }

    const [result] = await pool.execute(
      "INSERT INTO appointment_messages (appointment_id, user_id, content) VALUES (?, ?, ?)",
      [id, uid, String(content).trim()]
    );

    return res.status(201).json({ message: "Sent", id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: dbErrorMessage(err) });
  }
});

export default router;
