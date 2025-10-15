import { client } from './_libsql.js';

export default async function handler(req, res) {
  try {
    // Example: revenue per month
    const revenueData = await client.execute('SELECT month, revenue FROM revenue ORDER BY month');
    
    // Example: services breakdown
    const serviceData = await client.execute('SELECT service, count FROM services ORDER BY service');

    res.status(200).json({
      revenue: revenueData.rows || [],
      services: serviceData.rows || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
