/* Landing page view */

function landingPage() {
  return `
    <section class="home-hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">
            <span class="eyebrow-dot"></span>
            Platform belajar yang lebih personal
          </span>

          <h1 class="hero-title">
            Belajar lebih mudah,
            <span class="highlight">bersama MikirYuk.</span>
          </h1>

          <p class="hero-description">
            Temukan tutor yang sesuai kebutuhanmu, atur jadwal sendiri,
            dan belajar dengan cara yang membuatmu lebih paham.
            Tidak perlu bingung harus mulai dari mana.
          </p>

          <div class="hero-actions">
            <a class="btn btn-primary" href="#cari-tutor">
              Cari tutor <span aria-hidden="true">→</span>
            </a>
            <a class="btn btn-outline" href="#daftar-tutor">
              <span aria-hidden="true">✦</span>
              Jadi tutor
            </a>
          </div>

          <div class="hero-proof">
            <div class="mini-avatars" aria-hidden="true">
              <span>AR</span>
              <span>DN</span>
              <span>SF</span>
              <span>+</span>
            </div>

            <p>
              <strong>Belajar dengan tutor pilihan</strong>
              Materi tersusun, jadwal fleksibel, dan pendampingan lebih fokus.
            </p>
          </div>
        </div>

        <div class="hero-art" aria-label="Ilustrasi MikirYuk">
          <div class="art-card">
            <div class="art-card-head">
              <div class="mini-logo">M</div>
              <div>
                <strong>Halo, Aulia!</strong>
                <small>Siap belajar hari ini?</small>
              </div>
              <span class="online-label">Aktif</span>
            </div>

            <div class="art-progress">
              <div class="art-progress-label">
                <span>Target minggu ini</span>
                <strong>3 dari 4 sesi</strong>
              </div>
              <div class="progress-track">
                <div class="progress-fill"></div>
              </div>
            </div>

            <div class="art-session">
              <span class="art-session-icon">∑</span>
              <div>
                <strong>Matematika</strong>
                <small>Integral &amp; turunan</small>
              </div>
              <time>10:00</time>
            </div>

            <div class="art-session">
              <span class="art-session-icon">Aa</span>
              <div>
                <strong>Bahasa Indonesia</strong>
                <small>Menulis paragraf</small>
              </div>
              <time>13:30</time>
            </div>

            <div class="art-session">
              <span class="art-session-icon">⚛</span>
              <div>
                <strong>IPA</strong>
                <small>Hukum Newton</small>
              </div>
              <time>16:00</time>
            </div>
          </div>

          <div class="art-float art-float-top">
            <span class="art-avatar">NA</span>
            <div>
              <strong>Nadia, tutor Matematika</strong>
              <small>Siap mengajar</small>
            </div>
          </div>

          <div class="art-float art-float-bottom">
            <span class="art-avatar">🔥</span>
            <div>
              <strong>7 hari berturut-turut!</strong>
              <small>Terus pertahankan</small>
            </div>
          </div>
        </div>
      </div>

      <div class="container home-strip">
        <div class="home-feature">
          <span class="home-feature-icon">1:1</span>
          <div>
            <strong>Belajar one-on-one</strong>
            <span>Attention lebih fokus</span>
          </div>
        </div>

        <div class="home-feature">
          <span class="home-feature-icon">⌁</span>
          <div>
            <strong>Online &amp; offline</strong>
            <span>Sesuai kebutuhan belajar</span>
          </div>
        </div>

        <div class="home-feature">
          <span class="home-feature-icon">◷</span>
          <div>
            <strong>Jadwal fleksibel</strong>
            <span>Belajar sesuai ritmemu</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section home-section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">
            <span class="eyebrow-dot"></span>
            Layanan MikirYuk
          </span>

          <h2 class="section-title">Mau belajar apa hari ini?</h2>

          <p class="section-description">
            Pilih mata pelajaran yang ingin dikuasai dan temukan tutor
            yang bisa membantu proses belajarmu.
          </p>
        </div>

        <div class="service-grid">
          <article class="service-card">
            <div class="service-top">
              <span class="service-icon">∑</span>
              <span class="service-arrow">↗</span>
            </div>
            <h3>Matematika</h3>
            <p>Bantu memahami konsep, soal, dan cara berpikir yang terstruktur.</p>
            <a class="service-link" href="#cari-tutor">Cari tutor →</a>
          </article>

          <article class="service-card">
            <div class="service-top">
              <span class="service-icon">Aa</span>
              <span class="service-arrow">↗</span>
            </div>
            <h3>Bahasa Indonesia</h3>
            <p>Latihan menulis, membaca, dan berkomunikasi dengan lebih percaya diri.</p>
            <a class="service-link" href="#cari-tutor">Cari tutor →</a>
          </article>

          <article class="service-card">
            <div class="service-top">
              <span class="service-icon">⚛</span>
              <span class="service-arrow">↗</span>
            </div>
            <h3>IPA</h3>
            <p>Pahami konsep sains dengan penjelasan yang sederhana dan mudah diingat.</p>
            <a class="service-link" href="#cari-tutor">Cari tutor →</a>
          </article>

          <article class="service-card">
            <div class="service-top">
              <span class="service-icon">&lt;/&gt;</span>
              <span class="service-arrow">↗</span>
            </div>
            <h3>Informatika</h3>
            <p>Belajar coding, teknologi, dan keterampilan digital untuk masa depan.</p>
            <a class="service-link" href="#cari-tutor">Cari tutor →</a>
          </article>

          <article class="service-card">
            <div class="service-top">
              <span class="service-icon">EN</span>
              <span class="service-arrow">↗</span>
            </div>
            <h3>Bahasa Inggris</h3>
            <p>Latihan speaking, grammar, listening, dan persiapan IELTS atau TOEFL.</p>
            <a class="service-link" href="#cari-tutor">Cari tutor →</a>
          </article>

          <article class="service-card">
            <div class="service-top">
              <span class="service-icon">✓</span>
              <span class="service-arrow">↗</span>
            </div>
            <h3>Persiapan Tes</h3>
            <p>Persiapan UTBK, tes akademik, dan ujian penting lainnya dengan terarah.</p>
            <a class="service-link" href="#cari-tutor">Cari tutor →</a>
          </article>
        </div>
      </div>
    </section>

    <section class="home-cta">
      <div class="container">
        <div class="cta-panel">
          <div class="cta-content">
            <span class="cta-kicker">Langkah kecil, perubahan besar</span>
            <h2>Siap mulai belajar dengan cara yang lebih personal?</h2>
            <p>
              Temukan tutor yang cocok sekarang. Jika kamu juga ingin mengajar,
              siapkan keahlianmu dan mulai karier baru.
            </p>

            <div class="cta-actions">
              <a class="btn btn-dark" href="#daftar-siswa">
                Mulai sebagai siswa <span aria-hidden="true">→</span>
              </a>
              <a class="btn btn-light" href="#daftar-tutor">
                Daftar jadi tutor
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
