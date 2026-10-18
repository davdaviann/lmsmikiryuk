/* Hash router and navigation */

function go(route) {
  const target = route.startsWith("#") ? route : `#${route}`;

  if (window.location.hash === target) {
    renderRoute();
  } else {
    window.location.hash = target;
  }
}

function renderRoute() {
  const rawRoute = window.location.hash.replace(/^#/, "") || "beranda";
  const route = rawRoute.split("?")[0];
  const app = document.getElementById("main-content");
  const account = currentAccount();

  let page = "";
  let title = "Belajar lebih mudah";

  switch (route) {
    case "beranda":
      page = landingPage();
      title = "Beranda";
      break;

    case "cari-tutor":
      page = findTutorPage();
      title = "Cari tutor";
      break;

    case "daftar-siswa":
      page = registerPage("student");
      title = "Daftar siswa";
      break;

    case "daftar-tutor":
      page = registerPage("tutor");
      title = "Daftar tutor";
      break;

    case "lowongan":
      page = lowonganPage();
      title = "Lowongan tutor";
      break;

    case "dashboard-siswa":
      page = state.currentRole === "student" && account
        ? studentDashboard()
        : authGate("student");
      title = "Dashboard siswa";
      break;

    case "dashboard-tutor":
      page = state.currentRole === "tutor" && account
        ? tutorDashboard()
        : authGate("tutor");
      title = "Dashboard tutor";
      break;

    case "dashboard-admin":
      page = state.currentRole === "admin" && account
        ? adminDashboard()
        : authGate("admin");
      title = "Pengaturan platform";
      break;

    case "masuk":
      openLoginModal("student");
      go("beranda");
      return;

    default:
      page = landingPage();
      title = "Beranda";
  }

  app.innerHTML = page;
  document.title = `${title} — MikirYuk`;
  renderHeader();

  if (route === "cari-tutor") {
    setupTutorFilters();
  }

  if (route === "daftar-tutor") {
    setupTutorRateValidation();
  }

  window.scrollTo(0, 0);
}
