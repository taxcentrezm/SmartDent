// public/js/charts.js
async function initCharts() {
  const res = await fetch('/api/dashboard');
  const data = await res.json();

  const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
  const serviceCtx = document.getElementById('serviceChart')?.getContext('2d');

  if (revenueCtx && data.revenue) {
    new Chart(revenueCtx, {
      type: 'line',
      data: { labels: data.revenue.labels, datasets: [{ label:'Revenue', data: data.revenue.values, borderColor:'#6366F1', backgroundColor:'rgba(99,102,241,0.1)', fill:true }] },
      options: { responsive:true, maintainAspectRatio:false }
    });
  }

  if (serviceCtx && data.services) {
    new Chart(serviceCtx, {
      type: 'doughnut',
      data: { labels:data.services.labels, datasets:[{ data:data.services.values, backgroundColor:data.services.colors }] },
      options: { responsive:true, maintainAspectRatio:false }
    });
  }
}

document.addEventListener('DOMContentLoaded', initCharts);
