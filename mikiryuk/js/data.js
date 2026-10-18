/* Static data and app-wide constants */

const STORAGE_KEY = "mikiryuk-app-v1";

const DEFAULT_PLATFORM_SETTINGS = {
  minimumSessionPrice: 50000,
  platformFeePercent: 10
};

const DEFAULT_STATE = {
  currentRole: null,
  apiToken: null,
  accounts: {},
  bookings: [],
  favorites: [],
  requests: [],
  appliedJobs: [],
  platformSettings: { ...DEFAULT_PLATFORM_SETTINGS }
};

const TUTORS = [
  {
    id: "nadia",
    name: "Nadia Putri",
    initials: "NP",
    subject: "Matematika",
    levels: "SMP & SMA",
    modes: ["Online", "Offline"],
    city: "Jakarta Selatan",
    rating: 4.9,
    reviews: 128,
    rate: 85000,
    badge: "Favorit",
    color: "coral",
    bio: "Membantu siswa memahami konsep matematika dengan contoh yang sederhana dan latihan bertahap.",
    tags: ["Integral", "Aljabar", "UTBK"]
  },
  {
    id: "raka",
    name: "Raka Aditya",
    initials: "RA",
    subject: "Bahasa Inggris",
    levels: "SD hingga SMA",
    modes: ["Online"],
    city: "Bandung",
    rating: 4.8,
    reviews: 96,
    rate: 70000,
    badge: "Populer",
    color: "mint",
    bio: "Fokus pada speaking, grammar, dan persiapan IELTS dengan pendekatan yang komunikatif.",
    tags: ["Speaking", "IELTS", "Grammar"]
  },
  {
    id: "salsa",
    name: "Salsa Nurhaliza",
    initials: "SN",
    subject: "Bahasa Indonesia",
    levels: "SMP & SMA",
    modes: ["Online", "Offline"],
    city: "Yogyakarta",
    rating: 5.0,
    reviews: 74,
    rate: 65000,
    badge: "Rating tinggi",
    color: "purple",
    bio: "Membantu siswa menulis lebih terstruktur, percaya diri, dan lebih berani menyampaikan pendapat.",
    tags: ["Menulis", "Literasi", "Presentasi"]
  },
  {
    id: "dimas",
    name: "Dimas Alfarizi",
    initials: "DA",
    subject: "IPA",
    levels: "SMP",
    modes: ["Online", "Offline"],
    city: "Surabaya",
    rating: 4.9,
    reviews: 112,
    rate: 75000,
    badge: "Tersedia",
    color: "yellow",
    bio: "Mengubah konsep sains yang abstrak menjadi penjelasan yang mudah dipahami dan menyenangkan.",
    tags: ["Fisika", "Biologi", "IPA"]
  },
  {
    id: "maya",
    name: "Maya Lestari",
    initials: "ML",
    subject: "Informatika",
    levels: "SMP hingga Kuliah",
    modes: ["Online"],
    city: "Jakarta Utara",
    rating: 4.8,
    reviews: 83,
    rate: 90000,
    badge: "Kode",
    color: "purple",
    bio: "Membantu siswa memahami coding, teknologi, dan keterampilan digital untuk proyek sekolah maupun masa depan.",
    tags: ["Python", "HTML", "Logika"]
  },
  {
    id: "fajar",
    name: "Fajar Pratama",
    initials: "FP",
    subject: "Persiapan Tes",
    levels: "SMA",
    modes: ["Online", "Offline"],
    city: "Medan",
    rating: 4.9,
    reviews: 141,
    rate: 95000,
    badge: "Sangat diminati",
    color: "coral",
    bio: "Membantu siswa menyusun strategi belajar dan persiapan ujian dengan target yang terukur.",
    tags: ["UTBK", "Tes Akademik", "SNBT"]
  }
];

const JOBS = [
  {
    id: "job-matematika",
    title: "Tutor Matematika SMA",
    category: "Matematika",
    level: "SMA",
    mode: "Online / Offline",
    salary: "Rp80.000–Rp120.000/sesi",
    icon: "∑"
  },
  {
    id: "job-inggris",
    title: "Tutor Bahasa Inggris",
    category: "Bahasa Inggris",
    level: "SD hingga SMA",
    mode: "Online",
    salary: "Rp60.000–Rp95.000/sesi",
    icon: "EN"
  },
  {
    id: "job-ipa",
    title: "Tutor IPA SMP",
    category: "IPA",
    level: "SMP",
    mode: "Online / Offline",
    salary: "Rp65.000–Rp100.000/sesi",
    icon: "⚛"
  }
];

const filters = {
  search: "",
  subject: "",
  mode: "",
  maxPrice: 150000
};
