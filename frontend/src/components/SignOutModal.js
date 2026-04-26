import React from "react";
import { useAuth } from "../context/AuthContext";
import "./SignOutModal.css";

export default function SignOutModal({ onClose }) {
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    onClose();
  };

  return (
    <div className="so-overlay" onClick={onClose}>
      <div className="so-modal" onClick={(e) => e.stopPropagation()}>

        {/* Icon */}
        <div className="so-icon-wrap">
          <div className="so-icon">⬡</div>
        </div>

        {/* Text */}
        <div className="so-title">Sign out?</div>
        <div className="so-sub">
          You're signed in as <span className="so-name">{user?.name}</span>
          <br />
          <span className="so-email">{user?.email}</span>
        </div>

        {/* Actions */}
        <div className="so-actions">
          <button className="so-btn-cancel" onClick={onClose}>
            Stay Signed In
          </button>
          <button className="so-btn-confirm" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}