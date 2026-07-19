import React, { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import DepartmentGrid from "../components/DepartmentGrid.jsx";
import TicketStub from "../components/TicketStub.jsx";

const POLL_MS = 4000;

export default function StudentDashboard({ student }) {
  const [departments, setDepartments] = useState([]);
  const [mine, setMine] = useState(null);
  const [joining, setJoining] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [deps, status] = await Promise.all([api.departments(), api.myTicket(student.id)]);
      setDepartments(deps);
      setMine(status.ticket ? status : null);
    } catch (err) {
      setError(err.message);
    }
  }, [student.id]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleJoin(departmentId) {
    setJoining(true);
    setError("");
    try {
      await api.joinQueue(student.id, departmentId);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  }

  async function handleCancel() {
    setCancelling(true);
    try {
      await api.cancelTicket(mine.ticket.id);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="dashboard">
      <p className="dashboard__greeting">Hi {student.name.split(" ")[0]}, here's your queue status.</p>
      {error && <p className="login__error">{error}</p>}

      {mine?.ticket ? (
        <TicketStub
          ticket={mine.ticket}
          position={mine.position}
          estimatedWaitMinutes={mine.estimatedWaitMinutes}
          onCancel={handleCancel}
          cancelling={cancelling}
        />
      ) : (
        <>
          <h2 className="section-title">Choose a department</h2>
          <DepartmentGrid departments={departments} onSelect={handleJoin} joining={joining} />
        </>
      )}
    </div>
  );
}
