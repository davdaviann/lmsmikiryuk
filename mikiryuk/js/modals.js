/* Login, account, tutor profile and booking modals */

function openLoginModal(defaultRole = "student") {
  const selectedRole = defaultRole || "student";

  openModal(`
    <div class="modal-header">
      <div>
        <span class="eyebrow">
          <span class="eyebrow-dot"></span>
          Selamat datang kembali
        </span>
        <h2>Masuk ke MikirYuk</h2>
        <p>Pilih jenis akun yang ingin digunakan.</p>
      </div>

      <button
        class="modal-close"
        type="button"
        aria-label="Tutup"
        data-action="close-modal"
      >
        ×
      </button>
    </div>

    <form id="login-form" class="modal-form">
      <div class="form-group">
        <label class="form-label" for="login-role">Jenis akun</label>
        <select
          class="form-control"
          id="login-role"
          name="role"
          required
        >
          <option value="student" ${selectedRole === "student" ? "selected" : ""}>
            Saya siswa
          </option>
          <option value="tutor" ${selectedRole === "tutor" ? "selected" : ""}>
            Saya tutor
          </option>
          <option value="admin" ${selectedRole === "admin" ? "selected" : ""}>
            Administrator demo
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="login-email">Email terdaftar</label>
        <input
          class="form-control"
          id="login-email"
          name="email"
          type="email"
          required
          placeholder="nama@email.com"
        >
      </div>

      <div class="form-group">
        <label class="form-label" for="login-password">Password</label>
        <input
          class="form-control"
          id="login-password"
          name="password"
          type="password"
          required
          placeholder="Masukkan password"
        >
      </div>

      <div class="form-error" data-form-error></div>

      <button class="btn btn-primary" type="submit" style="width: 100%;">
        Masuk sekarang <span aria-hidden="true">→</span>
      </button>

      <p class="auth-switch">
        Belum punya akun?
        <a href="#daftar-siswa" data-action="close-modal">Daftar sebagai siswa</a>
        atau
        <a href="#daftar-tutor" data-action="close-modal">daftar sebagai tutor</a>.
      </p>
    </form>

    <div class="demo-box">
      <p>Atau coba akun demo tanpa mengisi formulir:</p>
      <div class="demo-buttons">
        <button
          class="btn btn-outline btn-sm demo-button"
          type="button"
          data-action="demo-login"
          data-role="student"
        >
          Demo siswa
        </button>
        <button
          class="btn btn-outline btn-sm demo-button"
          type="button"
          data-action="demo-login"
          data-role="tutor"
        >
          Demo tutor
        </button>
        <button
          class="btn btn-outline btn-sm demo-button"
          type="button"
          data-action="demo-login"
          data-role="admin"
        >
          Demo admin
        </button>
      </div>
    </div>
  `);
}

function openAccountModal() {
  const account = currentAccount();

  if (!account) {
    openLoginModal();
    return;
  }

  const isStudent = state.currentRole === "student";
  const isAdmin = state.currentRole === "admin";

  openModal(`
    <div class="modal-header">
      <div>
        <span class="eyebrow">
          <span class="eyebrow-dot"></span>
          Akun ${isStudent ? "siswa" : isAdmin ? "administrator" : "tutor"}
        </span>
        <h2>${escapeHtml(account.name)}</h2>
        <p>${escapeHtml(account.email)}</p>
      </div>

      <button
        class="modal-close"
        type="button"
        aria-label="Tutup"
        data-action="close-modal"
      >
        ×
      </button>
    </div>

    <div class="account-summary">
      <div class="account-row">
        <span>Jenis akun</span>
        <strong>${isStudent ? "Siswa" : isAdmin ? "Administrator" : "Tutor"}</strong>
      </div>

      <div class="account-row">
        <span>${isStudent ? "Jenjang" : isAdmin ? "Akses" : "Mata pelajaran"}</span>
        <strong>
          ${escapeHtml(isStudent ? account.level : isAdmin ? "Pengaturan platform" : account.subject)}
        </strong>
      </div>

      ${
        isStudent || isAdmin
          ? `
            <div class="account-row">
              <span>Email</span>
              <strong>${escapeHtml(account.email)}</strong>
            </div>
          `
          : `
            <div class="account-row">
              <span>Tarif per sesi</span>
              <strong>${formatMoney(Number(account.rate) || 0)}</strong>
            </div>
          `
      }
    </div>

    <div class="form-actions">
      ${isAdmin ? `
        <a class="btn btn-primary" href="#dashboard-admin" data-action="close-modal">Pengaturan platform</a>
      ` : `
        <a class="btn btn-primary" href="#${isStudent ? "daftar-siswa" : "daftar-tutor"}" data-action="close-modal">Edit profil</a>
      `}
      <button
        class="btn btn-outline"
        type="button"
        data-action="logout"
      >
        Keluar
      </button>
    </div>
  `, "narrow");
}

function openTutorModal(tutorId) {
  const tutor = TUTORS.find((item) => item.id === tutorId);

  if (!tutor) {
    return;
  }

  const reviews = state.bookings
    .filter((booking) => booking.tutorId === tutor.id && booking.review)
    .slice(0, 5);

  openModal(`
    <div class="modal-header">
      <div>
        <span class="eyebrow">
          <span class="eyebrow-dot"></span>
          Profil tutor
        </span>
      </div>

      <button
        class="modal-close"
        type="button"
        aria-label="Tutup"
        data-action="close-modal"
      >
        ×
      </button>
    </div>

    <div class="modal-tutor-head">
      <div class="modal-tutor-avatar avatar-${tutor.color}">
        ${escapeHtml(tutor.initials)}
      </div>
      <div>
        <h2>${escapeHtml(tutor.name)}</h2>
        <p>${escapeHtml(tutor.subject)} · ★ ${tutor.rating}</p>
      </div>
    </div>

    <p style="color: var(--muted); font-size: 0.8rem;">
      ${escapeHtml(tutor.bio)}
    </p>

    <div class="modal-info-grid">
      <div class="modal-info">
        <span class="modal-label">Jenjang</span>
        <strong class="modal-value">${escapeHtml(tutor.levels)}</strong>
      </div>
      <div class="modal-info">
        <span class="modal-label">Mode</span>
        <strong class="modal-value">${escapeHtml(tutor.modes.join(" / "))}</strong>
      </div>
      <div class="modal-info">
        <span class="modal-label">Tarif</span>
        <strong class="modal-value">${formatMoney(tutor.rate)} / sesi</strong>
      </div>
      <div class="modal-info">
        <span class="modal-label">Lokasi</span>
        <strong class="modal-value">${escapeHtml(tutor.city)}</strong>
      </div>
    </div>

    <div class="booking-price">
      <span>Estimasi biaya sesi</span>
      <strong>${formatMoney(tutor.rate)}</strong>
    </div>

    ${feeBreakdownMarkup(tutor.rate)}

    <section class="profile-reviews">
      <h3>Ulasan siswa</h3>
      ${reviews.length
        ? reviews.map((booking) => `
            <article class="review-entry">
              <strong>${"★".repeat(booking.review.rating)}${"☆".repeat(5 - booking.review.rating)}</strong>
              <p>${escapeHtml(booking.review.comment || "Tanpa komentar.")}</p>
              <small>${escapeHtml(booking.studentName || "Siswa")}</small>
            </article>
          `).join("")
        : `<p class="form-help">Belum ada ulasan sesi.</p>`}
    </section>

    <button
      class="btn btn-primary"
      type="button"
      style="width: 100%;"
      data-action="book"
      data-tutor-id="${tutor.id}"
    >
      Pesan sesi dengan ${escapeHtml(tutor.name)} →
    </button>
  `, "wide");
}

function openBookingModal(tutorId) {
  const tutor = TUTORS.find((item) => item.id === tutorId);

  if (!tutor) {
    return;
  }

  if (!state.accounts.student) {
    showToast("Daftar sebagai siswa untuk memesan sesi.", "error");
    go("daftar-siswa");
    return;
  }

  if (state.currentRole !== "student") {
    showToast("Masuk sebagai siswa untuk memesan sesi.");
    openLoginModal("student");
    return;
  }

  openModal(`
    <div class="modal-header">
      <div>
        <span class="eyebrow">
          <span class="eyebrow-dot"></span>
          Pemesanan sesi
        </span>
        <h2>Jadwalkan dengan ${escapeHtml(tutor.name)}</h2>
        <p>${escapeHtml(tutor.subject)} · ${formatMoney(tutor.rate)} per sesi</p>
      </div>

      <button
        class="modal-close"
        type="button"
        aria-label="Tutup"
        data-action="close-modal"
      >
        ×
      </button>
    </div>

    <form id="booking-form" class="modal-form" data-tutor-id="${tutor.id}">
      ${feeBreakdownMarkup(tutor.rate)}
      <div class="form-group">
        <label class="form-label" for="booking-date">Tanggal</label>
        <input
          class="form-control"
          id="booking-date"
          name="date"
          type="date"
          required
          min="${dateOffset(0)}"
          value="${dateOffset(1)}"
        >
      </div>

      <div class="form-group">
        <label class="form-label" for="booking-time">Waktu</label>
        <select class="form-control" id="booking-time" name="time" required>
          <option value="10:00">10:00</option>
          <option value="13:30">13:30</option>
          <option value="16:00">16:00</option>
          <option value="19:00">19:00</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="booking-note">Catatan untuk tutor</label>
        <textarea
          class="form-control"
          id="booking-note"
          name="note"
          placeholder="Contoh: Saya ingin membahas soal integral"
        ></textarea>
      </div>

      <div class="form-error" data-form-error></div>

      <button class="btn btn-primary" type="submit" style="width: 100%;">
        Kirim permintaan sesi →
      </button>
    </form>
  `, "narrow");
}

function openEndSessionModal(sessionId) {
  const booking = state.bookings.find((item) => item.id === sessionId);

  if (!canAccessBooking(booking) || state.currentRole !== "tutor" || booking.status !== "Berlangsung") {
    showToast("Sesi ini tidak dapat diakhiri dari akunmu.", "error");
    return;
  }

  openModal(`
    <div class="modal-header">
      <div>
        <span class="eyebrow"><span class="eyebrow-dot"></span>Konfirmasi sesi</span>
        <h2>Apakah sesi tutoring ini sudah selesai?</h2>
        <p>${escapeHtml(booking.studentName)} · ${escapeHtml(booking.subject)}</p>
      </div>
      <button class="modal-close" type="button" aria-label="Tutup" data-action="close-modal">×</button>
    </div>
    <form id="session-complete-form" data-session-id="${escapeHtml(booking.id)}">
      <div class="form-error" data-form-error></div>
      <div class="form-actions">
        <button class="btn btn-primary" type="submit">Ya, selesaikan sesi</button>
        <button class="btn btn-outline" type="button" data-action="close-modal">Tidak, lanjutkan sesi</button>
      </div>
    </form>
  `, "narrow");
}

function openSessionDetailsModal(sessionId) {
  const booking = state.bookings.find((item) => item.id === sessionId);

  if (!canAccessBooking(booking)) {
    showToast("Kamu tidak memiliki akses ke sesi ini.", "error");
    return;
  }

  const tutor = TUTORS.find((item) => item.id === booking.tutorId);
  const amounts = sessionAmounts(booking);
  const documents = (booking.documents || []).map((file) => `
    <div class="document-entry">
      <div>
        <strong>${escapeHtml(file.name)}</strong>
        <small>${escapeHtml(file.type)} · ${Math.max(1, Math.round(file.size / 1024))} KB · ${escapeHtml(formatTimestamp(file.uploadedAt))}</small>
        <small>Diunggah oleh ${escapeHtml(file.uploadedBy)}</small>
      </div>
      <button class="btn btn-outline btn-sm" type="button" data-action="download-document" data-session-id="${escapeHtml(booking.id)}" data-document-id="${escapeHtml(file.id)}">Unduh</button>
    </div>
  `).join("");
  const reviewMarkup = booking.review
    ? `<div class="review-entry"><strong>${"★".repeat(booking.review.rating)}${"☆".repeat(5 - booking.review.rating)}</strong><p>${escapeHtml(booking.review.comment || "Tanpa komentar.")}</p><small>${escapeHtml(formatTimestamp(booking.review.submittedAt))}</small></div>`
    : state.currentRole === "student" && booking.status === "Selesai"
      ? `<button class="btn btn-primary btn-sm" type="button" data-action="review-session" data-session-id="${escapeHtml(booking.id)}">Beri ulasan</button>`
      : `<p class="form-help">Belum ada ulasan siswa.</p>`;

  openModal(`
    <div class="modal-header">
      <div>
        <span class="eyebrow"><span class="eyebrow-dot"></span>Laporan sesi</span>
        <h2>${escapeHtml(booking.subject || "Sesi tutoring")}</h2>
        <p>${escapeHtml(booking.status)}</p>
      </div>
      <button class="modal-close" type="button" aria-label="Tutup" data-action="close-modal">×</button>
    </div>

    <dl class="session-report">
      <div><dt>Tanggal dan waktu</dt><dd>${escapeHtml(formatDate(booking.date))} · ${escapeHtml(booking.time)}</dd></div>
      <div><dt>Tutor</dt><dd>${escapeHtml(tutor?.name || booking.tutorId)}</dd></div>
      <div><dt>Siswa</dt><dd>${escapeHtml(booking.studentName)}</dd></div>
      <div><dt>Durasi</dt><dd>${booking.durationMinutes ? `${booking.durationMinutes} menit` : "Belum tersedia"}</dd></div>
      <div><dt>Status</dt><dd>${escapeHtml(booking.status)}</dd></div>
      <div><dt>Selesai pada</dt><dd>${escapeHtml(formatTimestamp(booking.completedAt))}</dd></div>
    </dl>
    ${feeBreakdownMarkup(amounts.price, booking.platformFeePercent)}

    <section class="session-documents">
      <div class="panel-header"><h3 class="panel-title">Dokumentasi sesi</h3></div>
      ${documents || `<p class="form-help">Belum ada file dokumentasi.</p>`}
      ${booking.status === "Selesai" ? `
        <form id="session-documents-form" class="document-upload" data-session-id="${escapeHtml(booking.id)}">
          <label class="form-label" for="session-documents">Tambah lampiran</label>
          <input class="form-control" id="session-documents" name="documents" type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime,.pdf,.doc,.docx,.ppt,.pptx,.txt,.zip">
          <span class="form-help">Gambar, rekaman video, PDF, dokumen Office, TXT, atau ZIP. Maksimal 2 MB per file.</span>
          <div class="form-error" data-form-error></div>
          <button class="btn btn-outline btn-sm" type="submit">Unggah file</button>
        </form>
      ` : `<p class="form-help">Lampiran tersedia setelah sesi selesai.</p>`}
    </section>

    <section class="session-review">
      <div class="panel-header"><h3 class="panel-title">Rating dan feedback</h3></div>
      ${reviewMarkup}
    </section>
  `, "wide");
}

function openReviewModal(sessionId) {
  const booking = state.bookings.find((item) => item.id === sessionId);

  if (state.currentRole !== "student" || !canAccessBooking(booking) || booking.status !== "Selesai" || booking.review) {
    showToast("Ulasan hanya dapat dikirim satu kali setelah sesi selesai.", "error");
    return;
  }

  openModal(`
    <div class="modal-header">
      <div>
        <span class="eyebrow"><span class="eyebrow-dot"></span>Feedback sesi</span>
        <h2>Bagaimana sesi belajarmu?</h2>
        <p>${escapeHtml(booking.subject)} · ${escapeHtml(formatDate(booking.date))}</p>
      </div>
      <button class="modal-close" type="button" aria-label="Tutup" data-action="close-modal">×</button>
    </div>
    <form id="session-review-form" data-session-id="${escapeHtml(booking.id)}">
      <fieldset class="rating-fieldset">
        <legend class="form-label">Rating (1–5 bintang)</legend>
        <div class="rating-options">
          ${[5, 4, 3, 2, 1].map((rating) => `
            <label><input type="radio" name="rating" value="${rating}" required><span>${"★".repeat(rating)}</span></label>
          `).join("")}
        </div>
      </fieldset>
      <div class="form-group">
        <label class="form-label" for="session-review-comment">Komentar (opsional)</label>
        <textarea class="form-control" id="session-review-comment" name="comment" maxlength="1000" placeholder="Apa yang paling membantu dari sesi ini?"></textarea>
      </div>
      <div class="form-error" data-form-error></div>
      <div class="form-actions"><button class="btn btn-primary" type="submit">Kirim ulasan</button></div>
    </form>
  `, "narrow");
}
