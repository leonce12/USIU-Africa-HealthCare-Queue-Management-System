const express = require("express");
const { getState, persist, ROOMS_BY_DEPARTMENT } = require("../db");

const router = express.Router();

function snapshot(state, dept) {
  const active = state.tickets
    .filter((t) => t.departmentId === dept.id && ["waiting", "called", "in-service"].includes(t.status))
    .sort((a, b) => a.createdAt - b.createdAt);

  return {
    ...dept,
    waiting: active.filter((t) => t.status === "waiting"),
    called: active.filter((t) => t.status === "called"),
    inService: active.filter((t) => t.status === "in-service"),
  };
}

router.get("/queues", (req, res) => {
  const state = getState();
  res.json(state.departments.map((d) => snapshot(state, d)));
});

router.get("/rooms", (req, res) => {
  const state = getState();
  res.json(
    state.departments.map((d) => {
      const busy = new Set(
        state.tickets.filter((t) => t.status === "in-service" && t.departmentId === d.id).map((t) => t.room)
      );
      return {
        departmentId: d.id,
        rooms: (ROOMS_BY_DEPARTMENT[d.id] || []).map((room) => ({ room, occupied: busy.has(room) })),
      };
    })
  );
});

router.post("/call", (req, res) => {
  const { departmentId } = req.body;
  const state = getState();
  const next = state.tickets
    .filter((t) => t.departmentId === departmentId && t.status === "waiting")
    .sort((a, b) => a.createdAt - b.createdAt)[0];

  if (!next) return res.status(404).json({ error: "No students waiting in this department" });
  next.status = "called";
  persist();
  res.json(next);
});

router.post("/assign-room", (req, res) => {
  const { ticketId, room } = req.body;
  const state = getState();
  const ticket = state.tickets.find((t) => t.id === ticketId);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  const validRooms = ROOMS_BY_DEPARTMENT[ticket.departmentId] || [];
  if (!validRooms.includes(room)) {
    return res.status(400).json({ error: "Not a recognized room for this department" });
  }
  const taken = state.tickets.some(
    (t) => t.status === "in-service" && t.departmentId === ticket.departmentId && t.room === room
  );
  if (taken) return res.status(409).json({ error: `${room} is already occupied` });

  ticket.status = "in-service";
  ticket.room = room;
  persist();
  res.json(ticket);
});

router.post("/complete", (req, res) => {
  const state = getState();
  const ticket = state.tickets.find((t) => t.id === req.body.ticketId);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  ticket.status = "done";
  persist();
  res.json({ ok: true });
});

module.exports = router;
