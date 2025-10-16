import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  try {
    const totalPatients = await db.get(`SELECT COUNT(*) as c FROM patients`);
    const appointmentsToday = await db.get(`SELECT COUNT(*) as c FROM appointments WHERE DATE(start_time) = DATE('now')`);
    const revenueYTD = await db.get(`SELECT SUM(amount) as total FROM appointments WHERE strftime('%Y', start_time) = strftime('%Y','now')`);
    const stockAlerts = await db.get(`SELECT COUNT(*) as c FROM inventory WHERE quantity <= reorder_level`);
    
    res.json({
      totalPatients: totalPatients.c || 0,
      appointmentsToday: appointmentsToday.c || 0,
      revenueYTD: revenueYTD.total || 0,
      stockAlerts: stockAlerts.c || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
