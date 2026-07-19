import React, { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";

const SESSION_KEY = "usiu-queue-session";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) setSession(JSON.parse(saved));
  }, []);

  function handleLogin(newSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <img src="/usiu-logo.png" alt="USIU-Africa" className="app-header__mark" width="40" height="40" />
          <div>
            <p className="app-header__eyebrow">USIU&#8209;Africa Health Centre</p>
            <h1 className="app-header__title">Queue Desk</h1>
          </div>
        </div>
        {session && (
          <button className="btn btn--signout" onClick={handleLogout}>
            Sign out — {session.name}
          </button>
        )}
      </header>

      {!session && <Login onLogin={handleLogin} />}

      {session && (
        <main className="app-main">
          {session.role === "student" && <StudentDashboard student={session} />}
          {session.role === "staff" && <StaffDashboard />}
        </main>
      )}
    </div>
  );
}
