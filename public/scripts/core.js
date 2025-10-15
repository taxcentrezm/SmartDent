// scripts/core.js

// ---------- 1. Slideshow ----------
export function initSlideshow() {
  const images = ["image (1).jpg", "image (2).jpg", "image (3).jpg", "image (4).jpg"];
  const container = document.getElementById("slideshow");
  images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = `slide absolute inset-0 w-full h-full object-cover ${i === 0 ? "opacity-100" : "opacity-0"}`;
    container.appendChild(img);
  });
  let idx = 0;
  setInterval(() => {
    const slides = document.querySelectorAll("#slideshow .slide");
    slides.forEach((s, j) => s.style.opacity = j === idx ? "1" : "0");
    idx = (idx + 1) % slides.length;
  }, 5000);
}

// ---------- 2. Navbar / Quick Actions ----------
export function initNavActions() {
  document.getElementById("quickAdd").addEventListener("click", () => {
    alert("Quick Add modal (connect to /patients/new or /appointments/new)");
  });
}

// ---------- 3. Charts ----------
export function initCharts() {
  const ctx = document.createElement("canvas");
  document.getElementById("dashboard").appendChild(ctx);
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr"],
      datasets: [{ label: "Revenue", data: [12000, 18000, 16000, 21000], borderColor: "#4f46e5" }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

// ---------- 4. Payroll ----------
export async function initPayroll() {
  const employees = await fetch("/api/employees").then(r => r.json()).catch(() => []);
  console.log("Loaded employees:", employees);
  // Render payroll UI here
}

// ---------- 5. Patients ----------
export async function initPatients() {
  const patients = await fetch("/api/patients").then(r => r.json()).catch(() => []);
  console.log("Loaded patients:", patients);
  // Render recent patients list
}

// ---------- 6. Currency Converter ----------
export function initConverter() {
  console.log("Currency converter ready (attach to payroll totals later).");
}
