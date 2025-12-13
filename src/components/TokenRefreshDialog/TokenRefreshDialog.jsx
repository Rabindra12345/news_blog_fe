import React from "react";
import "./TokenRefreshDialog.css";

export default function TokenRefreshDialog({
  isOpen,
  onRefresh,
  onLogout,
  timeRemaining,
}) {
  if (!isOpen) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);

  return (
    <div className="trd-backdrop">
      <div className="trd-modal">
        <h3>Session expiring</h3>

        <p>
          Your session will expire in {minutes}:{String(seconds).padStart(2, "0")}
        </p>

        <div className="trd-actions">
          <button onClick={onRefresh}>Refresh session</button>
          <button onClick={onLogout} className="danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
