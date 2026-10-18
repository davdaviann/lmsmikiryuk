/* Shared UI helpers: toast, header/nav, modal shell */

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = `toast visible ${type}`;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = "toast";
  }, 3500);
}

function closeMobileMenu() {
  const nav = document.getElementById("nav-links");
  const toggle = document.getElementById("menu-toggle");

  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Buka menu");
}

function renderHeader() {
  const account = currentAccount();
  const role = state.currentRole;
  const nav = document.getElementById("nav-links");
  const actions = document.getElementById("header-actions");

  let links = "";

  if (role === "student") {
    links = `
      <a href="#dashboard-siswa">Dashboard</a>
      <a href="#cari-tutor">Cari tutor</a>
      <a href="#lowongan">Lowongan tutor</a>
      <button class="mobile-only mobile-auth" type="button" data-action="account">Akun saya</button>
      <button class="mobile-only mobile-auth" type="button" data-action="logout">Keluar</button>
    `;
  } else if (role === "tutor") {
    links = `
      <a href="#dashboard-tutor">Dashboard tutor</a>
      <a href="#lowongan">Lowongan</a>
      <a href="#cari-tutor">Cari tutor</a>
      <button class="mobile-only mobile-auth" type="button" data-action="account">Akun saya</button>
      <button class="mobile-only mobile-auth" type="button" data-action="logout">Keluar</button>
    `;
  } else if (role === "admin") {
    links = `
      <a href="#dashboard-admin">Pengaturan platform</a>
      <a href="#cari-tutor">Lihat tutor</a>
      <button class="mobile-only mobile-auth" type="button" data-action="account">Akun admin</button>
      <button class="mobile-only mobile-auth" type="button" data-action="logout">Keluar</button>
    `;
  } else {
    links = `
      <a href="#beranda">Beranda</a>
      <a href="#cari-tutor">Cari tutor</a>
      <a href="#lowongan">Lowongan tutor</a>
      <a href="#daftar-tutor">Jadi tutor</a>
      <button class="mobile-only mobile-auth" type="button" data-action="login">Masuk</button>
      <a class="mobile-only mobile-register" href="#daftar-siswa">Daftar sebagai siswa</a>
    `;
  }

  nav.innerHTML = links;

  if (account) {
    actions.innerHTML = `
      <button class="btn btn-outline btn-sm" type="button" data-action="account">
        ${role === "student" ? "Ruang saya" : role === "admin" ? "Panel admin" : "Panel tutor"}
      </button>
      <button class="btn btn-dark btn-sm" type="button" data-action="logout">
        Keluar
      </button>
    `;
  } else {
    actions.innerHTML = `
      <button class="btn btn-ghost btn-sm" type="button" data-action="login">
        Masuk
      </button>
      <a class="btn btn-primary btn-sm" href="#daftar-siswa">
        Daftar
      </a>
    `;
  }

  closeMobileMenu();
}

function openModal(content, size = "") {
  const modalRoot = document.getElementById("modal-root");

  modalRoot.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal ${size}">
        ${content}
      </div>
    </div>
  `;

  document.body.classList.add("modal-open");
}

function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
  document.body.classList.remove("modal-open");
}

function showFormError(form, message) {
  const error = form.querySelector("[data-form-error]");

  if (error) {
    error.textContent = message;
  }
}
