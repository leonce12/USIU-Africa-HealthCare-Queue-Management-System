const express = require("express");
const crypto = require("crypto");
const { getState, persist } = require("../db");

const router = express.Router();
const ACTIVE = ["waiting", "called", "in-service"];

router.get("/departments", (req, res) => {
  const state = getState();
  res.json(
    state.departments.map((d) => ({
      ...d,
      waitingCount: state.tickets.filter((t) => t.departmentId === d.id && t.status === "waiting").length,
    }))
  );
});

router.post("/join", (req, res) => {
  const { studentId, departmentId } = req.body;
  const state = getState();

  const dept = state.departments.find((d) => d.id === departmentId);
  if (!dept) return res.status(404).json({ error: "Unknown department" });

  const student = state.students.find((s) => s.id === studentId);
  if (!student) return res.status(404).json({ error: "Unknown student" });

  if (state.tickets.some((t) => t.studentId === studentId && ACTIVE.includes(t.status))) {
    return res.status(409).json({ error: "You already have an active ticket" });
  }

  state.counters[departmentId] += 1;
  const ticket = {
    id: crypto.randomUUID(),
    number: `${dept.code}-${String(state.counters[departmentId]).padStart(3, "0")}`,
    departmentId,
    departmentName: dept.name,
    studentId,
    studentName: student.name,
    status: "waiting",
    room: null,
    createdAt: Date.now(),
  };
  state.tickets.push(ticket);
  persist();
  res.status(201).json(ticket);
});

router.get("/mine/:studentId", (req, res) => {
  const state = getState();
  const ticket = state.tickets.find((t) => t.studentId === req.params.studentId && ACTIVE.includes(t.status));
  if (!ticket) return res.json({ ticket: null });

  const position = state.tickets.filter(
    (t) => t.departmentId === ticket.departmentId && t.status === "waiting" && t.createdAt < ticket.createdAt
  ).length;

  res.json({
    ticket,
    position: ticket.status === "waiting" ? position : 0,
    estimatedWaitMinutes: ticket.status === "waiting" ? position * 8 : 0,
  });
});

router.post("/cancel", (req, res) => {
  const state = getState();
  const ticket = state.tickets.find((t) => t.id === req.body.ticketId);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  ticket.status = "cancelled";
  persist();
  res.json({ ok: true });
});

module.exports = router;
