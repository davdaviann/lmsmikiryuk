/* Event listeners and app start-up */

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");

  if (!target) {
    return;
  }

  const action = target.dataset.action;

  if (action === "close-modal") {
    // The backdrop carries this action too. Ignore clicks that started inside
    // the modal itself (inputs, labels, submit buttons) so forms keep working.
    if (target.classList.contains("modal-backdrop") && event.target !== target) {
      return;
    }

    closeModal();
    return;
  }

  if (action === "mobile-toggle") {
    const nav = document.getElementById("nav-links");
    const toggle = document.getElementById("menu-toggle");
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Buka menu" : "Tutup menu");
    nav.classList.toggle("open", !isOpen);
    return;
  }

  if (action === "login") {
    openLoginModal(target.dataset.role || "student");
    return;
  }

  if (action === "account") {
    openAccountModal();
    return;
  }

  if (action === "logout") {
    state.currentRole = null;
    state.apiToken = null;
    saveState();
    closeModal();
    go("beranda");
    showToast("Kamu telah keluar dari akun.");
    return;
  }

  if (action === "demo-login") {
    useDemoAccount(target.dataset.role || "student");
    return;
  }

  if (action === "favorite") {
    const tutorId = target.dataset.tutorId;
    const index = state.favorites.indexOf(tutorId);

    if (index >= 0) {
      state.favorites.splice(index, 1);
      showToast("Tutor dihapus dari favorit.");
    } else {
      state.favorites.push(tutorId);
      showToast("Tutor disimpan ke favorit.");
    }

    saveState();
    renderTutorResults();
    return;
  }

  if (action === "view-tutor") {
    openTutorModal(target.dataset.tutorId);
    return;
  }

  if (action === "book") {
    openBookingModal(target.dataset.tutorId);
    return;
  }

  if (action === "start-session") {
    startSession(target.dataset.sessionId);
    return;
  }

  if (action === "end-session") {
    openEndSessionModal(target.dataset.sessionId);
    return;
  }

  if (action === "session-details") {
    openSessionDetailsModal(target.dataset.sessionId);
    return;
  }

  if (action === "review-session") {
    openReviewModal(target.dataset.sessionId);
    return;
  }

  if (action === "download-document") {
    downloadSessionDocument(target.dataset.sessionId, target.dataset.documentId);
    return;
  }

  if (action === "reset-filters") {
    resetTutorFilters();
    return;
  }

  if (action === "apply-job") {
    applyJob(target.dataset.jobId);
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();

  if (event.target.id === "register-form") {
    handleRegistration(event.target);
  }

  if (event.target.id === "login-form") {
    handleLogin(event.target);
  }

  if (event.target.id === "booking-form") {
    handleBooking(event.target);
  }

  if (event.target.id === "platform-settings-form") {
    handlePlatformSettings(event.target);
  }

  if (event.target.id === "session-complete-form") {
    completeSession(event.target.dataset.sessionId);
  }

  if (event.target.id === "session-review-form") {
    submitSessionReview(event.target);
  }

  if (event.target.id === "session-documents-form") {
    handleSessionDocumentation(event.target);
  }
});

document.getElementById("nav-links").addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMobileMenu();
  }
});

window.addEventListener("hashchange", renderRoute);

window.addEventListener(
  "scroll",
  () => {
    document.getElementById("site-header").classList.toggle(
      "scrolled",
      window.scrollY > 12
    );
  },
  { passive: true }
);

document.getElementById("current-year").textContent = new Date().getFullYear();

async function initializeApp() {
  if (state.apiToken) {
    try {
      await refreshApiState();
    } catch {
      state.apiToken = null;
      state.currentRole = null;
      saveState();
    }
  }
  renderRoute();
}

initializeApp();
