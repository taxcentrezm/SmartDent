// api/dashboard.js
import { getClient } from './_libsql.js';

export default async function handler(req, res) {
  const client = getClient();
  try {
    // 1. Dashboard metrics
    const totalPatients = (await client.execute(`SELECT COUNT(*) AS count FROM patients`)).rows[0].count;
    const appointmentsToday = (await client.execute(`
      SELECT COUNT(*) AS count 
      FROM appointments 
      WHERE DATE(start_time) = DATE('now')
    `)).rows[0].count;

    const revenueRows = (await client.execute(`SELECT * FROM revenue`)).rows; // Use your revenue table

    // 2. Build revenue trend & service breakdown
    const revenueByMonth = Array(12).fill(0);
    const services = {};

    revenueRows.forEach(r => {
      revenueByMonth[r.month - 1] += r.amount;
      services[r.service] = (services[r.service] || 0) + r.amount;
    });

    res.json({
      totalPatients,
      appointmentsToday,
      revenueYTD: revenueByMonth.reduce((a,b)=>a+b,0),
      lowStockItems: (await client.execute(`SELECT COUNT(*) AS count FROM inventory WHERE quantity < reorder_level`)).rows[0].count,
      revenue: { labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], values: revenueByMonth },
      services: {
        labels: Object.keys(services),
        values: Object.values(services),
        colors: Object.keys(services).map(() => `hsl(${Math.random()*360},70%,60%)`)
      }
    });
  } catch(e) {
    console.error('DASHBOARD API ERROR:', e);
    res.status(500).json({ error: e.message });
  }
}
