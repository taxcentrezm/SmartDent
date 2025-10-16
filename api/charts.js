// api/charts.js
import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  const db = getClient();
  if (!db) return res.status(500).json({ error: 'DB client not configured' });

  try {
    const revenueRows = await db.execute('SELECT date(created_at) as date, SUM(amount) as total FROM appointments GROUP BY date(created_at)');
    const revenue = {
      labels: revenueRows.rows.map(r => r[0]),
      values: revenueRows.rows.map(r => r[1])
    };

    const serviceRows = await db.execute('SELECT provider, COUNT(*) as count FROM appointments GROUP BY provider');
    const services = {
      labels: serviceRows.rows.map(r => r[0]),
      values: serviceRows.rows.map(r => r[1]),
      colors: serviceRows.rows.map((_, i) => ['#6366F1','#F59E0B','#10B981','#EF4444'][i%4])
    };

    res.json({ revenue, services });
  } catch (err) {
    console.error('CHARTS API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}
