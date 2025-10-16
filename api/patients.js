// patients.js
import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  const client = getClient();

  try {
    const result = await client.execute(`
      SELECT id, name, note, date, status
      FROM patients
      ORDER BY date DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("PATIENTS API ERROR:", err);
    res.status(500).json({ error: "Failed to load patients", details: err.message });
  }
}
