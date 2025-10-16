// payroll.js
import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  const client = getClient();

  try {
    const result = await client.execute(`
      SELECT id, name, role, baseSalary
      FROM payroll
      ORDER BY name ASC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("PAYROLL API ERROR:", err);
    res.status(500).json({ error: "Failed to load payroll", details: err.message });
  }
}
