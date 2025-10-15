// core.js (no exports, top-level functions)

// -----------------------
// Icons
// -----------------------
function initIcons() {
  feather.replace();
}

// -----------------------
// Slideshow
// -----------------------
function initSlideshow() {
  const slides = Array.from(document.querySelectorAll('#slideshow .slide'));
  if (!slides.length) return;
  let idx = 0;
  slides.forEach((s, i) => s.style.opacity = i === 0 ? '1' : '0');
  setInterval(() => {
    idx = (idx + 1) % slides.length;
    slides.forEach((s, j) => s.style.opacity = j === idx ? '1' : '0');
  }, 5000);
}

// -----------------------
// Dropdowns / Navigation
// -----------------------
function initNavActions() {
  const toggles = document.querySelectorAll('[data-dropdown-target]');
  toggles.forEach(btn => {
    const menu = document.getElementById(btn.getAttribute('data-dropdown-target'));
    if (!menu) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const visible = menu.style.display === 'block';
      document.querySelectorAll('.dropdown-hidden').forEach(d => d.style.display = 'none');
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
    document.querySelectorAll('.dropdown-hidden').forEach(d => d.style.display = 'none');
  });
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
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  function render(patients) {
    ul.innerHTML = '';
    patients.forEach(p => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between';
      const initials = p.name.split(' ').map(s => s[0]).slice(0, 2).join('');
      li.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-semibold">${initials}</div>
          <div>
            <div class="font-medium">${p.name}</div>
            <div class="text-xs text-gray-500">${p.note} — ${p.date}</div>
          </div>
        </div>
        <div class="text-sm ${p.status==='Paid'?'text-green-600':p.status==='Overdue'?'text-rose-600':'text-amber-600'}">${p.status}</div>`;
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
      render(patients.filter(p => p.name.toLowerCase().includes(q) || p.note.toLowerCase().includes(q)));
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
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  function render(employees) {
    listEl.innerHTML = '';
    let total = 0;
    employees.forEach(emp => {
      const net = +(emp.baseSalary * 0.88).toFixed(2);
      total += emp.baseSalary;
      const div = document.createElement('div');
      div.className = 'py-3 flex items-center justify-between';
      div.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-md bg-indigo-50"><i data-feather="user" class="text-indigo-600"></i></div>
          <div>
            <div class="font-medium">${emp.name}</div>
            <div class="text-xs text-gray-500">${emp.role}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm">$${emp.baseSalary.toLocaleString()}</div>
          <div class="text-xs text-gray-500">Net $${net.toLocaleString()}</div>
        </div>`;
      listEl.appendChild(div);
    });
    totalEl.textContent = `$${total.toLocaleString()}`;
    feather.replace();
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

    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    const serviceCtx = document.getElementById('serviceChart')?.getContext('2d');

    if (revenueCtx && data.revenue) {
      new Chart(revenueCtx, {
        type: 'line',
        data: { labels: data.revenue.labels, datasets: [{ label:'Revenue', data:data.revenue.values, borderColor:'#6366F1', tension:0.4, fill:false }] },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } } }
      });
    }

    if (serviceCtx && data.services) {
      new Chart(serviceCtx, {
        type: 'doughnut',
        data: { labels: data.services.labels, datasets:[{ data:data.services.values, backgroundColor:data.services.colors }] },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right' } } }
      });
    }
  } catch (err) { console.error(err); }
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
      const data = await res.json();
      rates = data;
      populateSelects(Object.keys(rates));
      rateIndicator.textContent = 'Rates: Live';
      ratesErrorEl.textContent = '';
      updateConversion();
    } catch (err) {
      console.error(err);
      rates = { USD:1,ZMW:24.5,EUR:0.92,GBP:0.78,ZAR:18.2 };
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
    fromInput.value='USD'; toInput.value='ZMW'; fromCode.textContent='USD';
  }

  function updateConversion() {
    const amt = Number(amountInput.value) || 0;
    const from = fromInput.value;
    const to = toInput.value;
    fromCode.textContent = from;
    if (!rates) { convertedEl.textContent='—'; return; }
    const converted = (amt / rates[from]) * rates[to];
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
// Init all on DOM ready
// -----------------------
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initSlideshow();
  initNavActions();
  initPatients();
  initPayroll();
  initCharts();
  initConverter();
});
