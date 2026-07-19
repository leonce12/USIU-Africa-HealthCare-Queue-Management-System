# USIU-Africa Health Centre — Queue Desk

Working prototype: students join a digital queue for a clinic department and track
their status live; staff call the next student and assign them to a room.

- **Backend:** Node + Express, data in a local JSON file (`backend/data/db.json`) — no database install needed.
- **Frontend:** React (Vite), polling every 4 seconds for live updates.

## Setup

1. Add your images to `frontend/public/`: `usiu-logo.png` and `login-image.jpg`.
2. Terminal 1:
   ```
   cd backend
   npm install
   npm run dev
   ```
3. Terminal 2:
   ```
   cd frontend
   npm install
   npm run dev
   ```
4. Open http://localhost:5173

## Demo accounts

- Student: `sleonce@usiu.ac.ke` / `student123`
- Staff: `staff1` / `clinic123`

## Departments & rooms

Edit `backend/src/db.js` — `DEPARTMENTS` and `ROOMS_BY_DEPARTMENT` — to change department
names or room counts. Restart the backend and delete `backend/data/db.json` after
changing the department list, so old data doesn't linger.

## Notes

- Student accounts are restricted to `@usiu.ac.ke` emails (checked server-side).
- Passwords are salted and hashed, not stored in plain text.
- This is a prototype: auth is simulated (not real university SSO), and rooms/queues
  reset if you delete `db.json`.
