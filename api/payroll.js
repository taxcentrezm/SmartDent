import { client } from './_libsql.js';

export default async function handler(req, res) {
  try {
    const result = await client.execute('SELECT id, name, role, baseSalary, currency FROM payroll ORDER BY id');
    res.status(200).json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
