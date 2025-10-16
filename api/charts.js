import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  try {
    const client = getClient();

    const year = new Date().getFullYear();
    const revenueResult = await client.execute(
      `SELECT strftime('%m', period_end) AS month, SUM(net_amount) AS total
       FROM payroll
       WHERE strftime('%Y', period_end) = ?
       GROUP BY month ORDER BY month ASC`, [String(year)]
    );
    const revenueRows = revenueResult.rows || [];

    // Fill Jan–Dec
    const revenueMap = {};
    for (let i = 1; i <= 12; i++) revenueMap[i.toString().padStart(2, '0')] = 0;
    revenueRows.forEach(r => { revenueMap[r.month] = r.total || 0; });

    const revenue = {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      values: Object.values(revenueMap)
    };

    // Services breakdown
    const servicesResult = await client.execute(
      `SELECT provider AS service, COUNT(*) AS count FROM appointments GROUP BY provider;`
    );
    const servicesRows = servicesResult.rows || [];
    const services = {
      labels: servicesRows.map(r => r.service || 'Unknown'),
      values: servicesRows.map(r => r.count || 0),
      colors: servicesRows.map((_, i) => ['#60A5FA','#34D399','#FBBF24','#F87171','#A78BFA'][i % 5])
    };

    res.json({ revenue, services });
  } catch (err) {
    console.error('CHARTS API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}
