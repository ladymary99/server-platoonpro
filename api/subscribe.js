import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
      const result = await pool.query(
        "INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING *",
        [email]
      );

      return res.status(201).json({ ok: true, data: result.rows[0] || null });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
