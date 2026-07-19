import React from "react";

const STATUS_COPY = {
  waiting: "Waiting",
  called: "You're being called",
  "in-service": "In consultation",
};

export default function TicketStub({ ticket, position, estimatedWaitMinutes, onCancel, cancelling }) {
  return (
    <div className={`ticket ticket--${ticket.status}`}>
      <div className="ticket__top">
        <span className="ticket__label">{ticket.departmentName}</span>
        <span className={`ticket__status-pill ticket__status-pill--${ticket.status}`}>
          {STATUS_COPY[ticket.status]}
        </span>
      </div>

      <div className="ticket__number">{ticket.number}</div>

      <div className="ticket__perforation" />

      <div className="ticket__body">
        {ticket.status === "waiting" && (
          <>
            <div className="ticket__stat">
              <span className="ticket__stat-value">{position}</span>
              <span className="ticket__stat-label">{position === 1 ? "person" : "people"} ahead</span>
            </div>
            <div className="ticket__stat">
              <span className="ticket__stat-value">~{estimatedWaitMinutes}</span>
              <span className="ticket__stat-label">minutes estimated</span>
            </div>
          </>
        )}
        {ticket.status === "called" && <p className="ticket__message">Please head to {ticket.departmentName} reception now.</p>}
        {ticket.status === "in-service" && (
          <p className="ticket__message">
            You've been assigned to <strong>{ticket.room}</strong>.
          </p>
        )}
      </div>

      <div className="ticket__foot">
        <span className="ticket__id">{ticket.studentName}</span>
        {ticket.status === "waiting" && (
          <button className="btn btn--text" onClick={onCancel} disabled={cancelling}>
            {cancelling ? "Cancelling…" : "Cancel"}
          </button>
        )}
      </div>
    </div>
  );
}
