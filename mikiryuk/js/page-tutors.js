/* Tutor search page, cards and filters */

function findTutorPage() {
  return `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">
          <span class="eyebrow-dot"></span>
          Cari tutor
        </span>

        <h1 class="page-title">Temukan tutor yang sesuai ritmemu.</h1>

        <p class="page-description">
          Jelajahi tutor berdasarkan mata pelajaran, mode belajar, dan
          anggaran. Pilih yang paling sesuai dengan kebutuhanmu.
        </p>

        <span class="page-hero-note">
          ✦ Data tutor di halaman ini merupakan data contoh
        </span>
      </div>
    </section>

    <section class="section">
      <div class="container browser-layout">
        <aside class="filter-card">
          <div class="filter-title">
            <span>Filter tutor</span>
            <button class="filter-reset" type="button" data-action="reset-filters">
              Reset
            </button>
          </div>

          <div class="filter-group">
            <label class="filter-label" for="tutor-search">Cari kata kunci</label>
            <input
              class="form-control"
              id="tutor-search"
              type="search"
              placeholder="Nama atau mata pelajaran"
            >
          </div>

          <div class="filter-group">
            <label class="filter-label" for="tutor-subject">Mata pelajaran</label>
            <select class="form-control" id="tutor-subject">
              <option value="">Semua mata pelajaran</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="IPA">IPA</option>
              <option value="Informatika">Informatika</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
              <option value="Persiapan Tes">Persiapan Tes</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label" for="tutor-mode">Mode belajar</label>
            <select class="form-control" id="tutor-mode">
              <option value="">Semua mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label" for="tutor-price">Anggaran maksimum</label>
            <input
              id="tutor-price"
              type="range"
              min="50000"
              max="150000"
              step="5000"
              value="150000"
            >
            <div class="range-value">
              <span>Minimum</span>
              <strong id="price-value">Rp150.000</strong>
            </div>
          </div>
        </aside>

        <div>
          <div class="result-toolbar">
            <span class="result-count" id="result-count">
              Menampilkan ${TUTORS.length} tutor contoh
            </span>

            <select class="sort-select" aria-label="Urutan tutor">
              <option>Rating tertinggi</option>
              <option>Harga terendah</option>
              <option>Paling populer</option>
            </select>
          </div>

          <div class="tutor-grid" id="tutor-grid"></div>

          <p class="data-note">
            Ingin menjadi tutor? <a href="#daftar-tutor">Daftar menjadi tutor →</a>
          </p>
        </div>
      </div>
    </section>
  `;
}

function tutorCard(tutor) {
  const favorite = state.favorites.includes(tutor.id);
  const tags = tutor.tags
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  return `
    <article class="tutor-card">
      <div class="tutor-card-top">
        <div class="tutor-avatar avatar-${tutor.color}">
          ${escapeHtml(tutor.initials)}
        </div>

        <div class="tutor-info">
          <strong class="tutor-name">${escapeHtml(tutor.name)}</strong>
          <span class="tutor-subject">
            ${escapeHtml(tutor.subject)} · ${escapeHtml(tutor.levels)}
          </span>
          <span class="rating">
            ★ ${tutor.rating} <small>(${tutor.reviews} ulasan)</small>
          </span>
        </div>

        <button
          class="favorite-button ${favorite ? "is-favorite" : ""}"
          type="button"
          data-action="favorite"
          data-tutor-id="${tutor.id}"
          aria-label="${favorite ? "Hapus dari favorit" : "Simpan tutor"}"
        >
          ${favorite ? "♥" : "♡"}
        </button>
      </div>

      <p class="tutor-bio">${escapeHtml(tutor.bio)}</p>

      <div class="tutor-tags">${tags}</div>

      <div class="tutor-meta">
        <span class="meta-item">⌖ ${escapeHtml(tutor.city)}</span>
        <span class="meta-item">◉ ${escapeHtml(tutor.modes.join(" / "))}</span>
        <span class="meta-item">✦ ${escapeHtml(tutor.badge)}</span>
      </div>

      <div class="tutor-card-bottom">
        <div class="card-price">
          ${formatMoney(tutor.rate)}
          <small>per sesi</small>
        </div>

        <button
          class="btn btn-dark btn-sm"
          type="button"
          data-action="book"
          data-tutor-id="${tutor.id}"
        >
          Pesan sesi
        </button>

        <button
          class="btn btn-outline btn-sm"
          type="button"
          data-action="view-tutor"
          data-tutor-id="${tutor.id}"
        >
          Lihat profil
        </button>
      </div>
    </article>
  `;
}

function getFilteredTutors() {
  const query = filters.search.trim().toLowerCase();

  return TUTORS.filter((tutor) => {
    const searchable = [
      tutor.name,
      tutor.subject,
      tutor.levels,
      tutor.city,
      tutor.bio,
      ...tutor.tags
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || searchable.includes(query);
    const matchesSubject =
      !filters.subject || tutor.subject === filters.subject;
    const matchesMode =
      !filters.mode || tutor.modes.includes(filters.mode);
    const matchesPrice = tutor.rate <= Number(filters.maxPrice);

    return matchesSearch && matchesSubject && matchesMode && matchesPrice;
  });
}

function renderTutorResults() {
  const grid = document.getElementById("tutor-grid");
  const count = document.getElementById("result-count");
  const priceValue = document.getElementById("price-value");

  if (!grid) {
    return;
  }

  const results = getFilteredTutors();

  if (count) {
    count.textContent = `Menampilkan ${results.length} dari ${TUTORS.length} tutor contoh`;
  }

  if (priceValue) {
    priceValue.textContent = formatMoney(filters.maxPrice);
  }

  if (!results.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <strong>Tutor tidak ditemukan</strong>
        Coba ubah kata kunci atau reset filter yang tersedia.
      </div>
    `;
    return;
  }

  grid.innerHTML = results.map(tutorCard).join("");
}

function setupTutorFilters() {
  const search = document.getElementById("tutor-search");
  const subject = document.getElementById("tutor-subject");
  const mode = document.getElementById("tutor-mode");
  const price = document.getElementById("tutor-price");

  if (search) {
    search.value = filters.search;
    search.addEventListener("input", () => {
      filters.search = search.value;
      renderTutorResults();
    });
  }

  if (subject) {
    subject.value = filters.subject;
    subject.addEventListener("change", () => {
      filters.subject = subject.value;
      renderTutorResults();
    });
  }

  if (mode) {
    mode.value = filters.mode;
    mode.addEventListener("change", () => {
      filters.mode = mode.value;
      renderTutorResults();
    });
  }

  if (price) {
    price.value = filters.maxPrice;
    price.addEventListener("input", () => {
      filters.maxPrice = Number(price.value);
      renderTutorResults();
    });
  }

  renderTutorResults();
}

function resetTutorFilters() {
  filters.search = "";
  filters.subject = "";
  filters.mode = "";
  filters.maxPrice = 150000;

  const search = document.getElementById("tutor-search");
  const subject = document.getElementById("tutor-subject");
  const mode = document.getElementById("tutor-mode");
  const price = document.getElementById("tutor-price");

  if (search) search.value = "";
  if (subject) subject.value = "";
  if (mode) mode.value = "";
  if (price) price.value = 150000;

  renderTutorResults();
}
