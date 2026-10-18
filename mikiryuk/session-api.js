const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const DATA_DIRECTORY = process.env.MIKIRYUK_DATA_DIR || path.join(__dirname, ".data");
const DATABASE_FILE = path.join(DATA_DIRECTORY, "mikiryuk.json");
const UPLOAD_DIRECTORY = path.join(DATA_DIRECTORY, "session-files");
const DEFAULT_SETTINGS = { minimumSessionPrice: 50000, platformFeePercent: 10 };
const SESSION_TUTORS = {
  nadia: { name: "Nadia Putri", subject: "Matematika", price: 85000 },
  raka: { name: "Raka Aditya", subject: "Bahasa Inggris", price: 70000 },
  salsa: { name: "Salsa Nurhaliza", subject: "Bahasa Indonesia", price: 65000 },
  dimas: { name: "Dimas Alfarizi", subject: "IPA", price: 75000 },
  maya: { name: "Maya Lestari", subject: "Informatika", price: 90000 },
  fajar: { name: "Fajar Pratama", subject: "Persiapan Tes", price: 95000 }
};
const ALLOWED_FILE_TYPES = {
  ".png": ["image/png"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".gif": ["image/gif"],
  ".webp": ["image/webp"],
  ".mp4": ["video/mp4"],
  ".webm": ["video/webm"],
  ".mov": ["video/quicktime"],
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword", "application/octet-stream"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/octet-stream"],
  ".ppt": ["application/vnd.ms-powerpoint", "application/octet-stream"],
  ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/octet-stream"],
  ".txt": ["text/plain"],
  ".zip": ["application/zip", "application/x-zip-compressed", "application/octet-stream"]
};
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_UPLOAD_BODY = 14 * 1024 * 1024;

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function today() {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function newDatabase() {
  return {
    tokenSecret: crypto.randomBytes(32).toString("hex"),
    accounts: [],
    bookings: [],
    platformSettings: { ...DEFAULT_SETTINGS }
  };
}

function persist(database) {
  fs.mkdirSync(DATA_DIRECTORY, { recursive: true });
  const temporaryFile = `${DATABASE_FILE}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(database, null, 2));
  fs.renameSync(temporaryFile, DATABASE_FILE);
}

function getDatabase() {
  fs.mkdirSync(DATA_DIRECTORY, { recursive: true });
  let database;

  try {
    database = JSON.parse(fs.readFileSync(DATABASE_FILE, "utf8"));
  } catch {
    database = newDatabase();
  }

  database.accounts = Array.isArray(database.accounts) ? database.accounts : [];
  database.bookings = Array.isArray(database.bookings) ? database.bookings : [];
  database.platformSettings = {
    ...DEFAULT_SETTINGS,
    ...(database.platformSettings || {})
  };
  database.tokenSecret ||= crypto.randomBytes(32).toString("hex");

  const demoAccounts = [
    { role: "admin", name: "Admin MikirYuk", email: "admin@demo.mikiryuk.id" },
    { role: "student", name: "Aulia Putri", email: "aulia@demo.mikiryuk.id", level: "SMA", goal: "Meningkatkan nilai matematika dan memahami konsep IPA." },
    { role: "tutor", name: "Nadia Putri", email: "nadia@demo.mikiryuk.id", subject: "Matematika", rate: 85000 }
  ];

  for (const demo of demoAccounts) {
    if (!database.accounts.some((account) => account.role === demo.role && account.email === demo.email)) {
      database.accounts.push({ ...demo, passwordHash: null, createdAt: new Date().toISOString() });
    }
  }

  if (!database.bookings.some((booking) => String(booking.id).startsWith("demo-session-"))) {
    const now = Date.now();
    const price = 85000;
    const platformFee = Math.round(price * database.platformSettings.platformFeePercent / 100);
    const common = {
      tutorId: "nadia",
      tutorEmail: "nadia@demo.mikiryuk.id",
      studentEmail: "aulia@demo.mikiryuk.id",
      studentName: "Aulia Putri",
      tutorName: "Nadia Putri",
      subject: "Matematika",
      price,
      platformFeePercent: database.platformSettings.platformFeePercent,
      platformFee,
      tutorEarnings: price - platformFee,
      studentTotal: price,
      time: "16:00",
      note: "Sesi demo",
      documents: []
    };
    const dateOffset = (days) => new Date(now + days * 86400000).toISOString().slice(0, 10);

    database.bookings.unshift(
      {
        ...common,
        id: "demo-session-progress",
        date: dateOffset(0),
        status: "Berlangsung",
        startedAt: new Date(now - 20 * 60000).toISOString(),
        createdAt: new Date(now - 60 * 60000).toISOString()
      },
      {
        ...common,
        id: "demo-session-completed",
        date: dateOffset(-1),
        status: "Selesai",
        startedAt: new Date(now - 2 * 3600000).toISOString(),
        completedAt: new Date(now - 3600000).toISOString(),
        durationMinutes: 60,
        createdAt: new Date(now - 3 * 3600000).toISOString()
      }
    );
  }

  persist(database);
  return database;
}

function jsonResponse(response, status, value) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(value));
}

function readJson(request, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        if (!tooLarge) reject(new ApiError(413, "Ukuran data terlalu besar."));
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      if (tooLarge) return;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(new ApiError(400, "Format data tidak valid."));
      }
    });
    request.on("error", (error) => {
      if (!tooLarge) reject(error);
    });
  });
}

function signToken(payload, secret) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function authenticate(request, database) {
  const token = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const [encoded, signature] = token.split(".");

  if (!encoded || !signature) throw new ApiError(401, "Masuk kembali untuk melanjutkan.");

  const expected = crypto.createHmac("sha256", database.tokenSecret).update(encoded).digest();
  let actual;
  try {
    actual = Buffer.from(signature, "base64url");
  } catch {
    throw new ApiError(401, "Sesi masuk tidak valid.");
  }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    throw new ApiError(401, "Sesi masuk tidak valid.");
  }

  let identity;
  try {
    identity = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    throw new ApiError(401, "Sesi masuk tidak valid.");
  }
  if (identity.exp < Date.now()) throw new ApiError(401, "Sesi masuk kedaluwarsa. Masuk kembali.");
  const account = database.accounts.find((item) => item.role === identity.role && item.email === identity.email);
  if (!account) throw new ApiError(401, "Akun sesi tidak ditemukan.");
  return account;
}

function issueToken(account, database) {
  return signToken({ role: account.role, email: account.email, exp: Date.now() + 7 * 86400000 }, database.tokenSecret);
}

function publicAccount(account) {
  const { passwordHash, ...safeAccount } = account;
  return safeAccount;
}

function visibleBookings(database, account) {
  if (account.role === "admin") return database.bookings;
  return database.bookings.filter((booking) => account.role === "student"
    ? booking.studentEmail === account.email
    : booking.tutorEmail === account.email);
}

function requireBooking(database, bookingId, account) {
  const booking = database.bookings.find((item) => item.id === bookingId);
  if (!booking) throw new ApiError(404, "Sesi tidak ditemukan.");
  const allowed = account.role === "admin"
    || (account.role === "student" && booking.studentEmail === account.email)
    || (account.role === "tutor" && booking.tutorEmail === account.email);
  if (!allowed) throw new ApiError(403, "Kamu tidak memiliki akses ke sesi ini.");
  return booking;
}

function sessionAmounts(price, feePercent) {
  const platformFee = Math.round(price * feePercent / 100);
  return { price, platformFeePercent: feePercent, platformFee, tutorEarnings: price - platformFee, studentTotal: price };
}

function storeBooking(database, booking) {
  const index = database.bookings.findIndex((item) => item.id === booking.id);
  if (index < 0) database.bookings.unshift(booking);
  else database.bookings[index] = booking;
  persist(database);
}

function safeFileName(name) {
  return path.basename(String(name || "file")).replace(/[\r\n"\\]/g, "_").slice(0, 180);
}

function hasValidFileSignature(extension, buffer) {
  const startsWith = (...bytes) => bytes.every((byte, index) => buffer[index] === byte);
  const asciiAt = (value, offset = 0) => buffer.toString("ascii", offset, offset + value.length) === value;

  if (extension === ".png") return startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  if ([".jpg", ".jpeg"].includes(extension)) return startsWith(0xff, 0xd8, 0xff);
  if (extension === ".gif") return asciiAt("GIF87a") || asciiAt("GIF89a");
  if (extension === ".webp") return asciiAt("RIFF") && asciiAt("WEBP", 8);
  if (extension === ".pdf") return asciiAt("%PDF-");
  if ([".doc", ".ppt"].includes(extension)) return startsWith(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
  if ([".docx", ".pptx", ".zip"].includes(extension)) {
    return (asciiAt("PK\u0003\u0004") || asciiAt("PK\u0005\u0006") || asciiAt("PK\u0007\u0008"));
  }
  if ([".mp4", ".mov"].includes(extension)) return asciiAt("ftyp", 4);
  if (extension === ".webm") return startsWith(0x1a, 0x45, 0xdf, 0xa3);
  if (extension === ".txt") return !buffer.includes(0) && Buffer.from(buffer.toString("utf8"), "utf8").equals(buffer);
  return false;
}

async function handleSessionApi(request, response) {
  const url = new URL(request.url, "http://localhost");
  if (!url.pathname.startsWith("/api/")) return false;

  try {
    const database = getDatabase();
    const route = url.pathname;

    if (request.method === "POST" && route === "/api/auth/demo") {
      const body = await readJson(request);
      const role = String(body.role || "");
      const account = database.accounts.find((item) => item.role === role && item.email.endsWith("@demo.mikiryuk.id"));
      if (!account) throw new ApiError(400, "Jenis akun demo tidak valid.");
      return jsonResponse(response, 200, { token: issueToken(account, database), account: publicAccount(account) }), true;
    }

    if (request.method === "POST" && route === "/api/auth/register") {
      const body = await readJson(request);
      const role = String(body.role || "");
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!["student", "tutor"].includes(role) || !name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
        throw new ApiError(400, "Periksa nama, email, jenis akun, dan password (minimal 6 karakter).");
      }
      if (database.accounts.some((item) => item.role === role && item.email === email)) {
        throw new ApiError(409, "Email sudah terdaftar untuk jenis akun ini. Silakan masuk.");
      }
      const profile = { ...body };
      delete profile.password;
      delete profile.terms;
      delete profile.role;
      if (role === "tutor") {
        const rate = Number(profile.rate);
        if (!Number.isFinite(rate) || rate < database.platformSettings.minimumSessionPrice) {
          throw new ApiError(400, `Tarif minimum per sesi adalah Rp${database.platformSettings.minimumSessionPrice.toLocaleString("id-ID")}.`);
        }
        profile.rate = rate;
      }
      const salt = crypto.randomBytes(16).toString("hex");
      const account = {
        ...profile,
        role,
        name,
        email,
        passwordHash: `${salt}:${crypto.scryptSync(password, salt, 32).toString("hex")}`,
        createdAt: new Date().toISOString()
      };
      database.accounts.push(account);
      persist(database);
      return jsonResponse(response, 201, { token: issueToken(account, database), account: publicAccount(account) }), true;
    }

    if (request.method === "POST" && route === "/api/auth/login") {
      const body = await readJson(request);
      const role = String(body.role || "");
      const email = String(body.email || "").trim().toLowerCase();
      const account = database.accounts.find((item) => item.role === role && item.email === email && item.passwordHash);
      const [salt, storedHash] = String(account?.passwordHash || ":").split(":");
      const suppliedHash = salt ? crypto.scryptSync(String(body.password || ""), salt, 32).toString("hex") : "";
      const valid = storedHash && suppliedHash && storedHash.length === suppliedHash.length
        && crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(suppliedHash));
      if (!valid) throw new ApiError(401, "Email atau password tidak cocok.");
      return jsonResponse(response, 200, { token: issueToken(account, database), account: publicAccount(account) }), true;
    }

    const account = authenticate(request, database);

    if (request.method === "GET" && route === "/api/bootstrap") {
      return jsonResponse(response, 200, {
        account: publicAccount(account),
        platformSettings: database.platformSettings,
        bookings: visibleBookings(database, account)
      }), true;
    }

    if (request.method === "PUT" && route === "/api/profile") {
      const body = await readJson(request);
      const name = String(body.name || "").trim();
      if (!name) throw new ApiError(400, "Nama wajib diisi.");
      if (account.role === "tutor") {
        const rate = Number(body.rate);
        if (!Number.isFinite(rate) || rate < database.platformSettings.minimumSessionPrice) {
          throw new ApiError(400, "Tarif tutor di bawah batas minimum.");
        }
      }
      for (const [key, value] of Object.entries(body)) {
        if (["password", "passwordHash", "email", "role", "terms"].includes(key)) continue;
        account[key] = value;
      }
      persist(database);
      return jsonResponse(response, 200, { account: publicAccount(account) }), true;
    }

    if (request.method === "PUT" && route === "/api/platform-settings") {
      if (account.role !== "admin") throw new ApiError(403, "Hanya administrator yang dapat mengubah pengaturan platform.");
      const body = await readJson(request);
      const minimumSessionPrice = Number(body.minimumSessionPrice);
      const platformFeePercent = Number(body.platformFeePercent);
      if (!Number.isFinite(minimumSessionPrice) || minimumSessionPrice < 1
        || !Number.isFinite(platformFeePercent) || platformFeePercent < 0 || platformFeePercent > 100) {
        throw new ApiError(400, "Tarif minimum harus positif dan biaya platform berada di antara 0% dan 100%.");
      }
      database.platformSettings = { minimumSessionPrice, platformFeePercent };
      persist(database);
      return jsonResponse(response, 200, { platformSettings: database.platformSettings }), true;
    }

    if (request.method === "POST" && route === "/api/bookings") {
      if (account.role !== "student") throw new ApiError(403, "Hanya siswa yang dapat memesan sesi.");
      const body = await readJson(request);
      const tutor = SESSION_TUTORS[String(body.tutorId || "")];
      const date = String(body.date || "");
      const time = String(body.time || "");
      const dateValue = new Date(`${date}T00:00:00.000Z`);
      const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
        && Number.isFinite(dateValue.getTime())
        && dateValue.toISOString().slice(0, 10) === date;
      if (!tutor || !validDate || date < today() || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
        throw new ApiError(400, "Tutor, tanggal, atau waktu sesi tidak valid.");
      }
      if (tutor.price < database.platformSettings.minimumSessionPrice) {
        throw new ApiError(400, "Tarif tutor belum memenuhi tarif minimum platform.");
      }
      const amounts = sessionAmounts(tutor.price, database.platformSettings.platformFeePercent);
      const booking = {
        id: `booking-${crypto.randomUUID()}`,
        tutorId: String(body.tutorId),
        tutorEmail: `${body.tutorId}@demo.mikiryuk.id`,
        tutorName: tutor.name,
        studentEmail: account.email,
        studentName: account.name,
        subject: tutor.subject,
        date,
        time,
        note: String(body.note || "").trim().slice(0, 2000),
        status: "Terjadwal",
        ...amounts,
        createdAt: new Date().toISOString(),
        documents: []
      };
      storeBooking(database, booking);
      return jsonResponse(response, 201, { booking }), true;
    }

    const bookingRoute = route.match(/^\/api\/bookings\/([^/]+)(?:\/(start|complete|review|documents(?:\/([^/]+))?))?$/);
    if (bookingRoute) {
      const bookingId = decodeURIComponent(bookingRoute[1]);
      const action = bookingRoute[2] || "";
      const documentId = bookingRoute[3];
      const booking = requireBooking(database, bookingId, account);

      if (request.method === "GET" && action === "documents" && documentId) {
        const document = (booking.documents || []).find((file) => file.id === documentId);
        if (!document) throw new ApiError(404, "Dokumentasi tidak ditemukan.");
        const filePath = path.join(UPLOAD_DIRECTORY, `${document.id}${path.extname(document.name).toLowerCase()}`);
        if (!filePath.startsWith(UPLOAD_DIRECTORY) || !fs.existsSync(filePath)) throw new ApiError(404, "File tidak ditemukan.");
        response.writeHead(200, {
          "Content-Type": document.type,
          "Content-Length": document.size,
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(document.name)}`,
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff"
        });
        fs.createReadStream(filePath).pipe(response);
        return true;
      }

      if (request.method === "POST" && action === "start") {
        if (account.role !== "tutor" || booking.tutorEmail !== account.email) throw new ApiError(403, "Hanya tutor sesi ini yang dapat memulainya.");
        if (!["Terjadwal", "Menunggu konfirmasi"].includes(booking.status)) throw new ApiError(409, "Sesi ini tidak dapat dimulai.");
        booking.status = "Berlangsung";
        booking.startedAt = new Date().toISOString();
        storeBooking(database, booking);
        return jsonResponse(response, 200, { booking }), true;
      }

      if (request.method === "POST" && action === "complete") {
        if (account.role !== "tutor" || booking.tutorEmail !== account.email) throw new ApiError(403, "Hanya tutor sesi ini yang dapat menyelesaikannya.");
        const body = await readJson(request);
        if (body.confirmed !== true) throw new ApiError(400, "Konfirmasi penyelesaian sesi diperlukan.");
        if (booking.status !== "Berlangsung") throw new ApiError(409, "Mulai sesi sebelum menandainya selesai.");
        const completedAt = new Date();
        const startedAt = new Date(booking.startedAt || completedAt);
        booking.status = "Selesai";
        booking.completedAt = completedAt.toISOString();
        booking.durationMinutes = Math.max(1, Math.round((completedAt - startedAt) / 60000));
        storeBooking(database, booking);
        return jsonResponse(response, 200, { booking }), true;
      }

      if (request.method === "POST" && action === "review") {
        if (account.role !== "student" || booking.studentEmail !== account.email) throw new ApiError(403, "Hanya siswa pada sesi ini yang dapat memberi ulasan.");
        const body = await readJson(request);
        const rating = Number(body.rating);
        if (booking.status !== "Selesai") throw new ApiError(409, "Ulasan tersedia setelah sesi selesai.");
        if (booking.review) throw new ApiError(409, "Ulasan untuk sesi ini sudah pernah dikirim.");
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new ApiError(400, "Pilih rating antara 1 dan 5 bintang.");
        booking.review = {
          rating,
          comment: String(body.comment || "").trim().slice(0, 2000),
          studentEmail: account.email,
          submittedAt: new Date().toISOString()
        };
        storeBooking(database, booking);
        return jsonResponse(response, 201, { booking }), true;
      }

      if (request.method === "POST" && action === "documents") {
        const body = await readJson(request, MAX_UPLOAD_BODY);
        if (booking.status !== "Selesai") throw new ApiError(409, "Dokumentasi hanya tersedia setelah sesi selesai.");
        if (!Array.isArray(body.files) || body.files.length < 1 || body.files.length > 5) {
          throw new ApiError(400, "Pilih 1 sampai 5 file untuk diunggah.");
        }
        fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
        const uploadedAt = new Date().toISOString();
        const preparedFiles = body.files.map((file) => {
          const name = safeFileName(file.name);
          const extension = path.extname(name).toLowerCase();
          const mimeType = String(file.type || "application/octet-stream").toLowerCase();
          const data = String(file.dataBase64 || "");
          if (!ALLOWED_FILE_TYPES[extension] || !ALLOWED_FILE_TYPES[extension].includes(mimeType)
            || !/^[A-Za-z0-9+/]*={0,2}$/.test(data)) {
            throw new ApiError(400, `Jenis file tidak diizinkan: ${name}`);
          }
          const buffer = Buffer.from(data, "base64");
          if (!buffer.length || buffer.length > MAX_FILE_SIZE) throw new ApiError(400, `${name}: ukuran file harus di bawah 2 MB.`);
          if (!hasValidFileSignature(extension, buffer)) throw new ApiError(400, `Isi file tidak sesuai dengan jenis ${extension}.`);
          const id = crypto.randomUUID();
          return {
            id,
            extension,
            buffer,
            document: { id, name, type: mimeType, size: buffer.length, uploadedAt, uploadedBy: account.name, uploadedByEmail: account.email }
          };
        });
        for (const file of preparedFiles) {
          fs.writeFileSync(path.join(UPLOAD_DIRECTORY, `${file.id}${file.extension}`), file.buffer, { flag: "wx" });
        }
        const documents = preparedFiles.map((file) => file.document);
        booking.documents = [...(booking.documents || []), ...documents];
        storeBooking(database, booking);
        return jsonResponse(response, 201, { booking }), true;
      }
    }

    throw new ApiError(404, "Endpoint tidak ditemukan.");
  } catch (error) {
    if (response.headersSent || response.destroyed) return true;
    const status = error instanceof ApiError ? error.status : 500;
    if (status === 500) console.error("Session API error:", error);
    jsonResponse(response, status, { error: error.message || "Terjadi kesalahan pada server." });
    return true;
  }
}

module.exports = { handleSessionApi };