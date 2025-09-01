import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ error: "Missing fields" });

    try {
      const result = await pool.query(
        "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *",
        [name, email, message]
      );
      return res.status(201).json({ ok: true, data: result.rows[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
