// -----------------------
// Charts.js - Dashboard Charts
// -----------------------
async function initCharts() {
  try {
    const res = await fetch('/api/dashboard');
    const data = await res.json();

    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    const serviceCtx = document.getElementById('serviceChart')?.getContext('2d');

    // Revenue Trend Line Chart
    if (revenueCtx && data.revenue) {
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: data.revenue.labels,       // Jan, Feb, ...
          datasets: [{
            label: 'Revenue',
            data: data.revenue.values,       // Monthly revenue values
            borderColor: '#6366F1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: v => `$${v.toLocaleString()}` }
            }
          }
        }
      });
    }

    // Service Breakdown Doughnut Chart
    if (serviceCtx && Array.isArray(data.appointments)) {
      // Aggregate services from appointments.notes
      const serviceCounts = {};
      data.appointments.forEach(app => {
        const service = app.notes?.trim() || 'Other';
        serviceCounts[service] = (serviceCounts[service] || 0) + 1;
      });

      const labels = Object.keys(serviceCounts);
      const values = Object.values(serviceCounts);
      const colors = labels.map((_, i) => ['#60A5FA','#34D399','#FBBF24','#F87171','#A78BFA','#F472B6'][i % 6]);

      new Chart(serviceCtx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data: values, backgroundColor: colors }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'right' } }
        }
      });
    }

  } catch (err) {
    console.error('Charts error:', err);
  }
}

// -----------------------
// Initialize charts on DOM ready
// -----------------------
document.addEventListener('DOMContentLoaded', initCharts);
