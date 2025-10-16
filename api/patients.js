import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  try {
    const client = getClient();
    const result = await client.execute(`
      SELECT 
        id,
        first_name,
        last_name,
        birthdate,
        phone,
        email,
        notes,
        created_at
      FROM patients
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("PATIENTS API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
