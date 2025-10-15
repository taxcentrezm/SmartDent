// api/charts.js
import { client } from './_libsql.js';

export default async function handler(req, res) {
  try {
    // --------------------------
    // 1️⃣ Revenue chart (last 6 months)
    // --------------------------
    const revenueQuery = `
      SELECT 
        strftime('%b', date) AS month, 
        SUM(amount) AS total
      FROM appointments
      WHERE date >= date('now','-6 months')
      GROUP BY month
      ORDER BY date
    `;
    const revenueResult = await client.execute(revenueQuery);
    const revenueLabels = revenueResult.map(r => r.month);
    const revenueValues = revenueResult.map(r => r.total);

    // --------------------------
    // 2️⃣ Services breakdown
    // --------------------------
    const servicesQuery = `
      SELECT service_type, COUNT(*) AS count
      FROM appointments
      GROUP BY service_type
      ORDER BY count DESC
    `;
    const servicesResult = await client.execute(servicesQuery);
    const servicesLabels = servicesResult.map(r => r.service_type);
    const servicesValues = servicesResult.map(r => r.count);

    // Assign colors dynamically (reuse palette or generate)
    const palette = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#F43F5E'];
    const servicesColors = servicesValues.map((_, i) => palette[i % palette.length]);

    // --------------------------
    // Send JSON response
    // --------------------------
    res.status(200).json({
      revenue: { labels: revenueLabels, values: revenueValues },
      services: { labels: servicesLabels, values: servicesValues, colors: servicesColors }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
}
