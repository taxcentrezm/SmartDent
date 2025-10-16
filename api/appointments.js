// appointments.js
import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  const client = getClient();

  try {
    const result = await client.execute(`
      SELECT id, patient_name, appointment_date, treatment, status
      FROM appointments
      ORDER BY appointment_date DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("APPOINTMENTS API ERROR:", err);
    res.status(500).json({ error: "Failed to load appointments", details: err.message });
  }
}
