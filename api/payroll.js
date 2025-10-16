import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  try {
    const client = getClient();
    const result = await client.execute(`
      SELECT 
        p.id,
        e.name AS employee_name,
        p.period_start,
        p.period_end,
        p.gross_amount,
        p.tax_amount,
        p.net_amount,
        p.created_at
      FROM payroll p
      LEFT JOIN employees e ON e.id = p.employee_id
      ORDER BY p.created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("PAYROLL API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
