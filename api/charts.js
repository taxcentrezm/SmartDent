import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  try {
    const client = getClient();

    // Example: use appointments table to generate chart data (by status)
    const result = await client.execute(`
      SELECT 
        status AS label,
        COUNT(*) AS value
      FROM appointments
      GROUP BY status
      ORDER BY value DESC
    `);

    const labels = result.rows.map(r => r.label);
    const values = result.rows.map(r => r.value);
    const colors = ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF"];

    res.status(200).json({ labels, values, colors });
  } catch (err) {
    console.error("CHARTS API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
