async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  studentRegister: (studentId, name, email, password) =>
    request("/auth/student-register", { method: "POST", body: JSON.stringify({ studentId, name, email, password }) }),
  studentLogin: (email, password) =>
    request("/auth/student-login", { method: "POST", body: JSON.stringify({ email, password }) }),
  staffLogin: (staffId, password) =>
    request("/auth/staff-login", { method: "POST", body: JSON.stringify({ staffId, password }) }),

  departments: () => request("/queue/departments"),
  joinQueue: (studentId, departmentId) =>
    request("/queue/join", { method: "POST", body: JSON.stringify({ studentId, departmentId }) }),
  myTicket: (studentId) => request(`/queue/mine/${studentId}`),
  cancelTicket: (ticketId) => request("/queue/cancel", { method: "POST", body: JSON.stringify({ ticketId }) }),

  staffQueues: () => request("/staff/queues"),
  rooms: () => request("/staff/rooms"),
  callNext: (departmentId) => request("/staff/call", { method: "POST", body: JSON.stringify({ departmentId }) }),
  assignRoom: (ticketId, room) =>
    request("/staff/assign-room", { method: "POST", body: JSON.stringify({ ticketId, room }) }),
  completeTicket: (ticketId) => request("/staff/complete", { method: "POST", body: JSON.stringify({ ticketId }) }),
};
