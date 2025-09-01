import express from "express";
import { query } from "../db.js";

const router = express.Router();

// Contact form
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const result = await query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, email, message]
    );
    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Subscription form
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await query(
      "INSERT INTO subscribers (email) VALUES ($1) RETURNING *",
      [email]
    );
    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
