# PGfy Frontend

This is a Vite + React frontend scaffold for PGfy.

Setup (PowerShell):

```powershell
cd frontend
npm install
npm run dev
```

Notes:
- The backend is expected to run at `http://localhost:3000` by default. We'll make the base URL configurable later.
- Tailwind CSS is configured via `tailwind.config.cjs` and `postcss.config.cjs`.
- Next steps: implement auth flows, integrate `/hotels`, `/bookings` and receipt download.
