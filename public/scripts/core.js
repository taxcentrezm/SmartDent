(function() {
  /* =========================
     Slideshow
  ========================= */
  function initSlideshow() {
    const images = ["image (1).jpg","image (2).jpg","image (3).jpg","image (4).jpg"];
    const container = document.getElementById("slideshow");
    if (!container) return;
    container.innerHTML = ""; // clear existing slides
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

  /* =========================
     Navbar / Quick Actions
  ========================= */
  function initNavActions() {
    const quickAddBtn = document.getElementById("quickAdd");
    if(quickAddBtn) {
      quickAddBtn.addEventListener("click", () => {
        alert("Quick Add modal placeholder (connect to DB for live actions)");
      });
    }
  }

  /* =========================
     Charts
  ========================= */
  function initCharts() {
    const dashboard = document.getElementById("dashboard");
    if(!dashboard) return;

    const chartCard = document.createElement("div");
    chartCard.className = "card my-4";
    const canvas = document.createElement("canvas");
    chartCard.appendChild(canvas);
    dashboard.appendChild(chartCard);

    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun"],
        datasets: [{
          label: "Revenue",
          data: [12000, 15000, 14000, 18000, 17000, 20000],
          borderColor: "#4f46e5",
          borderWidth: 3,
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } }
      }
    });
  }

  /* =========================
     Payroll
  ========================= */
  function initPayroll() {
    console.log("Payroll init placeholder — connect to DB for live employees");
  }

  /* =========================
     Patients
  ========================= */
  function initPatients() {
    console.log("Patients init placeholder — connect to DB for live patients");
  }

  /* =========================
     Currency Converter
  ========================= */
  function initConverter() {
    console.log("Currency converter init placeholder — live rates / apply to payroll");
  }

  /* =========================
     Expose all functions to global scope
  ========================= */
  window.initSlideshow = initSlideshow;
  window.initNavActions = initNavActions;
  window.initCharts = initCharts;
  window.initPayroll = initPayroll;
  window.initPatients = initPatients;
  window.initConverter = initConverter;
})();
