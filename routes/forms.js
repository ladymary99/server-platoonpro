import express from "express";
import { query } from "../db.js";
import { appendToSheet } from "./googleSheets.js"; // import function

const router = express.Router();

// Contact form
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save to PostgreSQL
    const result = await query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, email, message]
    );

    // Save to Google Sheet
    await appendToSheet([name, email, message, new Date().toISOString()]);

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

    // Save to PostgreSQL
    const result = await query(
      "INSERT INTO subscribers (email) VALUES ($1) RETURNING *",
      [email]
    );

    // Save to Google Sheet
    await appendToSheet([email, new Date().toISOString()]);

    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
