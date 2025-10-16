// -----------------------
// Core.js - Full Dashboard Logic
// -----------------------

// -----------------------
// Icons
// -----------------------
function initIcons() {
  if (window.feather) feather.replace();
}

// -----------------------
// Hero Slideshow Background
// -----------------------
function initSlideshow() {
  const slides = Array.from(document.querySelectorAll('#slideshow .slide'));
  if (!slides.length) return;

  let idx = 0;
  slides.forEach((s, i) => (s.style.opacity = i === 0 ? '1' : '0'));

  setInterval(() => {
    idx = (idx + 1) % slides.length;
    slides.forEach((s, j) => (s.style.opacity = j === idx ? '1' : '0'));
  }, 5000);
}

// -----------------------
// Dropdowns / Navigation
// -----------------------
function initNavActions() {
  const toggles = document.querySelectorAll('[data-dropdown-target]');
  toggles.forEach(btn => {
    const menu = document.getElementById(btn.dataset.dropdownTarget);
    if (!menu) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const visible = menu.style.display === 'block';
      document.querySelectorAll('.dropdown-hidden').forEach(d => (d.style.display = 'none'));
      menu.style.display = visible ? 'none' : 'block';
    });
  });

  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', e => {
      e.stopPropagation();
      profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });
  }

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-hidden').forEach(d => (d.style.display = 'none'));
  });
}

// -----------------------
// Dashboard Cards
// -----------------------
async function initDashboardCards() {
  try {
    const res = await fetch('/api/dashboard');
    const data = await res.json();
    if (!data) return;

    const cards = document.querySelectorAll('.card');
    if (!cards.length) return;

    const totalPatients = cards[0]?.querySelector('.font-semibold');
    const appointmentsToday = cards[1]?.querySelector('.font-semibold');
    const revenueYTD = cards[2]?.querySelector('.font-semibold');
    const lowStockItems = cards[3]?.querySelector('.font-semibold');

    if (totalPatients) totalPatients.textContent = (data.totalPatients ?? 0).toLocaleString();
    if (appointmentsToday) appointmentsToday.textContent = (data.appointmentsToday ?? 0).toLocaleString();
    if (revenueYTD) revenueYTD.textContent = `$${(data.revenueYTD ?? 0).toLocaleString()}`;
    if (lowStockItems) lowStockItems.textContent = (data.lowStockItems ?? 0).toLocaleString();
  } catch (err) {
    console.error('Dashboard cards error:', err);
  }
}

// -----------------------
// Patients
// -----------------------
async function initPatients() {
  const ul = document.getElementById('patientList');
  if (!ul) return;

  async function fetchPatients() {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('PATIENTS API ERROR:', err);
      return [];
    }
  }

  function render(patients) {
    ul.innerHTML = '';
    patients.forEach(p => {
      const name = `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown';
      const initials = name.split(' ').map(s => s[0] || '').slice(0, 2).join('');
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between';
      li.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-semibold">${initials}</div>
          <div>
            <div class="font-medium">${name}</div>
            <div class="text-xs text-gray-500">${p.notes || ''} — ${p.created_at || ''}</div>
          </div>
        </div>
        <div class="text-sm ${
          p.status === 'Paid' ? 'text-green-600' : p.status === 'Overdue' ? 'text-rose-600' : 'text-amber-600'
        }">${p.status || '—'}</div>`;
      ul.appendChild(li);
    });
  }

  const patients = await fetchPatients();
  render(patients);

  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('patientSearch');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const q = searchInput.value.toLowerCase();
      render(patients.filter(p => {
        const name = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase();
        const note = (p.notes || '').toLowerCase();
        return name.includes(q) || note.includes(q);
      }));
    });
  }
}

// -----------------------
// Payroll
// -----------------------
async function initPayroll() {
  const listEl = document.getElementById('payrollList');
  const totalEl = document.getElementById('payrollTotal');
  if (!listEl || !totalEl) return;

  async function fetchPayroll() {
    try {
      const res = await fetch('/api/payroll');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('PAYROLL API ERROR:', err);
      return [];
    }
  }

  function render(employees) {
    listEl.innerHTML = '';
    let total = 0;

    employees.forEach(emp => {
      const baseSalary = Number(emp.base_salary ?? 0);
      const net = +(baseSalary * 0.88).toFixed(2);
      total += baseSalary;

      const div = document.createElement('div');
      div.className = 'py-3 flex items-center justify-between';
      div.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-md bg-indigo-50"><i data-feather="user" class="text-indigo-600"></i></div>
          <div>
            <div class="font-medium">${emp.name || 'Unknown'}</div>
            <div class="text-xs text-gray-500">${emp.role || '—'}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm">$${baseSalary.toLocaleString()}</div>
          <div class="text-xs text-gray-500">Net $${net.toLocaleString()}</div>
        </div>`;
      listEl.appendChild(div);
    });

    totalEl.textContent = `$${total.toLocaleString()}`;
    if (window.feather) feather.replace();
  }

  const employees = await fetchPayroll();
  render(employees);

  document.getElementById('runPayroll')?.addEventListener('click', () => alert('Payroll demo'));
  document.getElementById('exportPayroll')?.addEventListener('click', () => alert('Export demo'));
}

// -----------------------
// Charts
// -----------------------
async function initCharts() {
  try {
    const res = await fetch('/api/charts');
    const data = await res.json();
    if (!data) return;

    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    const serviceCtx = document.getElementById('serviceChart')?.getContext('2d');

    if (revenueCtx && data.revenue) {
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: data.revenue.labels || [],
          datasets: [{
            label: 'Revenue',
            data: data.revenue.values || [],
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
          scales: { y: { beginAtZero: true, ticks: { callback: v => `$${v.toLocaleString()}` } } }
        }
      });
    }

    if (serviceCtx && data.services) {
      new Chart(serviceCtx, {
        type: 'doughnut',
        data: {
          labels: data.services.labels || [],
          datasets: [{ data: data.services.values || [], backgroundColor: data.services.colors || [] }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
      });
    }
  } catch (err) {
    console.error('Charts error:', err);
  }
}

// -----------------------
// Currency Converter
// -----------------------
async function initConverter() {
  const fromInput = document.getElementById('fromCurr');
  const toInput = document.getElementById('toCurr');
  const amountInput = document.getElementById('convAmount');
  const convertedEl = document.getElementById('convertedValue');
  const fromCode = document.getElementById('fromCode');
  const rateIndicator = document.getElementById('rateIndicator');
  const ratesErrorEl = document.getElementById('ratesError');
  if (!fromInput || !toInput || !amountInput || !convertedEl) return;

  let rates = {};

  async function fetchRates() {
    try {
      const res = await fetch('/api/rates');
      rates = await res.json();
      populateSelects(Object.keys(rates));
      rateIndicator.textContent = 'Rates: Live';
      ratesErrorEl.textContent = '';
      updateConversion();
    } catch (err) {
      console.error(err);
      rates = { USD: 1, ZMW: 24.5, EUR: 0.92, GBP: 0.78, ZAR: 18.2 };
      populateSelects(Object.keys(rates));
      rateIndicator.textContent = 'Rates: Sample';
      ratesErrorEl.textContent = 'Offline demo';
      updateConversion();
    }
  }

  function populateSelects(list) {
    if (fromInput.options.length) return;
    const preferred = ['USD','EUR','GBP','ZMW','ZAR'];
    const ordered = [...new Set([...preferred, ...list])];
    ordered.forEach(c => {
      const o1 = document.createElement('option'); o1.value = o1.text = c; fromInput.appendChild(o1);
      const o2 = document.createElement('option'); o2.value = o2.text = c; toInput.appendChild(o2);
    });
    fromInput.value = 'USD';
    toInput.value = 'ZMW';
    fromCode.textContent = 'USD';
  }

  function updateConversion() {
    const amt = Number(amountInput.value) || 0;
    const from = fromInput.value;
    const to = toInput.value;
    fromCode.textContent = from;
    const converted = rates && rates[from] && rates[to] ? (amt / rates[from]) * rates[to] : 0;
    convertedEl.textContent = `${converted.toFixed(2)} ${to}`;
  }

  amountInput.addEventListener('input', updateConversion);
  fromInput.addEventListener('change', updateConversion);
  toInput.addEventListener('change', updateConversion);
  document.getElementById('refreshRates')?.addEventListener('click', fetchRates);
  document.getElementById('applyToPayroll')?.addEventListener('click', () => {
    const c = convertedEl.textContent;
    if (!c || c === '—') return alert('No value');
    alert(`Applied ${c} to payroll demo`);
  });

  fetchRates();
}

// -----------------------
// Initialize everything
// -----------------------
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initSlideshow();
  initNavActions();
  initDashboardCards();
  initPatients();
  initPayroll();
  initCharts();
  initConverter();
});
