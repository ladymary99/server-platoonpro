// server/routes/forms.js
import express from "express";
import { body, validationResult } from "express-validator";
import pkg from "pg";
const { Pool } = pkg;

const router = express.Router();

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// ---------------- CONTACT FORM ----------------
router.post(
  "/contact",
  body("name").notEmpty(),
  body("email").isEmail(),
  body("message").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    try {
      const query =
        "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *";
      const values = [name, email, message];
      const result = await pool.query(query, values);

      res.status(201).json({ ok: true, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// ---------------- SUBSCRIBE FORM ----------------
router.post("/subscribe", body("email").isEmail(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const query =
      "INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING *";
    const values = [email];
    const result = await pool.query(query, values);

    res.status(201).json({ ok: true, data: result.rows[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
