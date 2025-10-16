import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  try {
    const revenue = await db.all(`SELECT strftime('%m', start_time) as month, SUM(amount) as total FROM appointments GROUP BY month`);
    const services = await db.all(`SELECT type as label, COUNT(*) as value FROM appointments GROUP BY type`);
    res.json({
      revenue: {
        labels: revenue.map(r => r.month),
        values: revenue.map(r => r.total)
      },
      services: {
        labels: services.map(s => s.label),
        values: services.map(s => s.value),
        colors: ["#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"]
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
