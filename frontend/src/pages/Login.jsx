import React, { useState } from "react";
import { api } from "../api.js";

const DOMAIN = "usiu.ac.ke";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("student");
  const [mode, setMode] = useState("signin");

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffId, setStaffId] = useState("");
  const [staffPassword, setStaffPassword] = useState("");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const emailValid = (v) => v.trim().toLowerCase().endsWith(`@${DOMAIN}`);

  function resetMessages() {
    setError("");
    setNotice("");
  }

  async function submitSignin(e) {
    e.preventDefault();
    resetMessages();
    setBusy(true);
    try {
      const student = await api.studentLogin(email.trim(), password);
      onLogin({ ...student, role: "student" });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitRegister(e) {
    e.preventDefault();
    resetMessages();
    if (!emailValid(email)) {
      setError(`Registration requires a valid @${DOMAIN} address`);
      return;
    }
    setBusy(true);
    try {
      await api.studentRegister(studentId.trim(), name.trim(), email.trim(), password);
      setNotice("Account created — you can now sign in.");
      setMode("signin");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitStaff(e) {
    e.preventDefault();
    resetMessages();
    setBusy(true);
    try {
      const staff = await api.staffLogin(staffId.trim(), staffPassword);
      onLogin({ ...staff, role: "staff" });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-hero">
      <div className="login-hero__bg-image" />
      <div className="login-hero__bg-white" />

      <div className="login__panel">
        <div className="role-toggle">
          <button
            className={`role-toggle__btn ${role === "student" ? "is-active" : ""}`}
            onClick={() => {
              setRole("student");
              resetMessages();
            }}
            type="button"
          >
            Student
          </button>
          <button
            className={`role-toggle__btn ${role === "staff" ? "is-active" : ""}`}
            onClick={() => {
              setRole("staff");
              resetMessages();
            }}
            type="button"
          >
            Clinic staff
          </button>
        </div>

        {role === "student" ? (
          <>
            <div className="mode-toggle">
              <button
                className={`mode-toggle__btn ${mode === "signin" ? "is-active" : ""}`}
                onClick={() => {
                  setMode("signin");
                  resetMessages();
                }}
                type="button"
              >
                Sign in
              </button>
              <button
                className={`mode-toggle__btn ${mode === "register" ? "is-active" : ""}`}
                onClick={() => {
                  setMode("register");
                  resetMessages();
                }}
                type="button"
              >
                Register
              </button>
            </div>

            {mode === "signin" ? (
              <form className="login__form" onSubmit={submitSignin} autoComplete="off">
                <h2>Sign in</h2>
                <p className="login__hint">Only USIU-Africa student accounts (@{DOMAIN}) can access this system.</p>
                <label>
                  University email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`e.g. shyaka@${DOMAIN}`}
                    autoComplete="off"
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*******"
                    autoComplete="new-password"
                    required
                  />
                </label>
                {notice && <p className="login__notice">{notice}</p>}
                {error && <p className="login__error">{error}</p>}
                <button className="btn btn--primary" disabled={busy}>
                  {busy ? "Signing in…" : "Continue"}
                </button>
              </form>
            ) : (
              <form className="login__form" onSubmit={submitRegister} autoComplete="off">
                <h2>Create account</h2>
                <p className="login__hint">Registration requires a valid @{DOMAIN} address.</p>
                <label>
                  Student ID
                  <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 670000" autoComplete="off" required />
                </label>
                <label>
                  Full name
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Shyaka Leonce" autoComplete="off" required />
                </label>
                <label>
                  University email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`e.g. shyaka@${DOMAIN}`}
                    autoComplete="off"
                    required
                  />
                  {email && !emailValid(email) && <span className="login__field-warning">Must end in @{DOMAIN}</span>}
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    minLength={6}
                    autoComplete="new-password"
                    required
                  />
                </label>
                {error && <p className="login__error">{error}</p>}
                <button className="btn btn--primary" disabled={busy}>
                  {busy ? "Creating account…" : "Register"}
                </button>
              </form>
            )}
          </>
        ) : (
          <form className="login__form" onSubmit={submitStaff} autoComplete="off">
            <h2>Staff sign-in</h2>
            <label>
              Staff ID
              <input value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="e.g. staff1" autoComplete="off" required />
            </label>
            <label>
              Password
              <input
                type="password"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                placeholder="*******"
                autoComplete="new-password"
                required
              />
            </label>
            {error && <p className="login__error">{error}</p>}
            <button className="btn btn--primary" disabled={busy}>
              {busy ? "Signing in…" : "Continue"}
            </button>
          </form>
        )}
      </div>

      <div className="login-hero__info">
        <h2 className="login-hero__info-title">Emergency Services</h2>
        <p className="login-hero__info-text">
          The university provides ambulance services for on-campus emergencies.
        </p>
        <p className="login-hero__info-text">
          In the event of an emergency, contact the Health Centre as quickly as possible through the
          following numbers:
        </p>
        <ul className="login-hero__info-list">
          <li>📱 +254 798 294 538</li>
          <li>☎️ +254 730 116 760 / 761 / 762 / 271</li>
        </ul>
      </div>
    </div>
  );
}
