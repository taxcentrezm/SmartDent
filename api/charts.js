async function initCharts() {
  try {
    const res = await fetch('/api/dashboard');
    const data = await res.json();

    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    const serviceCtx = document.getElementById('serviceChart')?.getContext('2d');

    // Revenue Trend Line
    if (revenueCtx && data.revenue) {
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: data.revenue.labels,
          datasets: [{
            label: 'Revenue',
            data: data.revenue.values,
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
            y: { beginAtZero: true, ticks: { callback: v => `$${v.toLocaleString()}` } }
          }
        }
      });
    }

    // Service Breakdown Doughnut
    if (serviceCtx && data.services) {
      new Chart(serviceCtx, {
        type: 'doughnut',
        data: {
          labels: data.services.labels,
          datasets: [{
            data: data.services.values,
            backgroundColor: data.services.colors
          }]
        },
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

document.addEventListener('DOMContentLoaded', initCharts);
