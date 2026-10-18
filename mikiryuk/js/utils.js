/* Small helper functions (formatting, escaping, dates) */

function escapeHtml(value = "") {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };

  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

function formatMoney(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  })
    .format(value || 0)
    .replace("IDR", "Rp");
}

function formatDate(value) {
  if (!value) {
    return "Belum ditentukan";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function calculateSessionAmounts(price, feePercent = state.platformSettings.platformFeePercent) {
  const sessionPrice = Math.max(0, Number(price) || 0);
  const platformFee = Math.round(sessionPrice * (Number(feePercent) || 0) / 100);

  return {
    price: sessionPrice,
    platformFee,
    tutorEarnings: sessionPrice - platformFee,
    studentTotal: sessionPrice
  };
}

function sessionAmounts(booking) {
  const amounts = calculateSessionAmounts(
    booking.price,
    booking.platformFeePercent ?? state.platformSettings.platformFeePercent
  );

  return {
    ...amounts,
    platformFee: Number.isFinite(Number(booking.platformFee))
      ? Number(booking.platformFee)
      : amounts.platformFee,
    tutorEarnings: Number.isFinite(Number(booking.tutorEarnings))
      ? Number(booking.tutorEarnings)
      : amounts.tutorEarnings
  };
}

function feeBreakdownMarkup(price, feePercent = state.platformSettings.platformFeePercent) {
  const amounts = calculateSessionAmounts(price, feePercent);

  return `
    <dl class="fee-breakdown">
      <div><dt>Harga sesi tutor</dt><dd>${formatMoney(amounts.price)}</dd></div>
      <div><dt>Biaya platform (${Number(feePercent)}%)</dt><dd>${formatMoney(amounts.platformFee)}</dd></div>
      <div><dt>Penghasilan tutor</dt><dd>${formatMoney(amounts.tutorEarnings)}</dd></div>
      <div class="fee-total"><dt>Total dibayar siswa</dt><dd>${formatMoney(amounts.studentTotal)}</dd></div>
    </dl>
  `;
}

function canAccessBooking(booking) {
  const account = currentAccount();

  if (!booking || !account) return false;
  if (state.currentRole === "admin") return true;
  if (state.currentRole === "student") {
    return booking.studentEmail === account.email;
  }
  return state.currentRole === "tutor" && booking.tutorEmail === account.email;
}

async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  let body = options.body;

  if (state.apiToken) headers.set("Authorization", `Bearer ${state.apiToken}`);
  if (body !== undefined && typeof body !== "string") {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  const response = await fetch(path, { ...options, headers, body });
  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json") ? await response.json() : await response.blob();

  if (!response.ok) {
    throw new Error(result.error || "Permintaan tidak dapat diproses.");
  }

  return result;
}

async function refreshApiState() {
  const snapshot = await apiRequest("/api/bootstrap");
  state.currentRole = snapshot.account.role;
  state.accounts[snapshot.account.role] = snapshot.account;
  state.platformSettings = snapshot.platformSettings;
  state.bookings = snapshot.bookings;
  saveState();
  return snapshot;
}

function replaceBooking(booking) {
  const index = state.bookings.findIndex((item) => item.id === booking.id);
  if (index < 0) state.bookings.unshift(booking);
  else state.bookings[index] = booking;
}

function formatTimestamp(value) {
  if (!value) return "Belum tersedia";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Belum tersedia";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}
