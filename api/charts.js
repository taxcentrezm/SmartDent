import { getClient } from './_libsql.js';

export default async function handler(req,res) {
  const db = getClient();
  try {
    // Revenue chart - monthly net payroll
    const revenueRes = await db.execute(`
      SELECT strftime('%m', period_start) AS month, SUM(net_amount) AS total
      FROM payroll
      GROUP BY month
      ORDER BY month
    `);
    const revenueLabels = revenueRes.rows.map(r => r.month);
    const revenueValues = revenueRes.rows.map(r => r.total);

    // Services chart - appointments by provider
    const serviceRes = await db.execute(`
      SELECT provider, COUNT(*) AS count
      FROM appointments
      GROUP BY provider
    `);
    const serviceLabels = serviceRes.rows.map(r => r.provider);
    const serviceValues = serviceRes.rows.map(r => r.count);
    const serviceColors = serviceLabels.map((_,i) => ['#6366F1','#10B981','#F59E0B','#EF4444'][i%4]);

    res.json({
      revenue: { labels: revenueLabels, values: revenueValues },
      services: { labels: serviceLabels, values: serviceValues, colors: serviceColors }
    });
  } catch(err) {
    console.error('CHARTS API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}
