const fs = require("fs");
const path = require("path");
const { hashPassword } = require("./security");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const DEPARTMENTS = [
  { id: "general", code: "GEN", name: "General Medicine" },
  { id: "dental", code: "DEN", name: "Dental" },
  { id: "pharmacy", code: "PHM", name: "Pharmacy" },
  { id: "laboratory", code: "LAB", name: "Laboratory" },
  { id: "physiotherapy", code: "PHY", name: "Physiotherapy" },
];

// Consultation rooms, per department. Edit freely to match real room names.
const ROOMS_BY_DEPARTMENT = {
  general: ["Room 1", "Room 2", "Room 3", "Room 4"],
  dental: ["Room 1"],
  pharmacy: ["Room 1"],
  laboratory: ["Room 1"],
  physiotherapy: ["Room 1"],
};

function seed() {
  return {
    departments: DEPARTMENTS,
    students: [
      { id: "669106", name: "Shyaka Leonce", email: "sleonce@usiu.ac.ke", ...hashPassword("student123") },
      { id: "668587", name: "Emmanuel Rukundo", email: "erukundo@usiu.ac.ke", ...hashPassword("student123") },
    ],
    staff: [
      { id: "staff1", name: "Front Desk", ...hashPassword("clinic123") },
      { id: "staff2", name: "Nurse Station", ...hashPassword("clinic123") },
    ],
    tickets: [],
    counters: DEPARTMENTS.reduce((acc, d) => ({ ...acc, [d.id]: 0 }), {}),
  };
}

let state;

function getState() {
  if (state) return state;
  if (fs.existsSync(DB_PATH)) {
    state = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } else {
    state = seed();
    persist();
  }
  return state;
}

function persist() {
  fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
}

module.exports = { getState, persist, DEPARTMENTS, ROOMS_BY_DEPARTMENT };
