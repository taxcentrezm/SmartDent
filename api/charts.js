// api/charts.js
import { client } from './_libsql.js';

export default async function handler(req, res) {
  try {
    // Example: Revenue over last 6 months
    const revenueLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const revenueValues = [12000, 15000, 14000, 18000, 20000, 22000];

    // Example: Services distribution
    const servicesLabels = ['Consulting', 'Surgery', 'Lab Tests', 'Pharmacy'];
    const servicesValues = [40, 25, 20, 15];
    const servicesColors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

    res.status(200).json({
      revenue: {
        labels: revenueLabels,
        values: revenueValues
      },
      services: {
        labels: servicesLabels,
        values: servicesValues,
        colors: servicesColors
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
}
