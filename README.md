# USIU-Africa Health Centre — Queue Desk

A web-based queue management system built for the USIU-Africa Health Centre, replacing
the manual, in-person queueing process with digital tickets, live wait-time tracking,
and a real-time dashboard for clinic staff.

Built as a mid-term project for APT 3065-UA, Summer 2026, USIU-Africa.

## The problem

Students visiting the Health Centre currently wait in a physical line with no visibility
into their position or expected wait time, which leads to overcrowding during peak hours
and adds administrative load for clinic staff who have to track and call patients
manually. This project addresses that gap: students join a queue remotely and watch
their position update live, while staff manage the flow of patients across departments
from a single dashboard.

## How it works

A student signs in with their university email, selects the department they need, and
receives a digital ticket showing their position in line and an estimated wait time.
They can track this from anywhere without standing at the reception desk. On the other
side, clinic staff see every department's queue update live, call the next student
forward, and assign them to one of that department's available consultation rooms.
Both views refresh automatically every few seconds, so nobody needs to manually reload
the page to see what's changed.

Access is restricted at the server level to university email addresses ending in
`@usiu.ac.ke`, and passwords are salted and hashed rather than stored as plain text.
Each department has its own fixed set of consultation rooms, and the system prevents two
students from ever being assigned to the same room at the same time.

The whole system runs without a database. Data is kept in a simple JSON file on disk,
which was a deliberate choice for a project built by a small student team on a fixed
semester timeline: it means anyone can clone the project and have it running in minutes,
with nothing extra to install or configure.

## Built with

The frontend is a React application built with Vite. The backend is a small Node.js and
Express API. Styling is handwritten CSS built around a small set of shared design
tokens, rather than a component library, so the interface stays lightweight.

## Running it locally

Add your own logo and login image to `frontend/public/`, named `usiu-logo.png` and
`login-image.jpg`.

Start the backend first:

```
cd backend
npm install
npm run dev
```

Then, in a second terminal, start the frontend:

```
cd frontend
npm install
npm run dev
```

Once both are running, open `http://localhost:5173` in a browser.

A demo student account is seeded automatically: `sleonce@usiu.ac.ke`, password
`student123`. A demo staff account is also available: staff ID `staff1`, password
`clinic123`.

## Departments

The clinic is organized into five departments — General Medicine, Dental, Pharmacy,
Laboratory, and Physiotherapy. General Medicine has four consultation rooms; the
remaining departments each have one. Department names and room counts can both be
changed in `backend/src/db.js`.

## Project layout

The backend lives under `backend/src`: `db.js` holds the department list, room
assignments, and seed data; `security.js` handles the email domain check and password
hashing; and the `routes` folder splits the API into authentication, student-facing
queue actions, and staff-facing queue management.

The frontend lives under `frontend/src`: `api.js` wraps every call to the backend,
`pages` holds the three main screens (login, student dashboard, staff dashboard), and
`components` holds the smaller reusable pieces — the ticket display, the department
picker, and the staff queue table.

## Scope

This is a working prototype rather than a production system. Authentication is
simulated through a restricted email domain rather than real university single sign-on,
there is no integration with medical records, billing, or insurance systems, and there
is no separate mobile application. Emergency cases continue to be handled directly by
clinic staff, outside the system entirely, exactly as they are today.

## Authors

Shyaka Leonce and Emmanuel Rukundo, for APT 3065-UA under Lecturer Patrick Wamuyu.
