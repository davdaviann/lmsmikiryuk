/* App state persisted in localStorage */

let state = loadState();

let toastTimer;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

    if (!saved || typeof saved !== "object") {
      return { ...DEFAULT_STATE };
    }

    return {
      ...DEFAULT_STATE,
      ...saved,
      accounts: saved.accounts || {},
      bookings: Array.isArray(saved.bookings) ? saved.bookings : [],
      favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
      requests: Array.isArray(saved.requests) ? saved.requests : [],
      appliedJobs: Array.isArray(saved.appliedJobs) ? saved.appliedJobs : [],
      platformSettings: {
        ...DEFAULT_PLATFORM_SETTINGS,
        ...(saved.platformSettings || {})
      }
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Prototype tetap berjalan jika localStorage tidak tersedia.
  }
}

function currentAccount() {
  if (!state.currentRole) {
    return null;
  }

  return state.accounts[state.currentRole] || null;
}
