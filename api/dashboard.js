import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  try {
    const client = getClient();

    // ----------------------
    // Total patients
    // ----------------------
    const patientsResult = await client.execute(`
      SELECT COUNT(*) AS total FROM patients;
    `);
    const totalPatients = patientsResult[0]?.total || 0;

    // ----------------------
    // Appointments today
    // ----------------------
    const today = new Date().toISOString().split('T')[0];
    const appointmentsResult = await client.execute(`
      SELECT COUNT(*) AS total FROM appointments
      WHERE DATE(start_time) = ?
    `, [today]);
    const appointmentsToday = appointmentsResult[0]?.total || 0;

    // ----------------------
    // Revenue YTD
    // ----------------------
    const year = new Date().getFullYear();
    const revenueResult = await client.execute(`
      SELECT SUM(net_amount) AS total FROM payroll
      WHERE strftime('%Y', period_end) = ?
    `, [String(year)]);
    const revenueYTD = revenueResult[0]?.total || 0;

    // ----------------------
    // Low stock items
    // ----------------------
    const stockResult = await client.execute(`
      SELECT COUNT(*) AS total FROM inventory
      WHERE quantity <= reorder_level;
    `);
    const lowStockItems = stockResult[0]?.total || 0;

    // ----------------------
    // Services breakdown (by type of appointment)
    // ----------------------
    const servicesResult = await client.execute(`
      SELECT provider AS service, COUNT(*) AS count
      FROM appointments
      GROUP BY provider;
    `);

    const services = {
      labels: servicesResult.map(r => r.service || 'Unknown'),
      values: servicesResult.map(r => r.count || 0),
      colors: servicesResult.map((_, i) => ['#60A5FA','#34D399','#FBBF24','#F87171','#A78BFA'][i % 5])
    };

    res.json({
      totalPatients,
      appointmentsToday,
      revenueYTD,
      lowStockItems,
      services
    });

  } catch (err) {
    console.error('DASHBOARD API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}
