import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  const client = getClient();

  try {
    // Total Patients
    const patientsResult = await client.execute('SELECT COUNT(*) AS total FROM patients');
    const totalPatients = patientsResult?.rows?.[0]?.total ?? 0;

    // Appointments Today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const appointmentsResult = await client.execute(
      'SELECT COUNT(*) AS total FROM appointments WHERE DATE(start_time) = ?',
      [today]
    );
    const appointmentsToday = appointmentsResult?.rows?.[0]?.total ?? 0;

    // Revenue YTD (grouped by month)
    const year = new Date().getFullYear();
    const revenueRows = await client.execute(
      `SELECT STRFTIME('%m', period_start) AS month, SUM(gross_amount) AS total
       FROM payroll
       WHERE STRFTIME('%Y', period_start) = ?
       GROUP BY month
       ORDER BY month`,
      [String(year)]
    );

    const revenueLabels = [];
    const revenueValues = [];
    for (let i = 1; i <= 12; i++) {
      const m = i.toString().padStart(2, '0');
      const row = revenueRows.rows.find(r => r.month === m);
      revenueLabels.push(new Date(year, i - 1).toLocaleString('default', { month: 'short' }));
      revenueValues.push(row?.total ?? 0);
    }
    const revenueYTD = revenueValues.reduce((a, b) => a + b, 0);

    // Low stock items
    const stockResult = await client.execute(
      'SELECT COUNT(*) AS total FROM inventory WHERE quantity <= reorder_level'
    );
    const lowStockItems = stockResult?.rows?.[0]?.total ?? 0;

    // Service breakdown (from appointments.notes)
    const serviceResult = await client.execute(
      `SELECT notes AS service, COUNT(*) AS count
       FROM appointments
       WHERE notes IS NOT NULL AND notes != ''
       GROUP BY notes`
    );

    const servicesLabels = [];
    const servicesValues = [];
    const servicesColors = [];

    const colorsPalette = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6'];

    serviceResult.rows.forEach((r, idx) => {
      servicesLabels.push(r.service);
      servicesValues.push(r.count);
      servicesColors.push(colorsPalette[idx % colorsPalette.length]);
    });

    res.status(200).json({
      totalPatients,
      appointmentsToday,
      revenueYTD,
      lowStockItems,
      revenue: { labels: revenueLabels, values: revenueValues },
      services: { labels: servicesLabels, values: servicesValues, colors: servicesColors }
    });

  } catch (err) {
    console.error('DASHBOARD API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}
