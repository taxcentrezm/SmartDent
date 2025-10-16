import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  const db = getClient();
  try {
    // Total patients
    const patientsRes = await db.execute(`SELECT COUNT(*) AS total FROM patients`);
    const totalPatients = patientsRes?.rows?.[0]?.total || 0;

    // Appointments today
    const today = new Date().toISOString().slice(0,10);
    const apptsRes = await db.execute(`
      SELECT COUNT(*) AS total 
      FROM appointments 
      WHERE DATE(start_time) = ?
    `, [today]);
    const appointmentsToday = apptsRes?.rows?.[0]?.total || 0;

    // Revenue YTD (sum net_amount in payroll)
    const ytdRes = await db.execute(`
      SELECT SUM(net_amount) AS revenueYTD
      FROM payroll
      WHERE strftime('%Y', period_start) = strftime('%Y', 'now')
    `);
    const revenueYTD = ytdRes?.rows?.[0]?.revenueYTD || 0;

    // Stock alerts (inventory below reorder_level)
    const stockRes = await db.execute(`
      SELECT COUNT(*) AS alerts FROM inventory WHERE quantity <= reorder_level
    `);
    const stockAlerts = stockRes?.rows?.[0]?.alerts || 0;

    res.json({ totalPatients, appointmentsToday, revenueYTD, stockAlerts });
  } catch(err) {
    console.error('DASHBOARD API ERROR:', err);
    res.status(500).json({ error: err.message });
  }
}
