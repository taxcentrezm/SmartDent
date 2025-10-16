import { client } from '../../db.js'; // your database client

export default async function handler(req, res) {
  try {
    // Get current year
    const year = new Date().getFullYear();

    // Revenue per month (Jan-Dec)
    const result = await client.execute(`
      SELECT
        strftime('%m', created_at) AS month,
        SUM(amount) AS revenue
      FROM appointments
      WHERE strftime('%Y', created_at) = ?
      GROUP BY month
      ORDER BY month
    `, [year]);

    // Fill missing months with 0
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const revenueMap = {};
    result.rows.forEach(r => revenueMap[r.month] = r.revenue || 0);
    const revenueValues = months.map(m => revenueMap[m] || 0);

    res.json({
      revenue: {
        labels: months.map(m => new Date(year, parseInt(m) - 1).toLocaleString('default', { month: 'short' })),
        values: revenueValues
      },
      services: await getServiceBreakdown() // optional: your existing service chart function
    });
  } catch (err) {
    console.error('CHARTS API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}

// Example function for service breakdown
async function getServiceBreakdown() {
  const services = await client.execute(`
    SELECT service, COUNT(*) AS total
    FROM appointments
    WHERE strftime('%Y', created_at) = ?
    GROUP BY service
  `, [new Date().getFullYear()]);

  const colors = ['#60A5FA','#34D399','#FBBF24','#F87171','#A78BFA'];
  return {
    labels: services.rows.map(r => r.service),
    values: services.rows.map(r => r.total),
    colors: colors.slice(0, services.rows.length)
  };
}
