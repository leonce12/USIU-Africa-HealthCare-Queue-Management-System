import React from "react";

export default function DepartmentGrid({ departments, onSelect, joining }) {
  return (
    <div className="dept-grid">
      {departments.map((d) => (
        <button key={d.id} className="dept-card" onClick={() => onSelect(d.id)} disabled={!!joining}>
          <span className="dept-card__code">{d.code}</span>
          <span className="dept-card__name">{d.name}</span>
          <span className="dept-card__count">{d.waitingCount === 0 ? "No queue" : `${d.waitingCount} waiting`}</span>
        </button>
      ))}
    </div>
  );
}
