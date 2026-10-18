/* Auth gate and dashboards */

function authGate(role) {
  const isStudent = role === "student";
  const isAdmin = role === "admin";

  return `
    <section class="auth-gate">
      <div class="auth-gate-card">
        <div class="auth-gate-icon">${isStudent ? "🎒" : isAdmin ? "⚙" : "✦"}</div>

        <span class="eyebrow">
          <span class="eyebrow-dot"></span>
          Ruang ${isStudent ? "siswa" : isAdmin ? "admin" : "tutor"}
        </span>

        <h1>
          ${isStudent
            ? "Belum masuk sebagai siswa?"
            : isAdmin ? "Masuk untuk mengatur platform?" : "Belum masuk sebagai tutor?"}
        </h1>

        <p>
          ${isStudent
            ? "Daftar terlebih dahulu untuk memesan sesi dan melihat dashboard belajar."
            : isAdmin ? "Gunakan akun administrator demo untuk mengelola harga dan biaya." : "Daftar terlebih dahulu untuk membuat profil dan mengelola sesi mengajar."}
        </p>

        <div class="auth-gate-actions">
          <button
            class="btn btn-primary"
            type="button"
            data-action="login"
            data-role="${role}"
          >
            Masuk
          </button>

          <a
            class="btn btn-outline"
            href="#${isStudent ? "daftar-siswa" : isAdmin ? "beranda" : "daftar-tutor"}"
          >
            ${isStudent ? "Daftar siswa" : isAdmin ? "Kembali ke beranda" : "Daftar tutor"}
          </a>
        </div>
      </div>
    </section>
  `;
}

function studentDashboard() {
  const account = state.accounts.student;
  const firstName = escapeHtml(account.name.split(" ")[0]);
  const bookings = state.bookings
    .filter((booking) => booking.studentEmail === account.email)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const upcoming = bookings.filter((booking) => booking.status !== "Selesai");
  const next = upcoming[0];
  const nextTutor = next
    ? TUTORS.find((tutor) => tutor.id === next.tutorId)
    : null;

  const completed = bookings.filter((booking) => booking.status === "Selesai").length;
  const progress = Math.min(100, 30 + completed * 20 + bookings.length * 8);
  const recommendations = TUTORS.slice(0, 3);
  const sessionHistory = bookings.length
    ? bookings.map((booking) => `
        <div class="history-session">
          <div class="session-details">
            <strong>${escapeHtml(TUTORS.find((tutor) => tutor.id === booking.tutorId)?.name || "Tutor")}</strong>
            <small>${escapeHtml(booking.subject)} · ${escapeHtml(formatDate(booking.date))} · ${escapeHtml(booking.time)}</small>
          </div>
          <span class="status-pill ${booking.status === "Selesai" ? "green" : ""}">${escapeHtml(booking.status)}</span>
          <button class="btn btn-outline btn-sm" type="button" data-action="session-details" data-session-id="${escapeHtml(booking.id)}">Laporan</button>
          ${booking.status === "Selesai" && !booking.review
            ? `<button class="btn btn-primary btn-sm" type="button" data-action="review-session" data-session-id="${escapeHtml(booking.id)}">Beri ulasan</button>`
            : booking.review ? `<span class="review-stars">${"★".repeat(booking.review.rating)}</span>` : ""}
        </div>
      `).join("")
    : `<div class="empty-mini">Riwayat sesi akan muncul setelah kamu memesan tutor.</div>`;

  const nextSession = next
    ? `
      <div class="next-session">
        <div class="session-date">
          <strong>${escapeHtml(next.date.slice(8, 10))}</strong>
          <small>${escapeHtml(formatDate(next.date).split(" ")[1] || "")}</small>
        </div>

        <div class="session-details">
          <strong>${escapeHtml(nextTutor?.name || nextTutor || "Tutor")}</strong>
          <small>${escapeHtml(next.subject || "Sesi belajar")}</small>
        </div>

        <span class="session-time">${escapeHtml(next.time)}</span>
      </div>
    `
    : `
      <div class="empty-mini">
        Belum ada sesi terjadwal.
        <br>
        <a class="panel-link" href="#cari-tutor">Cari tutor sekarang →</a>
      </div>
    `;

  return `
    <section class="dashboard-page">
      <div class="container">
        <div class="dashboard-welcome">
          <div>
            <span class="dashboard-badge">● Ruang siswa</span>
            <h1>Halo, ${firstName}!</h1>
            <p>Terus jaga ritme belajarmu. Progress kecil tetap berarti.</p>
          </div>

          <a class="btn btn-primary" href="#cari-tutor">
            Cari tutor baru <span aria-hidden="true">→</span>
          </a>
        </div>

        <div class="stat-grid">
          <div class="stat-card">
            <span class="stat-icon">✓</span>
            <span class="stat-label">Sesi selesai</span>
            <strong class="stat-value">${completed}</strong>
          </div>

          <div class="stat-card">
            <span class="stat-icon">◷</span>
            <span class="stat-label">Jam belajar</span>
            <strong class="stat-value">${bookings.length}</strong>
          </div>

          <div class="stat-card">
            <span class="stat-icon">▣</span>
            <span class="stat-label">Materi dipelajari</span>
            <strong class="stat-value">${new Set(bookings.map((item) => item.subject)).size}</strong>
          </div>

          <div class="stat-card">
            <span class="stat-icon">↗</span>
            <span class="stat-label">Progress</span>
            <strong class="stat-value">${progress}%</strong>
          </div>
        </div>

        <div class="dashboard-columns">
          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Sesi berikutnya</h2>
              <a class="panel-link" href="#cari-tutor">Atur jadwal</a>
            </div>

            ${nextSession}

            ${
              upcoming.length > 1
                ? `
                  <div class="activity-list" style="margin-top: 16px;">
                    ${upcoming.slice(1, 3).map((booking) => {
                      const tutor = TUTORS.find((item) => item.id === booking.tutorId);
                      return `
                        <div class="activity-item">
                          <span class="activity-icon">◷</span>
                          <div class="activity-copy">
                            <strong>${escapeHtml(tutor?.name || booking.tutorId)}</strong>
                            <span>${escapeHtml(booking.subject)}</span>
                          </div>
                          <span class="activity-time">${escapeHtml(booking.date)}</span>
                        </div>
                      `;
                    }).join("")}
                  </div>
                `
                : ""
            }
          </div>

          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Progress belajar</h2>
              <span class="status-pill green">Aktif</span>
            </div>

            <div class="progress-meta">
              <span>Target mingguan</span>
              <strong>${progress}% selesai</strong>
            </div>

            <div class="big-progress">
              <span style="width: ${progress}%;"></span>
            </div>

            <div class="goal-list">
              <div class="goal-item">
                <span class="goal-dot"></span>
                <span>Memahami konsep dasar dengan lebih baik</span>
              </div>
              <div class="goal-item">
                <span class="goal-dot"></span>
                <span>Melakukan latihan secara konsisten</span>
              </div>
              <div class="goal-item">
                <span class="goal-dot"></span>
                <span>Menyiapkan target ujian berikutnya</span>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-columns" style="margin-top: 20px;">
          <div class="panel session-history-panel">
            <div class="panel-header">
              <h2 class="panel-title">Riwayat sesi</h2>
              <span class="status-pill">${bookings.length} sesi</span>
            </div>
            <div class="history-session-list">${sessionHistory}</div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Rekomendasi tutor</h2>
              <a class="panel-link" href="#cari-tutor">Lihat semua →</a>
            </div>

            <div class="recommend-grid">
              ${recommendations.map((tutor) => `
                <article class="recommend-card">
                  <div class="recommend-top">
                    <span class="recommend-avatar avatar-${tutor.color}">
                      ${escapeHtml(tutor.initials)}
                    </span>
                    <div class="recommend-info">
                      <strong class="recommend-name">${escapeHtml(tutor.name)}</strong>
                      <span class="recommend-meta">${escapeHtml(tutor.subject)}</span>
                    </div>
                  </div>

                  <button
                    class="btn btn-outline btn-sm"
                    type="button"
                    data-action="book"
                    data-tutor-id="${tutor.id}"
                  >
                    Lihat tutor
                  </button>
                </article>
              `).join("")}
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Tujuan belajarmu</h2>
              <a class="panel-link" href="#daftar-siswa">Edit</a>
            </div>

            <p style="color: var(--muted); font-size: 0.77rem;">
              ${escapeHtml(account.goal || "Belum menambahkan tujuan belajar.")}
            </p>

            <div class="tip-card" style="margin-top: 18px;">
              <h3>Tip hari ini ✨</h3>
              <p class="tip-text">
                Siapkan pertanyaan sebelum sesi agar waktu belajarmu
                lebih efektif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function tutorDashboard() {
  const account = state.accounts.tutor;
  const sessions = state.bookings
    .filter((booking) => booking.tutorEmail === account.email)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const requests = Array.isArray(account.requests) ? account.requests : [];
  const firstName = escapeHtml(account.name.split(" ")[0]);
  const completed = sessions.filter((session) => session.status === "Selesai").length;
  const earnings = sessions
    .filter((session) => session.status === "Selesai")
    .reduce((total, session) => total + sessionAmounts(session).tutorEarnings, 0);
  const reviews = sessions.map((session) => session.review).filter(Boolean);
  const rating = reviews.length
    ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1)
    : "Belum ada";
  const profileProgress = account.bio && account.availability ? 86 : 58;

  const sessionMarkup = sessions.length
    ? sessions.slice(0, 5).map((session) => `
        <div class="tutor-session">
          <div class="session-date">
            <strong>${escapeHtml(String(session.date).slice(8, 10))}</strong>
            <small>${escapeHtml(formatDate(session.date).split(" ")[1] || "")}</small>
          </div>

          <div class="session-left">
            <div class="session-main">
              <strong>${escapeHtml(session.studentName || "Siswa")}</strong>
              <small>${escapeHtml(session.subject || "Sesi tutoring")}</small>
            </div>
          </div>

          <time>${escapeHtml(session.time || "")}</time>
          <span class="status-pill ${session.status === "Selesai" ? "green" : ""}">
            ${escapeHtml(session.status || "Terjadwal")}
          </span>
          <div class="session-actions">
            <button class="btn btn-outline btn-sm" type="button" data-action="session-details" data-session-id="${escapeHtml(session.id)}">Laporan</button>
            ${session.status === "Terjadwal" || session.status === "Menunggu konfirmasi"
              ? `<button class="btn btn-primary btn-sm" type="button" data-action="start-session" data-session-id="${escapeHtml(session.id)}">Mulai sesi</button>`
              : session.status === "Berlangsung"
                ? `<button class="btn btn-primary btn-sm" type="button" data-action="end-session" data-session-id="${escapeHtml(session.id)}">Akhiri sesi</button>`
                : ""}
          </div>
        </div>
      `).join("")
    : `<div class="empty-mini">Belum ada sesi mengajar yang terjadwal.</div>`;

  const requestMarkup = requests.length
    ? requests.slice(0, 4).map((request) => `
        <div class="request-item">
          <span class="request-avatar">${escapeHtml(initials(request.studentName))}</span>
          <div class="request-copy">
            <strong>${escapeHtml(request.studentName || "Siswa")}</strong>
            <small>${escapeHtml(request.subject || "Sesi baru")} · ${escapeHtml(request.date || "")}</small>
          </div>
          <span class="status-pill">Baru</span>
        </div>
      `).join("")
    : `<div class="empty-mini">Belum ada permintaan baru.</div>`;

  return `
    <section class="dashboard-page">
      <div class="container">
        <div class="tutor-banner">
          <div>
            <span class="status-pill">
              ${account.verified ? "Tutor terverifikasi" : "Profil belum lengkap"}
            </span>
            <h2>Halo, ${firstName}!</h2>
            <p>
              Kelola sesi, pantau permintaan, dan bantu siswa
              terus bertumbuh melalui keahlianmu.
            </p>
          </div>

          <div class="profile-progress">
            <small>Kelengkapan profil</small>
            <strong>${profileProgress}%</strong>
            <div class="progress-track" style="margin-top: 9px;">
              <div class="progress-fill" style="width: ${profileProgress}%;"></div>
            </div>
          </div>

          <a class="btn btn-primary" href="#daftar-tutor">
            Edit profil
          </a>
        </div>

        <div class="stat-grid" style="margin-top: 20px;">
          <div class="stat-card">
            <span class="stat-icon">◷</span>
            <span class="stat-label">Sesi selesai</span>
            <strong class="stat-value">${completed}</strong>
          </div>

          <div class="stat-card">
            <span class="stat-icon">◉</span>
            <span class="stat-label">Sesi terjadwal</span>
            <strong class="stat-value">${sessions.filter((session) => session.status !== "Selesai").length}</strong>
          </div>

          <div class="stat-card">
            <span class="stat-icon">$</span>
            <span class="stat-label">Penghasilan sesi selesai</span>
            <strong class="stat-value">${formatMoney(earnings)}</strong>
          </div>

          <div class="stat-card">
            <span class="stat-icon">★</span>
            <span class="stat-label">Rating tutor</span>
            <strong class="stat-value">${escapeHtml(rating)}</strong>
          </div>
        </div>

        <div class="dashboard-columns">
          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Sesi mengajar</h2>
              <a class="panel-link" href="#lowongan">Cari lowongan →</a>
            </div>

            <div class="session-list">${sessionMarkup}</div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Permintaan terbaru</h2>
              <span class="status-pill">${requests.length} baru</span>
            </div>

            <div class="request-list">${requestMarkup}</div>
          </div>
        </div>

        <div class="dashboard-columns" style="margin-top: 20px;">
          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Lowongan untukmu</h2>
              <a class="panel-link" href="#lowongan">Lihat semua →</a>
            </div>

            <div class="job-list">
              ${JOBS.slice(0, 3).map((job) => `
                <a class="job-mini" href="#lowongan">
                  <span class="job-mini-icon">${job.icon}</span>
                  <div class="job-mini-copy">
                    <strong>${escapeHtml(job.title)}</strong>
                    <small>${escapeHtml(job.salary)}</small>
                  </div>
                  <span class="job-mini-arrow">↗</span>
                </a>
              `).join("")}
            </div>
          </div>

          <div class="tip-card">
            <h3>Tips untuk tutor baru ✦</h3>
            <p class="tip-text">
              Tulis metode mengajar dengan jelas. Profil yang spesifik
              membantu siswa memahami gaya belajarmu sebelum memulai sesi.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function adminDashboard() {
  const settings = state.platformSettings;

  return `
    <section class="dashboard-page">
      <div class="container">
        <div class="dashboard-welcome">
          <div>
            <span class="dashboard-badge">Pengelola platform</span>
            <h1>Pengaturan platform</h1>
            <p>Atur batas tarif tutor dan potongan untuk sesi baru.</p>
          </div>
        </div>

        <div class="dashboard-columns">
          <section class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Harga dan biaya</h2>
            </div>
            <form id="platform-settings-form" class="modal-form">
              <div class="form-group">
                <label class="form-label" for="minimum-session-price">Tarif minimum per sesi</label>
                <input class="form-control" id="minimum-session-price" name="minimumSessionPrice" type="number" min="1000" step="1000" required value="${settings.minimumSessionPrice}">
              </div>
              <div class="form-group">
                <label class="form-label" for="platform-fee-percent">Biaya platform (%)</label>
                <input class="form-control" id="platform-fee-percent" name="platformFeePercent" type="number" min="0" max="100" step="0.5" required value="${settings.platformFeePercent}">
                <span class="form-help">Biaya dipotong dari harga sesi tutor. Siswa membayar harga sesi yang ditampilkan.</span>
              </div>
              <div class="form-error" data-form-error></div>
              <div class="form-actions">
                <button class="btn btn-primary" type="submit">Simpan pengaturan</button>
              </div>
            </form>
          </section>

          <section class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Contoh perhitungan</h2>
            </div>
            ${feeBreakdownMarkup(Math.max(85000, Number(settings.minimumSessionPrice)), settings.platformFeePercent)}
            <p class="form-help">Pengaturan baru berlaku untuk pemesanan berikutnya. Riwayat sesi menyimpan nominal saat pemesanan dibuat.</p>
          </section>
        </div>
      </div>
    </section>
  `;
}
