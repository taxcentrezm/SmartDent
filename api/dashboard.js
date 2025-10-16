import { client } from '../../db.js';

export default async function handler(req, res) {
  try {
    const year = new Date().getFullYear();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 1️⃣ Total Patients
    const totalPatientsResult = await client.execute(`
      SELECT COUNT(*) AS total FROM patients
    `);
    const totalPatients = totalPatientsResult.rows[0]?.total || 0;

    // 2️⃣ Appointments Today
    const appointmentsTodayResult = await client.execute(`
      SELECT COUNT(*) AS total
      FROM appointments
      WHERE DATE(start_time) = ?
    `, [today]);
    const appointmentsToday = appointmentsTodayResult.rows[0]?.total || 0;

    // 3️⃣ Revenue YTD
    const revenueResult = await client.execute(`
      SELECT SUM(amount) AS total
      FROM appointments
      WHERE strftime('%Y', created_at) = ?
    `, [year]);
    const revenueYTD = revenueResult.rows[0]?.total || 0;

    // 4️⃣ Low Stock Items
    const stockResult = await client.execute(`
      SELECT COUNT(*) AS total
      FROM inventory
      WHERE quantity <= reorder_level
    `);
    const lowStockItems = stockResult.rows[0]?.total || 0;

    // 5️⃣ Services Breakdown
    const servicesResult = await client.execute(`
      SELECT service, COUNT(*) AS total
      FROM appointments
      WHERE strftime('%Y', created_at) = ?
      GROUP BY service
    `, [year]);

    const colors = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'];
    const services = {
      labels: servicesResult.rows.map(r => r.service),
      values: servicesResult.rows.map(r => r.total),
      colors: colors.slice(0, servicesResult.rows.length)
    };

    res.status(200).json({
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
