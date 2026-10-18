/* Tutor job listings page */

function lowonganPage() {
  return `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">
          <span class="eyebrow-dot"></span>
          Kesempatan mengajar
        </span>

        <h1 class="page-title">Lowongan tutoring yang bisa kamu ikuti.</h1>

        <p class="page-description">
          Cari peluang mengajar sesuai keahlianmu. Buat profil tutor,
          lalu mulai terhubung dengan siswa yang membutuhkan bantuan belajar.
        </p>

        <span class="page-hero-note">
          ✦ Daftar sebagai tutor untuk melamar lowongan
        </span>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">
            <span class="eyebrow-dot"></span>
            Pilih sesuai keahlianmu
          </span>
          <h2 class="section-title">Lowongan terbaru</h2>
        </div>

        <div class="job-grid">
          ${JOBS.map((job) => {
            const applied = state.appliedJobs.includes(job.id);

            return `
              <article class="job-card">
                <div class="job-card-top">
                  <span class="job-tag">${escapeHtml(job.category)}</span>
                  <span class="job-type">${escapeHtml(job.mode)}</span>
                </div>

                <h3>${escapeHtml(job.title)}</h3>

                <div class="job-meta">
                  <span>Jenjang: ${escapeHtml(job.level)}</span>
                  <span>Format: ${escapeHtml(job.mode)}</span>
                </div>

                <div class="job-footer">
                  <span class="job-salary">${escapeHtml(job.salary)}</span>
                  ${
                    applied
                      ? `<span class="job-applied">✓ Sudah dilamar</span>`
                      : `
                        <button
                          class="btn btn-dark btn-sm"
                          type="button"
                          data-action="apply-job"
                          data-job-id="${job.id}"
                        >
                          Lamar
                        </button>
                      `
                  }
                </div>
              </article>
            `;
          }).join("")}
        </div>

        <div class="cta-panel" style="margin-top: 65px;">
          <div class="cta-content">
            <span class="cta-kicker">Punya keahlian?</span>
            <h2>Buat profilmu dan mulai mengajar.</h2>
            <p>
              Daftarkan keahlianmu dan temukan siswa yang sedang membutuhkan
              bantuan seperti yang bisa kamu berikan.
            </p>

            <div class="cta-actions">
              <a class="btn btn-dark" href="#daftar-tutor">
                Daftar jadi tutor <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
