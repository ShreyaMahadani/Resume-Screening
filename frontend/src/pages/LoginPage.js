import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

const FLOATING_ICONS = ["⬡", "◈", "◎", "◉", "⬢", "◇", "⊕", "⬡", "◈", "◎"];

export default function LoginPage() {
  const { login, loading, error, setError } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [shake, setShake]       = useState(false);
  const [focused, setFocused]   = useState("");

  // Clear error when user types
  useEffect(() => { if (error) setError(""); }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { triggerShake(); return; }
    const ok = await login(email, password);
    if (!ok) triggerShake();
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const fillDemo = (e, pass) => {
    e.preventDefault();
    setEmail(e.currentTarget.dataset.email);
    setPassword(pass);
  };

  return (
    <div className="lp-root">
      {/* ── Animated background ── */}
      <div className="lp-bg">
        <div className="lp-orb lp-orb--1" />
        <div className="lp-orb lp-orb--2" />
        <div className="lp-orb lp-orb--3" />
        <div className="lp-grid" />
        {FLOATING_ICONS.map((icon, i) => (
          <div key={i} className="lp-float" style={{
            left: `${8 + (i * 9.5) % 88}%`,
            top:  `${10 + (i * 17) % 80}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${5 + (i % 4)}s`,
          }}>
            {icon}
          </div>
        ))}
      </div>

      {/* ── Main card ── */}
      <div className={`lp-card ${shake ? "lp-card--shake" : ""}`}>

        {/* Logo */}
        <div className="lp-logo-row">
          <div className="lp-logo-icon">⬡</div>
          <div className="lp-logo-text">AI Scout</div>
        </div>

        {/* Heading */}
        <div className="lp-heading">Welcome back</div>
        <div className="lp-subheading">Sign in to your talent dashboard</div>

        {/* Error */}
        {error && (
          <div className="lp-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Form */}
        <form className="lp-form" onSubmit={handleSubmit} noValidate>

          <div className={`lp-field ${focused === "email" ? "lp-field--focused" : ""} ${email ? "lp-field--filled" : ""}`}>
            <label className="lp-field-label">Email Address</label>
            <div className="lp-input-wrap">
              <span className="lp-input-icon">◎</span>
              <input
                className="lp-input"
                type="email"
                placeholder="hr@deccanai.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                autoComplete="email"
              />
            </div>
          </div>

          <div className={`lp-field ${focused === "password" ? "lp-field--focused" : ""} ${password ? "lp-field--filled" : ""}`}>
            <label className="lp-field-label">Password</label>
            <div className="lp-input-wrap">
              <span className="lp-input-icon">⬡</span>
              <input
                className="lp-input"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="lp-eye-btn"
                onClick={() => setShowPass(p => !p)}
                tabIndex={-1}
              >
                {showPass ? "◉" : "◎"}
              </button>
            </div>
          </div>

          <div className="lp-meta-row">
            <label className="lp-remember">
              <input type="checkbox" className="lp-checkbox" />
              <span>Remember me</span>
            </label>
            <button type="button" className="lp-forgot">Forgot password?</button>
          </div>

          <button
            type="submit"
            className={`lp-submit ${loading ? "lp-submit--loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="lp-spinner">
                <span />
                <span />
                <span />
              </span>
            ) : (
              <>Sign In  →</>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="lp-demo-section">
          <div className="lp-demo-label">Demo credentials</div>
          <div className="lp-demo-list">
            {[
              { email: "admin@aiscout.in",       pass: "Scout@2024",  role: "Admin",      color: "#6c63ff" },
              { email: "hr.manager@aiscout.in",  pass: "HRManager@1", role: "HR Manager", color: "#00d4ff" },
              { email: "recruiter@aiscout.in",   pass: "Recruit@99",  role: "Recruiter",  color: "#00e5a0" },
            ].map((d) => (
              <button
                key={d.email}
                type="button"
                className="lp-demo-chip"
                data-email={d.email}
                onClick={(e) => fillDemo(e, d.pass)}
                style={{ "--chip-color": d.color }}
              >
                <span className="lp-demo-role" style={{ color: d.color }}>{d.role}</span>
                <span className="lp-demo-email">{d.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="lp-footer">
          Talent Intelligence Platform
        </div>
      </div>
    </div>
  );
}