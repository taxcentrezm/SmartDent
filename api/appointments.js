import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  try {
    const client = getClient();
    const result = await client.execute(`
      SELECT 
        id,
        patient_id,
        provider,
        start_time,
        end_time,
        status,
        notes,
        created_at
      FROM appointments
      ORDER BY start_time DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("APPOINTMENTS API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
