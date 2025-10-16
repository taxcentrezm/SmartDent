import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  const client = getClient();
  try {
    const currentYear = new Date().getFullYear();

    // Revenue by month from payroll table
    const revenueResult = await client.execute(`
      SELECT strftime('%m', period_end) AS month, SUM(net_amount) AS total
      FROM payroll
      WHERE strftime('%Y', period_end) = ?
      GROUP BY month
    `, [currentYear.toString()]);

    // Map Turso rows to objects
    const revenueRows = revenueResult?.rows?.map(r => ({
      month: r[0],
      total: r[1]
    })) || [];

    const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const revenueValues = Array(12).fill(0);

    revenueRows.forEach(r => {
      const idx = parseInt(r.month, 10) - 1;
      revenueValues[idx] = r.total || 0;
    });

    // Service breakdown from appointments
    const apptResult = await client.execute('SELECT notes FROM appointments');
    const appointments = apptResult?.rows?.map(r => r[0]) || [];
    const servicesCount = {};

    appointments.forEach(service => {
      const name = service || 'Other';
      servicesCount[name] = (servicesCount[name] || 0) + 1;
    });

    const serviceLabels = Object.keys(servicesCount);
    const serviceValues = Object.values(servicesCount);
    const serviceColors = ['#60A5FA','#34D399','#FBBF24','#F87171','#A78BFA']; // extend as needed

    res.status(200).json({
      revenue: { labels: monthLabels, values: revenueValues },
      services: { labels: serviceLabels, values: serviceValues, colors: serviceColors }
    });

  } catch (err) {
    console.error('CHARTS API ERROR:', err);
    res.status(500).json({ error: 'Failed to load chart data' });
  }
}
