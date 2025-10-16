import { getClient } from './_libsql.js';

export default async function handler(req,res) {
  const db = getClient();
  try {
    const result = await db.execute(`
      SELECT e.name, e.role, e.base_salary, p.net_amount
      FROM payroll p
      JOIN employees e ON e.id = p.employee_id
      ORDER BY p.period_end DESC
    `);
    res.json(result.rows);
  } catch(err) {
    console.error('PAYROLL API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}
