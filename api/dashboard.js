// api/dashboard.js
import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  const db = getClient();
  if (!db) return res.status(500).json({ error: 'DB client not configured' });

  try {
    const patientRows = await db.execute('SELECT COUNT(*) FROM patients');
    const revenueRows = await db.execute('SELECT SUM(amount) FROM appointments'); // Or your revenue column
    const appointmentRows = await db.execute('SELECT COUNT(*) FROM appointments WHERE date(start_time)=date("now")');
    const stockRows = await db.execute('SELECT COUNT(*) FROM inventory WHERE quantity <= reorder_level');

    res.json({
      totalPatients: patientRows.rows[0][0] || 0,
      revenueYTD: revenueRows.rows[0][0] || 0,
      appointmentsToday: appointmentRows.rows[0][0] || 0,
      stockAlerts: stockRows.rows[0][0] || 0
    });
  } catch (err) {
    console.error('DASHBOARD API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}
