/* Student / tutor registration page */

function registerPage(role) {
  const isStudent = role === "student";
  const account = state.accounts[role];
  const editing = Boolean(account && state.currentRole === role);
  const field = (key) => String(account?.[key] ?? "");
  const value = (key) => escapeHtml(field(key));
  const selected = (key, expected) => field(key) === expected ? "selected" : "";

  const benefits = isStudent
    ? [
        "Temukan tutor sesuai mata pelajaran dan tujuan belajar",
        "Atur jadwal sesi sesuai ketersediaanmu",
        "Pantau perkembangan belajarmu",
        "Simpan catatan dan riwayat sesi"
      ]
    : [
        "Buat profil tutoring yang sesuai keahlianmu",
        "Atur jadwal mengajar secara fleksibel",
        "Temukan lowongan tutoring yang menarik",
        "Bangun reputasi dan pengalaman mengajar"
      ];

  return `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">
          <span class="eyebrow-dot"></span>
          ${editing ? "Kelola akun" : "Mulai bersama MikirYuk"}
        </span>

        <h1 class="page-title">
          ${editing
            ? (isStudent ? "Lengkapi profil siswamu." : "Kelola profil tutor-mu.")
            : (isStudent ? "Mulai belajar dengan cara yang lebih personal." : "Ubah keahlianmu menjadi peluang.")
          }
        </h1>

        <p class="page-description">
          ${isStudent
            ? "Buat akun siswa agar kamu bisa memesan sesi, melihat jadwal, dan memantau perkembangan belajar."
            : "Daftar sebagai tutor, lengkapi keahlianmu, dan temukan kesempatan mengajar yang sesuai."
          }
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container register-layout">
        <div class="form-card">
          <div class="role-switcher">
            <a
              class="role-link ${isStudent ? "active" : ""}"
              href="#daftar-siswa"
            >
              Saya siswa
            </a>
            <a
              class="role-link ${!isStudent ? "active" : ""}"
              href="#daftar-tutor"
            >
              Saya tutor
            </a>
          </div>

          <div class="form-header">
            <h2>${editing ? "Perbarui informasi" : "Buat akun baru"}</h2>
            <p>
              ${isStudent
                ? "Isi data dasar berikut untuk memulai."
                : "Semakin lengkap profilmu, semakin mudah ditemukan oleh siswa."
              }
            </p>
          </div>

          <form
            id="register-form"
            data-role="${role}"
          >
            <div class="form-grid">
              <div class="form-group full">
                <label class="form-label" for="${role}-name">Nama lengkap</label>
                <input
                  class="form-control"
                  id="${role}-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: Aulia Putri"
                  value="${value("name")}"
                >
              </div>

              <div class="form-group">
                <label class="form-label" for="${role}-email">Email</label>
                <input
                  class="form-control"
                  id="${role}-email"
                  name="email"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value="${value("email")}"
                >
              </div>

              <div class="form-group">
                <label class="form-label" for="${role}-password">Password</label>
                <input
                  class="form-control"
                  id="${role}-password"
                  name="password"
                  type="password"
                  required
                  minlength="6"
                  placeholder="Minimal 6 karakter"
                >
                <span class="form-help">Password disimpan dalam bentuk hash dan tidak dapat dibaca sebagai teks biasa.</span>
              </div>

              ${
                isStudent
                  ? `
                    <div class="form-group">
                      <label class="form-label" for="student-level">Jenjang</label>
                      <select class="form-control" id="student-level" name="level" required>
                        <option value="">Pilih jenjang</option>
                        <option ${selected("level", "SD")} value="SD">SD</option>
                        <option ${selected("level", "SMP")} value="SMP">SMP</option>
                        <option ${selected("level", "SMA")} value="SMA">SMA</option>
                        <option ${selected("level", "Kuliah")} value="Kuliah">Kuliah</option>
                      </select>
                    </div>

                    <div class="form-group full">
                      <label class="form-label" for="student-goal">Tujuan belajar</label>
                      <textarea
                        class="form-control"
                        id="student-goal"
                        name="goal"
                        required
                        placeholder="Contoh: meningkatkan nilai matematika dan lebih paham konsep IPA"
                      >${value("goal")}</textarea>
                    </div>
                  `
                  : `
                    <div class="form-group">
                      <label class="form-label" for="tutor-subject">Mata pelajaran</label>
                      <select class="form-control" id="tutor-subject" name="subject" required>
                        <option value="">Pilih mata pelajaran</option>
                        <option ${selected("subject", "Matematika")} value="Matematika">Matematika</option>
                        <option ${selected("subject", "Bahasa Indonesia")} value="Bahasa Indonesia">Bahasa Indonesia</option>
                        <option ${selected("subject", "IPA")} value="IPA">IPA</option>
                        <option ${selected("subject", "Informatika")} value="Informatika">Informatika</option>
                        <option ${selected("subject", "Bahasa Inggris")} value="Bahasa Inggris">Bahasa Inggris</option>
                        <option ${selected("subject", "Persiapan Tes")} value="Persiapan Tes">Persiapan Tes</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="tutor-level">Jenjang yang diajar</label>
                      <select class="form-control" id="tutor-level" name="level" required>
                        <option value="">Pilih jenjang</option>
                        <option ${selected("level", "SD")} value="SD">SD</option>
                        <option ${selected("level", "SMP")} value="SMP">SMP</option>
                        <option ${selected("level", "SMA")} value="SMA">SMA</option>
                        <option ${selected("level", "Semua jenjang")} value="Semua jenjang">Semua jenjang</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="tutor-experience">Pengalaman mengajar</label>
                      <input
                        class="form-control"
                        id="tutor-experience"
                        name="experience"
                        type="text"
                        required
                        placeholder="Contoh: 2 tahun"
                        value="${value("experience")}"
                      >
                    </div>

                    <div class="form-group">
                      <label class="form-label" for="tutor-rate">Tarif per sesi</label>
                      <input
                        class="form-control"
                        id="tutor-rate"
                        name="rate"
                        type="number"
                        min="${state.platformSettings.minimumSessionPrice}"
                        required
                        placeholder="75000"
                        value="${value("rate") || "75000"}"
                      >
                      <span class="form-help">Minimum ${formatMoney(state.platformSettings.minimumSessionPrice)} per sesi.</span>
                    </div>

                    <div class="form-group full">
                      <label class="form-label" for="tutor-mode">Mode mengajar</label>
                      <select class="form-control" id="tutor-mode" name="mode" required>
                        <option value="">Pilih mode mengajar</option>
                        <option ${selected("mode", "Online")} value="Online">Online</option>
                        <option ${selected("mode", "Offline")} value="Offline">Offline</option>
                        <option ${selected("mode", "Online dan Offline")} value="Online dan Offline">Online dan Offline</option>
                      </select>
                    </div>

                    <div class="form-group full">
                      <label class="form-label" for="tutor-bio">Tentang dirimu</label>
                      <textarea
                        class="form-control"
                        id="tutor-bio"
                        name="bio"
                        required
                        placeholder="Ceritakan pengalaman, metode mengajar, dan keahlianmu"
                      >${value("bio")}</textarea>
                    </div>

                    <div class="form-group full">
                      <label class="form-label" for="tutor-availability">Ketersediaan</label>
                      <textarea
                        class="form-control"
                        id="tutor-availability"
                        name="availability"
                        required
                        placeholder="Contoh: Senin–Jumat, pukul 16.00–20.00"
                      >${value("availability")}</textarea>
                    </div>
                  `
              }
            </div>

            <label class="form-check">
              <input type="checkbox" name="terms" required ${editing ? "checked" : ""}>
              <span>
                Saya menyetujui ketentuan MikirYuk dan bersedia menggunakan
                platform dengan cara yang bertanggung jawab.
              </span>
            </label>

            <div class="form-error" data-form-error></div>

            <div class="form-actions">
              <button class="btn btn-primary" type="submit">
                ${editing ? "Simpan perubahan" : (isStudent ? "Daftar sebagai siswa" : "Daftar sebagai tutor")}
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <p class="form-note">
              Sudah punya akun?
              <a href="#masuk" data-action="login">Masuk di sini</a>
            </p>
          </form>
        </div>

        <aside class="form-side">
          <span class="eyebrow" style="color: var(--yellow);">
            <span class="eyebrow-dot"></span>
            ${isStudent ? "Manfaat untuk siswa" : "Manfaat untuk tutor"}
          </span>

          <h3>
            ${isStudent
              ? "Belajar lebih terarah, tidak perlu bingung."
              : "Keahlianmu bisa menjadi sesi belajar yang bernilai."}
          </h3>

          <p>
            ${isStudent
              ? "Semua yang kamu butuhkan untuk memulai proses belajar yang lebih nyaman."
              : "Mulai dari profil yang baik dan temukan siswa yang sesuai dengan keahlianmu."
            }
          </p>

          <ul class="side-list">
            ${benefits.map((benefit) => `
              <li>
                <span class="side-check" aria-hidden="true">✓</span>
                <span>${escapeHtml(benefit)}</span>
              </li>
            `).join("")}
          </ul>
        </aside>
      </div>
    </section>
  `;
}
