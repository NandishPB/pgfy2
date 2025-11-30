# PGfy — Lightweight Hotel Booking UI (Frontend + Backend)

This repository contains a simple hotel booking backend (Node/Express + Postgres) and a modern React frontend (Vite + React + Tailwind).

The project is scaffolded to demonstrate a minimal booking flow: user signup/signin, hotels listing, hotel detail and booking creation, downloadable PDF receipts, and a user profile with booking history.

## Repository structure

- `backend/` — Express API server
  - `server.js` — app entry
  - `routes/` — API routes (`/auth`, `/hotels`, `/bookings`, `/users`)
  - `models/db.js` — Postgres client wrapper
  - `middleware/auth.js` — JWT auth helpers
- `database/` — SQL table creation and `seed_data.sql` with sample users, hotels and bookings
- `frontend/` — Vite + React app with Tailwind CSS
  - `src/` — React app source
	 - `pages/` — pages (Landing, Auth, Hotels, HotelDetail, Profile, Bookings, About)
	 - `components/` — small components (HotelCard, ProtectedRoute)
	 - `context/AuthContext.jsx` — auth state + token handling
	 - `api.js` — axios instance (default: `http://localhost:4000`)

## High-level data flow

1. Frontend calls backend REST API (`/auth`, `/hotels`, `/bookings`, `/users`) using `src/api.js`.
2. Authentication:
	- `POST /auth/signup` — create user (express-validator checks). On success, frontend auto-signs-in.
	- `POST /auth/signin` — returns a JWT token and basic user info. Frontend stores the token in `localStorage` and sets the Authorization header for subsequent requests.
3. Hotels:
	- `GET /hotels` — list hotels (supports `q` and `city` filters).
	- `GET /hotels/:id` — hotel detail used by the booking form.
4. Bookings:
	- `POST /bookings` — protected; create a booking record tied to the authenticated user.
	- `GET /bookings/my` — protected; returns bookings for the logged-in user.
	- `GET /bookings/:id/receipt` — protected; returns a generated PDF receipt (Content-Type: application/pdf).
5. Users:
	- `GET /users/me` — protected; fetch current user's profile.
	- `PUT /users/me` — protected; update profile fields.

## What I implemented (summary)

- Frontend scaffold: Vite + React + Tailwind with a responsive layout inspired by goibibo.
- Auth flow: Sign up (with extra fields), sign in, token storage in `localStorage`, `AuthContext` to manage auth state.
- Hotels: Listing and detail page with a booking form that posts to `/bookings`.
- Bookings: My Bookings page and PDF receipt download via `/bookings/:id/receipt`.
- Profile: View & edit `GET/PUT /users/me` (protected route).
- UI polish: brand color, Inter font, responsive header with mobile menu, hotel cards with image placeholders.

## Setup & Run (local)

Prerequisites: Node.js, npm, Postgres.

1. Backend

```powershell
cd backend
npm install
# configure .env with POSTGRES connection (if needed)
node server.js
```

By default the backend listens on `http://localhost:4000`.

2. Database

- Create Postgres DB and run scripts in `database/` to create tables and seed sample data.

3. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the dev URL (e.g., `http://localhost:5173`). The frontend expects the backend at `http://localhost:4000` by default — set `VITE_API_URL` to override.

## Notes & Next Steps

- Security: tokens are stored in `localStorage` for simplicity. For production, use httpOnly cookies and CSRF protections.
- Images: hotel images are placeholders in `frontend/src/assets`. You can extend the `hotels` table to include image URLs and render them.
- Accessibility: mobile menu should have focus trapping for better keyboard support (can be implemented next).

If you want, I can:
- Add field-level mapping for backend validation errors to the signup form.
- Improve visuals further (icons, real images) and fully match goibibo's UI.

---

