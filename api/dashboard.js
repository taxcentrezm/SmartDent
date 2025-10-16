import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  const client = getClient();

  try {
    // Total patients
    const patientsResult = await client.execute(`SELECT COUNT(*) AS total FROM patients`);
    const totalPatients = patientsResult?.rows?.[0]?.total ?? 0;

    // Appointments today
    const today = new Date().toISOString().slice(0, 10);
    const apptResult = await client.execute(
      `SELECT COUNT(*) AS total FROM appointments WHERE DATE(start_time) = ?`,
      [today]
    );
    const appointmentsToday = apptResult?.rows?.[0]?.total ?? 0;

    // Revenue YTD
    const revenueResult = await client.execute(
      `SELECT SUM(amount) AS total FROM revenue WHERE year = ?`,
      [2025]
    );
    const revenueYTD = revenueResult?.rows?.[0]?.total ?? 0;

    // Low stock items
    const stockResult = await client.execute(
      `SELECT COUNT(*) AS total FROM inventory WHERE quantity <= reorder_level`
    );
    const lowStockItems = stockResult?.rows?.[0]?.total ?? 0;

    // Monthly revenue (for Revenue Trend)
    const revenueRows = await client.execute(
      `SELECT month, SUM(amount) AS total 
       FROM revenue 
       WHERE year = ? 
       GROUP BY month 
       ORDER BY month`,
      [2025]
    );

    const revenueTrend = {
      labels: Array.from({ length: 12 }, (_, i) => new Date(2025, i).toLocaleString('default', { month: 'short' })),
      values: Array(12).fill(0)
    };

    revenueRows.rows.forEach(r => {
      const idx = r.month - 1;
      revenueTrend.values[idx] = r.total;
    });

    // Service breakdown (for Doughnut chart)
    const serviceRows = await client.execute(
      `SELECT service, SUM(amount) AS total
       FROM revenue
       WHERE year = ?
       GROUP BY service`,
      [2025]
    );

    const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F43F5E']; // sample palette
    const services = {
      labels: serviceRows.rows.map(r => r.service),
      values: serviceRows.rows.map(r => r.total),
      colors: serviceRows.rows.map((_, i) => colors[i % colors.length])
    };

    res.status(200).json({
      totalPatients,
      appointmentsToday,
      revenueYTD,
      lowStockItems,
      revenue: revenueTrend,
      services
    });
  } catch (err) {
    console.error('DASHBOARD API ERROR:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
