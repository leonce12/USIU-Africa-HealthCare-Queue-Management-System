import React, { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import QueueTable from "../components/QueueTable.jsx";

const POLL_MS = 4000;

export default function StaffDashboard() {
  const [queues, setQueues] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [calling, setCalling] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [queueData, roomData] = await Promise.all([api.staffQueues(), api.rooms()]);
      setQueues(queueData);
      setRooms(roomData);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleCallNext(departmentId) {
    setCalling(true);
    setError("");
    try {
      await api.callNext(departmentId);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setCalling(false);
    }
  }

  async function handleAssignRoom(ticketId, room) {
    try {
      await api.assignRoom(ticketId, room);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleComplete(ticketId) {
    try {
      await api.completeTicket(ticketId);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  const selectedDept = queues.find((d) => d.id === selected);
  const roomsForSelected = rooms.find((r) => r.departmentId === selected)?.rooms || [];

  return (
    <div className="dashboard">
      <p className="dashboard__greeting">Live view of all clinic departments.</p>
      {error && <p className="login__error">{error}</p>}

      <div className="staff-grid">
        <div className="staff-grid__list">
          {queues.map((d) => (
            <button key={d.id} className={`staff-dept-row ${selected === d.id ? "is-active" : ""}`} onClick={() => setSelected(d.id)}>
              <span className="dept-card__code">{d.code}</span>
              <span className="staff-dept-row__name">{d.name}</span>
              <span className="staff-dept-row__count">{d.waiting.length} waiting</span>
              {d.called.length > 0 && <span className="staff-dept-row__flag">calling</span>}
            </button>
          ))}
        </div>

        <div className="staff-grid__detail">
          {selectedDept ? (
            <QueueTable
              dept={selectedDept}
              rooms={roomsForSelected}
              onCallNext={handleCallNext}
              onAssignRoom={handleAssignRoom}
              onComplete={handleComplete}
              calling={calling}
            />
          ) : (
            <p className="queue-table__empty">Select a department to manage its queue.</p>
          )}
        </div>
      </div>
    </div>
  );
}
