// charts.js
import { getClient } from "./_libsql.js";

export default async function handler(req, res) {
  const client = getClient();

  try {
    // Revenue over months
    const rev = await client.execute(`
      SELECT month, revenue
      FROM revenue
      ORDER BY month ASC
    `);

    // Most common treatments or services
    const svc = await client.execute(`
      SELECT service, count
      FROM services
      ORDER BY count DESC
      LIMIT 5
    `);

    const revenue = {
      labels: rev.rows.map(r => r.month),
      values: rev.rows.map(r => r.revenue),
    };

    const services = {
      labels: svc.rows.map(s => s.service),
      values: svc.rows.map(s => s.count),
      colors: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"],
    };

    res.status(200).json({ revenue, services });
  } catch (err) {
    console.error("CHARTS API ERROR:", err);
    res.status(500).json({ error: "Failed to load charts", details: err.message });
  }
}
