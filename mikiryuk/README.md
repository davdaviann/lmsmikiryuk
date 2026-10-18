# MikirYuk

Interactive prototype for MikirYuk, a tutoring platform. The browser app uses
HTML, CSS, and vanilla JavaScript with a hash-based router; the included Node
server also provides the session, account, fee-settings, review, and document API.
There is no build step and no dependencies to install.

## Run locally

Pick whichever option you already have installed.

**Node.js (recommended)**

```bash
npm start
# or: node server.js
```

Then open <http://localhost:3000>. Use this Node server for registration, login,
bookings, session completion, reviews, and documentation. Use a different port
with `PORT=8080 npm start` (on Windows PowerShell: `$env:PORT=8080; npm start`).

**Static preview only**

```bash
python -m http.server 3000
```

Python's static server and opening `index.html` directly can preview pages, but
the account and session workflows require `npm start` because they use the API.

Double-clicking `index.html` also works, because the scripts are plain
(non-module) scripts.

> The Google Font (Plus Jakarta Sans) loads from the internet. Offline, the page
> still works and falls back to the system sans-serif font.

## Project structure

```
mikiryuk/
├── index.html          # Page shell (header, footer, mount points, script/style tags)
├── server.js           # Zero-dependency local dev server
├── session-api.js      # Authenticated session, fee, review, and upload API
├── package.json        # `npm start` script
├── assets/
│   └── favicon.svg
├── css/                # Loaded in this order (later files can override earlier ones)
│   ├── base.css        # Design tokens (:root vars), reset, container
│   ├── header.css      # Sticky header and navigation
│   ├── general.css     # Buttons, section titles, focus styles
│   ├── landing.css     # Home hero, service cards, CTA
│   ├── page-hero.css   # Banner used by inner pages
│   ├── tutors.css      # Tutor search, filters, tutor cards
│   ├── forms.css       # Registration forms
│   ├── jobs.css        # Job listings
│   ├── dashboard.css   # Student/tutor dashboards, auth gate
│   ├── modal.css       # Modals and toast
│   ├── footer.css
│   └── responsive.css  # Breakpoints and reduced-motion rules
└── js/                 # Loaded in this order (classic scripts share globals)
    ├── data.js         # TUTORS, JOBS, filters, default state
    ├── utils.js        # escapeHtml, formatMoney, formatDate, ...
    ├── state.js        # browser preferences + localStorage load/save
    ├── ui.js           # toast, header/nav, modal open/close
    ├── page-home.js
    ├── page-tutors.js
    ├── page-register.js
    ├── page-dashboard.js
    ├── page-jobs.js
    ├── modals.js       # login, account, tutor profile, booking
    ├── actions.js      # register/login/book/apply handlers, demo accounts
    ├── router.js       # go() and renderRoute()
    └── main.js         # global event listeners + first render
```

## Routes

| Hash               | Page                     |
| ------------------ | ------------------------ |
| `#beranda`         | Home                     |
| `#cari-tutor`      | Find a tutor             |
| `#lowongan`        | Tutor job listings       |
| `#daftar-siswa`    | Student registration     |
| `#daftar-tutor`    | Tutor registration       |
| `#dashboard-siswa` | Student dashboard        |
| `#dashboard-tutor` | Tutor dashboard          |
| `#masuk`           | Opens the login modal    |

## Notes

- Account and session records, fee settings, reviews, and attachment metadata
  are stored in `.data/mikiryuk.json`; private attachment bytes are in
  `.data/session-files/`. These paths are not served as static files.
- Favorites and other non-session prototype preferences remain in browser
  `localStorage` under `mikiryuk-app-v1`.
- Registration passwords are hashed with Node's `scrypt`. API tokens are signed
  and role-scoped; session mutation endpoints validate role and ownership.
- Use **Demo siswa / Demo tutor / Demo admin** in the login modal to try the
  dashboards. Demo login intentionally bypasses passwords for local testing.
- Tutor and job data lives in `js/data.js`.
- Script order in `index.html` matters. If you add a new JS file, load it
  before `main.js`.
- Use **Demo admin** to configure the minimum session price and platform fee.
  New bookings snapshot the fee and tutor earnings; changing settings does not
  alter existing sessions.
- Session reports show price, platform fee, tutor earnings, completion time,
  duration, documentation, and any student review. The student can submit one
  review after the tutor confirms completion.
- Session files are limited to five per upload and 2 MB each. Downloads require
  an authenticated session participant (or admin).
- No payment processor is connected. The displayed student total is the session
  price, and the platform fee is deducted from tutor earnings.
- This is a local prototype, not a production identity/payment service. Demo
  login is intentionally open; production deployment needs real account
  verification, token revocation, operational database backups, and malware
  scanning for uploaded files.
