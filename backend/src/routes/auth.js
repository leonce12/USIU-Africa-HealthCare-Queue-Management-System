const express = require("express");
const { getState, persist } = require("../db");
const { STUDENT_EMAIL_DOMAIN, isUsiuEmail, hashPassword, checkPassword } = require("../security");

const router = express.Router();

router.post("/student-register", (req, res) => {
  const { studentId, name, email, password } = req.body;
  if (!studentId || !name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!isUsiuEmail(email)) {
    return res.status(403).json({ error: `Only @${STUDENT_EMAIL_DOMAIN} emails can register` });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const state = getState();
  const email_lc = email.toLowerCase();
  if (state.students.some((s) => s.id === studentId || s.email === email_lc)) {
    return res.status(409).json({ error: "An account with that student ID or email already exists" });
  }

  const student = { id: studentId, name, email: email_lc, ...hashPassword(password) };
  state.students.push(student);
  persist();
  res.status(201).json({ id: student.id, name: student.name, email: student.email });
});

router.post("/student-login", (req, res) => {
  const { email, password } = req.body;
  if (!isUsiuEmail(email)) {
    return res.status(403).json({ error: `Only @${STUDENT_EMAIL_DOMAIN} emails can sign in` });
  }

  const state = getState();
  const student = state.students.find((s) => s.email === email.toLowerCase());
  if (!student || !checkPassword(password, student.salt, student.hash)) {
    return res.status(401).json({ error: "Incorrect email or password" });
  }
  res.json({ id: student.id, name: student.name, email: student.email });
});

router.post("/staff-login", (req, res) => {
  const { staffId, password } = req.body;
  const state = getState();
  const staff = state.staff.find((s) => s.id === staffId);
  if (!staff || !checkPassword(password, staff.salt, staff.hash)) {
    return res.status(401).json({ error: "Invalid staff ID or password" });
  }
  res.json({ id: staff.id, name: staff.name });
});

module.exports = router;
