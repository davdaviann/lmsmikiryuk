/* Form handlers and account/booking/job actions */

async function handleRegistration(form) {
  const role = form.dataset.role;
  const data = Object.fromEntries(new FormData(form).entries());
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const terms = form.elements.terms;

  if (!name || !email) {
    showFormError(form, "Nama dan email wajib diisi.");
    return;
  }

  if (!terms || !terms.checked) {
    showFormError(form, "Kamu perlu menyetujui ketentuan MikirYuk.");
    return;
  }

  if (role === "student") {
    data.goal = String(data.goal || "").trim();
  } else {
    const rate = Number(data.rate || 0);

    if (rate < state.platformSettings.minimumSessionPrice) {
      showFormError(
        form,
        `Tarif minimum per sesi adalah ${formatMoney(state.platformSettings.minimumSessionPrice)}.`
      );
      return;
    }
    data.rate = rate;
  }

  try {
    const editing = state.currentRole === role && state.apiToken;
    const result = await apiRequest(editing ? "/api/profile" : "/api/auth/register", {
      method: editing ? "PUT" : "POST",
      body: { ...data, role, name, email }
    });
    if (result.token) state.apiToken = result.token;
    state.currentRole = role;
    state.accounts[role] = result.account;
    await refreshApiState();
    closeModal();
    go(role === "student" ? "dashboard-siswa" : "dashboard-tutor");
    showToast(role === "student" ? "Akun siswa berhasil disimpan." : "Profil tutor berhasil disimpan.");
  } catch (error) {
    showFormError(form, error.message);
  }
}

function setupTutorRateValidation() {
  const input = document.getElementById("tutor-rate");

  if (!input) return;

  const validate = () => {
    const minimum = Number(input.min) || state.platformSettings.minimumSessionPrice;
    const message = input.value && Number(input.value) < minimum
      ? `Tarif minimum per sesi adalah ${formatMoney(minimum)}.`
      : "";
    const error = input.form.querySelector("[data-form-error]");

    input.setCustomValidity(message);

    if (message) {
      showFormError(input.form, message);
    } else if (error?.textContent.startsWith("Tarif minimum per sesi adalah ")) {
      error.textContent = "";
    }
  };

  input.addEventListener("input", validate);
  validate();
}

async function handleLogin(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const role = String(data.role || "student");
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "").trim();
  if (!password) {
    showFormError(form, "Password wajib diisi.");
    return;
  }

  try {
    const result = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { role, email, password }
    });
    state.apiToken = result.token;
    state.currentRole = role;
    state.accounts[role] = result.account;
    await refreshApiState();
    closeModal();
    go(role === "student" ? "dashboard-siswa" : role === "admin" ? "dashboard-admin" : "dashboard-tutor");
    showToast("Berhasil masuk ke MikirYuk.");
  } catch (error) {
    showFormError(form, error.message);
  }
}

async function handleBooking(form) {
  const student = currentAccount();

  if (!student || state.currentRole !== "student") {
    openLoginModal("student");
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  const tutorId = form.dataset.tutorId;
  const tutor = TUTORS.find((item) => item.id === tutorId);

  if (!tutor || !data.date || !data.time) {
    showFormError(form, "Lengkapi tanggal dan waktu sesi.");
    return;
  }

  if (Number(tutor.rate) < state.platformSettings.minimumSessionPrice) {
    showFormError(
      form,
      `Tutor ini belum memenuhi tarif minimum ${formatMoney(state.platformSettings.minimumSessionPrice)}.`
    );
    return;
  }

  try {
    const result = await apiRequest("/api/bookings", {
      method: "POST",
      body: { tutorId, date: String(data.date), time: String(data.time), note: String(data.note || "").trim() }
    });
    replaceBooking(result.booking);
    saveState();
    closeModal();
    renderRoute();
    showToast("Permintaan sesi berhasil dikirim.");
  } catch (error) {
    showFormError(form, error.message);
  }
}

function createDemoAccount(role) {
  if (role === "admin") {
    return {
      name: "Admin MikirYuk",
      email: "admin@demo.mikiryuk.id",
      createdAt: new Date().toISOString()
    };
  }

  if (role === "student") {
    return {
      name: "Aulia Putri",
      email: "aulia@demo.mikiryuk.id",
      level: "SMA",
      goal: "Meningkatkan nilai matematika dan memahami konsep IPA.",
      createdAt: new Date().toISOString()
    };
  }

  return {
    name: "Nadia Putri",
    email: "nadia@demo.mikiryuk.id",
    subject: "Matematika",
    level: "SMP & SMA",
    experience: "3 tahun",
    rate: 85000,
    mode: "Online dan Offline",
    bio: "Membantu siswa memahami konsep matematika dengan contoh sederhana dan latihan bertahap.",
    availability: "Senin–Jumat, pukul 16.00–20.00",
    verified: true,
    createdAt: new Date().toISOString(),
    sessions: [
      {
        student: "Raka Pratama",
        subject: "Matematika",
        date: dateOffset(1),
        time: "16:00",
        status: "Terjadwal"
      },
      {
        student: "Dina Lestari",
        subject: "Matematika",
        date: dateOffset(2),
        time: "18:00",
        status: "Terjadwal"
      },
      {
        student: "Fajar Ramadhan",
        subject: "Persiapan Tes",
        date: dateOffset(3),
        time: "17:00",
        status: "Selesai"
      }
    ],
    requests: [
      {
        studentName: "Salsa Putri",
        subject: "Matematika",
        date: dateOffset(4),
        time: "19:00"
      }
    ]
  };
}

async function useDemoAccount(role) {
  try {
    const result = await apiRequest("/api/auth/demo", { method: "POST", body: { role } });
    state.apiToken = result.token;
    state.currentRole = role;
    state.accounts[role] = result.account;
    await refreshApiState();
    closeModal();
    go(role === "student" ? "dashboard-siswa" : role === "admin" ? "dashboard-admin" : "dashboard-tutor");
    showToast("Akun demo berhasil dibuka.");
  } catch (error) {
    showToast(error.message, "error");
  }
}

function seedDemoSessions() {
  if (state.bookings.some((booking) => String(booking.id).startsWith("demo-session-"))) {
    return;
  }

  const now = Date.now();
  const amounts = calculateSessionAmounts(85000, state.platformSettings.platformFeePercent);
  const common = {
    tutorId: "nadia",
    tutorEmail: "nadia@demo.mikiryuk.id",
    studentEmail: "aulia@demo.mikiryuk.id",
    studentName: "Aulia Putri",
    subject: "Matematika",
    price: amounts.price,
    platformFeePercent: Number(state.platformSettings.platformFeePercent),
    platformFee: amounts.platformFee,
    tutorEarnings: amounts.tutorEarnings,
    studentTotal: amounts.studentTotal,
    time: "16:00",
    note: "Sesi demo",
    documents: []
  };

  state.bookings.unshift(
    {
      ...common,
      id: "demo-session-progress",
      date: dateOffset(0),
      status: "Berlangsung",
      startedAt: new Date(now - 20 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 60 * 60 * 1000).toISOString()
    },
    {
      ...common,
      id: "demo-session-completed",
      date: dateOffset(-1),
      status: "Selesai",
      startedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(now - 60 * 60 * 1000).toISOString(),
      durationMinutes: 60,
      createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString()
    }
  );
}

async function handlePlatformSettings(form) {
  if (state.currentRole !== "admin") {
    showFormError(form, "Hanya administrator yang dapat mengubah pengaturan platform.");
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  const minimumSessionPrice = Number(data.minimumSessionPrice);
  const platformFeePercent = Number(data.platformFeePercent);

  if (!Number.isFinite(minimumSessionPrice) || minimumSessionPrice < 1) {
    showFormError(form, "Tarif minimum harus lebih besar dari Rp0.");
    return;
  }

  if (!Number.isFinite(platformFeePercent) || platformFeePercent < 0 || platformFeePercent > 100) {
    showFormError(form, "Biaya platform harus berada di antara 0% dan 100%.");
    return;
  }

  try {
    const result = await apiRequest("/api/platform-settings", {
      method: "PUT",
      body: { minimumSessionPrice, platformFeePercent }
    });
    state.platformSettings = result.platformSettings;
    saveState();
    renderRoute();
    showToast("Pengaturan platform berhasil disimpan.");
  } catch (error) {
    showFormError(form, error.message);
  }
}

async function startSession(sessionId) {
  const booking = state.bookings.find((item) => item.id === sessionId);

  if (!canAccessBooking(booking) || state.currentRole !== "tutor") {
    showToast("Sesi ini tidak dapat diakses oleh akunmu.", "error");
    return;
  }

  if (booking.status !== "Terjadwal" && booking.status !== "Menunggu konfirmasi") {
    showToast("Sesi ini tidak dapat dimulai.", "error");
    return;
  }

  try {
    const result = await apiRequest(`/api/bookings/${encodeURIComponent(sessionId)}/start`, { method: "POST", body: {} });
    replaceBooking(result.booking);
    saveState();
    renderRoute();
    showToast("Sesi ditandai sedang berlangsung.");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function completeSession(sessionId) {
  const booking = state.bookings.find((item) => item.id === sessionId);

  if (!canAccessBooking(booking) || state.currentRole !== "tutor") {
    showToast("Sesi ini tidak dapat diakses oleh akunmu.", "error");
    return;
  }

  if (booking.status !== "Berlangsung") {
    showToast("Mulai sesi sebelum menandainya selesai.", "error");
    return;
  }

  try {
    const result = await apiRequest(`/api/bookings/${encodeURIComponent(sessionId)}/complete`, {
      method: "POST",
      body: { confirmed: true }
    });
    replaceBooking(result.booking);
    saveState();
    closeModal();
    renderRoute();
    showToast("Sesi selesai. Siswa kini dapat memberi ulasan.");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function submitSessionReview(form) {
  const booking = state.bookings.find((item) => item.id === form.dataset.sessionId);
  const account = currentAccount();
  const data = Object.fromEntries(new FormData(form).entries());
  const rating = Number(data.rating);

  if (state.currentRole !== "student" || !canAccessBooking(booking)) {
    showFormError(form, "Hanya siswa pada sesi ini yang dapat memberi ulasan.");
    return;
  }

  if (!booking || booking.status !== "Selesai") {
    showFormError(form, "Ulasan tersedia setelah sesi selesai.");
    return;
  }

  if (booking.review) {
    showFormError(form, "Ulasan untuk sesi ini sudah pernah dikirim.");
    return;
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    showFormError(form, "Pilih rating antara 1 dan 5 bintang.");
    return;
  }

  try {
    const result = await apiRequest(`/api/bookings/${encodeURIComponent(booking.id)}/review`, {
      method: "POST",
      body: { rating, comment: String(data.comment || "").trim() }
    });
    replaceBooking(result.booking);
    saveState();
    closeModal();
    renderRoute();
    showToast("Terima kasih, ulasanmu berhasil dikirim.");
  } catch (error) {
    showFormError(form, error.message);
  }
}

async function handleSessionDocumentation(form) {
  const booking = state.bookings.find((item) => item.id === form.dataset.sessionId);
  const input = form.elements.documents;
  const files = Array.from(input.files || []);
  const allowedTypes = {
    png: ["image/png"],
    jpg: ["image/jpeg"],
    jpeg: ["image/jpeg"],
    gif: ["image/gif"],
    webp: ["image/webp"],
    mp4: ["video/mp4"],
    webm: ["video/webm"],
    mov: ["video/quicktime"],
    pdf: ["application/pdf"],
    doc: ["application/msword"],
    docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    ppt: ["application/vnd.ms-powerpoint"],
    pptx: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    txt: ["text/plain"],
    zip: ["application/zip", "application/x-zip-compressed"]
  };

  if (!canAccessBooking(booking) || !booking || booking.status !== "Selesai") {
    showFormError(form, "Dokumentasi hanya tersedia bagi peserta sesi yang sudah selesai.");
    return;
  }

  if (!files.length) {
    showFormError(form, "Pilih setidaknya satu file untuk diunggah.");
    return;
  }

  if (files.length > 5) {
    showFormError(form, "Unggah maksimal 5 file sekaligus.");
    return;
  }

  if (files.some((file) => file.size > 2 * 1024 * 1024)) {
    showFormError(form, "Ukuran setiap file maksimal 2 MB.");
    return;
  }

  if (files.some((file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    return !allowedTypes[extension] || (file.type && !allowedTypes[extension].includes(file.type));
  })) {
    showFormError(form, "Gunakan gambar, rekaman video, PDF, dokumen Office, TXT, atau ZIP.");
    return;
  }

  try {
    const uploads = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        name: file.name,
        type: file.type || allowedTypes[file.name.split(".").pop().toLowerCase()][0],
        dataBase64: String(reader.result).split(",")[1]
      });
      reader.onerror = () => reject(new Error("File tidak dapat dibaca."));
      reader.readAsDataURL(file);
    })));

    const result = await apiRequest(`/api/bookings/${encodeURIComponent(booking.id)}/documents`, {
      method: "POST",
      body: { files: uploads }
    });
    replaceBooking(result.booking);
    saveState();
    openSessionDetailsModal(booking.id);
    showToast("Dokumentasi sesi berhasil ditambahkan.");
  } catch (error) {
    showFormError(form, error.message || "File tidak dapat dibaca. Coba unggah kembali.");
  }
}

async function downloadSessionDocument(sessionId, documentId) {
  const booking = state.bookings.find((item) => item.id === sessionId);
  const file = booking?.documents?.find((item) => item.id === documentId);

  if (!canAccessBooking(booking) || !file) {
    showToast("Kamu tidak memiliki akses ke file ini.", "error");
    return;
  }

  try {
    const blob = await apiRequest(`/api/bookings/${encodeURIComponent(sessionId)}/documents/${encodeURIComponent(documentId)}`);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    showToast(error.message, "error");
  }
}

function applyJob(jobId) {
  if (state.currentRole !== "tutor") {
    if (state.accounts.tutor) {
      showToast("Masuk sebagai tutor untuk melamar lowongan.");
      openLoginModal("tutor");
    } else {
      go("daftar-tutor");
    }
    return;
  }

  if (!state.appliedJobs.includes(jobId)) {
    state.appliedJobs.push(jobId);
    saveState();
    renderRoute();
  }

  showToast("Lowongan berhasil dilamar.");
}
