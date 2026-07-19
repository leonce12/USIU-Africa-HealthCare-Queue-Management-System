import React, { useState } from "react";

export default function QueueTable({ dept, rooms, onCallNext, onAssignRoom, onComplete, calling }) {
  const [roomChoice, setRoomChoice] = useState({});

  return (
    <div className="queue-table">
      <div className="queue-table__header">
        <div>
          <span className="dept-card__code">{dept.code}</span>
          <h3>{dept.name}</h3>
        </div>
        <button className="btn btn--call-next" onClick={() => onCallNext(dept.id)} disabled={calling || dept.waiting.length === 0}>
          {calling ? "Calling…" : "Call next"}
        </button>
      </div>

      <section>
        <h4 className="queue-table__section-label">Waiting ({dept.waiting.length})</h4>
        {dept.waiting.length === 0 && <p className="queue-table__empty">No one waiting.</p>}
        <ul className="queue-list">
          {dept.waiting.map((t, i) => (
            <li key={t.id} className="queue-list__row">
              <span className="queue-list__position">{i + 1}</span>
              <span className="queue-list__number">{t.number}</span>
              <span className="queue-list__name">{t.studentName}</span>
            </li>
          ))}
        </ul>
      </section>

      {dept.called.length > 0 && (
        <section>
          <h4 className="queue-table__section-label">Called — assign a room</h4>
          <ul className="queue-list">
            {dept.called.map((t) => (
              <li key={t.id} className="queue-list__row queue-list__row--called">
                <span className="queue-list__number">{t.number}</span>
                <span className="queue-list__name">{t.studentName}</span>
                <select
                  className="queue-list__room-select"
                  value={roomChoice[t.id] ?? ""}
                  onChange={(e) => setRoomChoice((prev) => ({ ...prev, [t.id]: e.target.value }))}
                >
                  <option value="" disabled>Select a room…</option>
                  {rooms.map((r) => (
                    <option key={r.room} value={r.room} disabled={r.occupied}>
                      {r.room}{r.occupied ? " (occupied)" : ""}
                    </option>
                  ))}
                </select>
                <button className="btn btn--small" disabled={!roomChoice[t.id]} onClick={() => onAssignRoom(t.id, roomChoice[t.id])}>
                  Assign
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dept.inService.length > 0 && (
        <section>
          <h4 className="queue-table__section-label">In consultation</h4>
          <ul className="queue-list">
            {dept.inService.map((t) => (
              <li key={t.id} className="queue-list__row">
                <span className="queue-list__number">{t.number}</span>
                <span className="queue-list__name">{t.studentName}</span>
                <span className="queue-list__room-tag">{t.room}</span>
                <button className="btn btn--small btn--ghost" onClick={() => onComplete(t.id)}>
                  Mark done
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
