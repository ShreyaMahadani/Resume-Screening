import React, { useState } from "react";
import "./SettingsPage.css";

/* ── Toggle ─────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <div className={`sg-toggle ${checked ? "sg-toggle--on" : ""}`} onClick={() => onChange(!checked)}>
      <div className="sg-toggle-thumb" />
    </div>
  );
}

/* ── Slider ─────────────────────────────────────────────── */
function Slider({ value, min, max, step, onChange, label }) {
  return (
    <div className="sg-slider-wrap">
      <input
        type="range"
        className="sg-slider"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="sg-slider-val">{label ? label(value) : value}</span>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────── */
function Section({ icon, title, subtitle, children }) {
  return (
    <div className="sg-section">
      <div className="sg-section-header">
        <div className="sg-section-icon">{icon}</div>
        <div>
          <div className="sg-section-title">{title}</div>
          {subtitle && <div className="sg-section-sub">{subtitle}</div>}
        </div>
      </div>
      <div className="sg-section-body">{children}</div>
    </div>
  );
}

/* ── Row ────────────────────────────────────────────────── */
function Row({ label, hint, children, danger }) {
  return (
    <div className={`sg-row ${danger ? "sg-row--danger" : ""}`}>
      <div className="sg-row-left">
        <div className="sg-row-label">{label}</div>
        {hint && <div className="sg-row-hint">{hint}</div>}
      </div>
      <div className="sg-row-right">{children}</div>
    </div>
  );
}

/* ── Toast ──────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  return (
    <div className={`sg-toast sg-toast--${type}`}>
      <span>{type === "success" ? "✓" : "⚠"}</span>
      {message}
      <button className="sg-toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────── */
export default function SettingsPage({ config, onConfigChange, candidates, onClearCandidates }) {
  const [toast, setToast] = useState(null);
  const [activeSection, setActiveSection] = useState("Profile");

  /* ── Local state mirrors config prop ── */
  const [profile, setProfile] = useState({
    name: config?.recruiterName || "HR Manager",
    company: config?.company || "Deccan AI",
    role: config?.role || "Admin",
    email: config?.email || "hr@deccanai.com",
  });

  const [scoring, setScoring] = useState({
    matchWeight: config?.matchWeight ?? 60,
    interestWeight: config?.interestWeight ?? 40,
    minMatchScore: config?.minMatchScore ?? 50,
    minInterestScore: config?.minInterestScore ?? 40,
    maxShortlist: config?.maxShortlist ?? 10,
    autoRank: config?.autoRank ?? true,
  });

  const [preferences, setPreferences] = useState({
    remoteOnly: config?.remoteOnly ?? false,
    minExperience: config?.minExperience ?? 0,
    preferredLocations: config?.preferredLocations ?? "",
    preferredSkills: config?.preferredSkills ?? "",
    blacklistKeywords: config?.blacklistKeywords ?? "",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Save pushes to parent App.js ── */
  const handleSaveProfile = () => {
    onConfigChange({
      ...config,
      recruiterName: profile.name,
      company: profile.company,
      role: profile.role,
      email: profile.email,
    });
    showToast("Profile saved successfully.");
  };

  const handleSaveScoring = () => {
    onConfigChange({
      ...config,
      matchWeight: scoring.matchWeight,
      interestWeight: scoring.interestWeight,
      minMatchScore: scoring.minMatchScore,
      minInterestScore: scoring.minInterestScore,
      maxShortlist: scoring.maxShortlist,
      autoRank: scoring.autoRank,
    });
    showToast("Scoring config saved — results will update on next JD submit.");
  };

  const handleSavePreferences = () => {
    onConfigChange({
      ...config,
      remoteOnly: preferences.remoteOnly,
      minExperience: preferences.minExperience,
      preferredLocations: preferences.preferredLocations,
      preferredSkills: preferences.preferredSkills,
      blacklistKeywords: preferences.blacklistKeywords,
    });
    showToast("Job preferences saved.");
  };

  const handleExportCSV = () => {
    if (!candidates || candidates.length === 0) {
      showToast("No candidates to export.", "warning");
      return;
    }
    const headers = ["Name", "Match Score", "Interest Score", "Final Score"];
    const rows = candidates.map((c) => [c.name, c.match_score, c.interest_score, c.final_score]);
    const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "candidate_shortlist.csv";
    document.body.appendChild(link);
    link.click();
    showToast("CSV downloaded successfully.");
  };

  const handleExportJSON = () => {
    if (!candidates || candidates.length === 0) {
      showToast("No candidates to export.", "warning");
      return;
    }
    const json = JSON.stringify({ profile, scoring, preferences, candidates }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "talentai_export.json";
    link.click();
    showToast("JSON exported successfully.");
  };

  const handleClearCandidates = () => {
    if (!candidates || candidates.length === 0) {
      showToast("Candidate pool is already empty.", "warning");
      return;
    }
    onClearCandidates();
    showToast("Candidate pool cleared.", "warning");
  };

  const setS = (k, v) => setScoring((s) => ({ ...s, [k]: v }));
  const setP = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const setPref = (k, v) => setPreferences((p) => ({ ...p, [k]: v }));

  const NAV_ITEMS = [
    { label: "Profile",         icon: "◉" },
    { label: "Scoring Config",  icon: "⚡" },
    { label: "Job Preferences", icon: "◈" },
    { label: "Export & Data",   icon: "⊕", danger: false },
  ];

  return (
    <div className="sg-page">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="sg-layout">

        {/* ── Side nav ── */}
        <div className="sg-sidenav">
          <div className="sg-sidenav-title">Settings</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`sg-nav-item ${activeSection === item.label ? "sg-nav-item--active" : ""} ${item.danger ? "sg-nav-item--danger" : ""}`}
              onClick={() => setActiveSection(item.label)}
            >
              <span className="sg-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="sg-content">

          {/* ── PROFILE ── */}
          {activeSection === "Profile" && (
            <Section icon="◉" title="Recruiter Profile" subtitle="Your details appear in PDF exports and outreach emails">

              <div className="sg-avatar-row">
                <div className="sg-big-avatar">
                  {profile.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "HR"}
                </div>
                <div>
                  <div className="sg-avatar-name">{profile.name}</div>
                  <div className="sg-avatar-role">{profile.role} · {profile.company}</div>
                </div>
              </div>

              <div className="sg-field-grid">
                <div className="sg-field">
                  <label className="sg-label">Full Name</label>
                  <input
                    className="sg-input"
                    value={profile.name}
                    onChange={(e) => setP("name", e.target.value)}
                    placeholder="e.g. Shreya Mahadani"
                  />
                </div>
                <div className="sg-field">
                  <label className="sg-label">Email Address</label>
                  <input
                    className="sg-input"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setP("email", e.target.value)}
                    placeholder="e.g. hr@company.com"
                  />
                </div>
                <div className="sg-field">
                  <label className="sg-label">Role</label>
                  <select className="sg-select" value={profile.role} onChange={(e) => setP("role", e.target.value)}>
                    {["Admin", "HR Manager", "Recruiter", "Viewer"].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="sg-field">
                  <label className="sg-label">Company</label>
                  <input
                    className="sg-input"
                    value={profile.company}
                    onChange={(e) => setP("company", e.target.value)}
                    placeholder="e.g. Deccan AI"
                  />
                </div>
              </div>

              {/* Preview — shows how it appears on PDF */}
              <div className="sg-preview-card">
                <div className="sg-preview-label">PDF Export Preview</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.8 }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Prepared by:</span>{" "}
                  {profile.name} ({profile.role}) · {profile.company}<br />
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Contact:</span>{" "}
                  {profile.email}
                </div>
              </div>

              <div className="sg-actions">
                <button onClick={handleSaveProfile}>Save Profile</button>
                <button className="btn-outline" onClick={() => {
                  setProfile({ name: "HR Manager", company: "Deccan AI", role: "Admin", email: "hr@deccanai.com" });
                  showToast("Profile reset to defaults.", "warning");
                }}>Reset</button>
              </div>
            </Section>
          )}

          {/* ── SCORING CONFIG ── */}
          {activeSection === "Scoring Config" && (
            <Section icon="⚡" title="Scoring Configuration" subtitle="These weights directly affect how candidates are ranked after JD submission">

              <div className="sg-group-label">Score Weights</div>

              <Row label="Match Score Weight" hint={`Skills & experience alignment — currently weighted at ${scoring.matchWeight}%`}>
                <Slider
                  value={scoring.matchWeight}
                  min={10} max={90} step={5}
                  onChange={(v) => { setS("matchWeight", v); setS("interestWeight", 100 - v); }}
                  label={(v) => `${v}%`}
                />
              </Row>

              <Row label="Interest Score Weight" hint={`Candidate engagement from outreach — currently weighted at ${scoring.interestWeight}%`}>
                <Slider
                  value={scoring.interestWeight}
                  min={10} max={90} step={5}
                  onChange={(v) => { setS("interestWeight", v); setS("matchWeight", 100 - v); }}
                  label={(v) => `${v}%`}
                />
              </Row>

              {/* Live formula preview */}
              <div className="sg-preview-card">
                <div className="sg-preview-label">Live Formula Preview</div>
                <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#a89eff", lineHeight: 2 }}>
                  Final Score = (Match × {scoring.matchWeight / 100}) + (Interest × {scoring.interestWeight / 100})
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                  Example: Match=80, Interest=70 →{" "}
                  <span style={{ color: "#00e5a0", fontWeight: 600 }}>
                    {Math.round(80 * (scoring.matchWeight / 100) + 70 * (scoring.interestWeight / 100))}
                  </span>
                </div>
              </div>

              <div className="sg-divider" />
              <div className="sg-group-label">Filters</div>

              <Row label="Minimum Match Score" hint="Candidates below this threshold are excluded from shortlist">
                <Slider
                  value={scoring.minMatchScore}
                  min={0} max={90} step={5}
                  onChange={(v) => setS("minMatchScore", v)}
                  label={(v) => `${v}%`}
                />
              </Row>

              <Row label="Minimum Interest Score" hint="Candidates below this interest level are excluded">
                <Slider
                  value={scoring.minInterestScore}
                  min={0} max={90} step={5}
                  onChange={(v) => setS("minInterestScore", v)}
                  label={(v) => `${v}%`}
                />
              </Row>

              <Row label="Max Shortlist Size" hint="Maximum candidates shown in results after processing">
                <Slider
                  value={scoring.maxShortlist}
                  min={3} max={30} step={1}
                  onChange={(v) => setS("maxShortlist", v)}
                  label={(v) => `${v} candidates`}
                />
              </Row>

              <div className="sg-divider" />
              <div className="sg-group-label">Ranking Behaviour</div>

              <Row label="Auto-rank results" hint="Automatically sort candidates by final score after processing">
                <Toggle checked={scoring.autoRank} onChange={(v) => setS("autoRank", v)} />
              </Row>

              {/* Impact preview */}
              {candidates && candidates.length > 0 && (
                <div className="sg-preview-card">
                  <div className="sg-preview-label">Impact Preview — Current {candidates.length} Candidates</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.8 }}>
                    With current filters, <span style={{ color: "#00e5a0", fontWeight: 600 }}>
                      {candidates.filter(c =>
                        (c.match_score || 0) >= scoring.minMatchScore &&
                        (c.interest_score || 0) >= scoring.minInterestScore
                      ).length}
                    </span> of {candidates.length} candidates would pass.
                    Top {Math.min(scoring.maxShortlist, candidates.length)} would be shown.
                  </div>
                </div>
              )}

              <div className="sg-actions">
                <button onClick={handleSaveScoring}>Save & Apply</button>
                <button className="btn-outline" onClick={() => {
                  setScoring({ matchWeight: 60, interestWeight: 40, minMatchScore: 50, minInterestScore: 40, maxShortlist: 10, autoRank: true });
                  showToast("Scoring reset to defaults.", "warning");
                }}>Reset Defaults</button>
              </div>
            </Section>
          )}

          {/* ── JOB PREFERENCES ── */}
          {activeSection === "Job Preferences" && (
            <Section icon="◈" title="Job Preferences" subtitle="Default filters applied to every JD you process">

              <div className="sg-group-label">Location & Work Mode</div>

              <Row label="Remote candidates only" hint="Only show candidates open to remote work">
                <Toggle checked={preferences.remoteOnly} onChange={(v) => setPref("remoteOnly", v)} />
              </Row>

              <Row label="Minimum Experience" hint="Exclude candidates with fewer years of experience">
                <Slider
                  value={preferences.minExperience}
                  min={0} max={15} step={1}
                  onChange={(v) => setPref("minExperience", v)}
                  label={(v) => v === 0 ? "Any" : `${v}+ yrs`}
                />
              </Row>

              <Row label="Preferred Locations" hint="Comma-separated list — e.g. Pune, Mumbai, Bangalore">
                <input
                  className="sg-input sg-input--wide"
                  value={preferences.preferredLocations}
                  onChange={(e) => setPref("preferredLocations", e.target.value)}
                  placeholder="e.g. Pune, Mumbai, Remote"
                />
              </Row>

              <div className="sg-divider" />
              <div className="sg-group-label">Skill Filters</div>

              <Row label="Preferred Skills" hint="Boost candidates who have these skills — comma-separated">
                <input
                  className="sg-input sg-input--wide"
                  value={preferences.preferredSkills}
                  onChange={(e) => setPref("preferredSkills", e.target.value)}
                  placeholder="e.g. Python, React, AWS"
                />
              </Row>

              <Row label="Blacklist Keywords" hint="Auto-exclude candidates with these keywords in their profile">
                <input
                  className="sg-input sg-input--wide"
                  value={preferences.blacklistKeywords}
                  onChange={(e) => setPref("blacklistKeywords", e.target.value)}
                  placeholder="e.g. unprofessional, spam"
                />
              </Row>

              {/* Preview */}
              <div className="sg-preview-card">
                <div className="sg-preview-label">Active Filters Summary</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 2 }}>
                  <span style={{ color: "#a89eff" }}>Remote Only:</span> {preferences.remoteOnly ? "Yes" : "No"}&emsp;
                  <span style={{ color: "#a89eff" }}>Min Exp:</span> {preferences.minExperience === 0 ? "Any" : `${preferences.minExperience}+ yrs`}<br />
                  <span style={{ color: "#a89eff" }}>Locations:</span> {preferences.preferredLocations || "Any"}<br />
                  <span style={{ color: "#a89eff" }}>Boost Skills:</span> {preferences.preferredSkills || "None"}<br />
                  <span style={{ color: "#ff6b8a" }}>Blacklist:</span> {preferences.blacklistKeywords || "None"}
                </div>
              </div>

              <div className="sg-actions">
                <button onClick={handleSavePreferences}>Save Preferences</button>
                <button className="btn-outline" onClick={() => {
                  setPreferences({ remoteOnly: false, minExperience: 0, preferredLocations: "", preferredSkills: "", blacklistKeywords: "" });
                  showToast("Preferences reset to defaults.", "warning");
                }}>Reset</button>
              </div>
            </Section>
          )}

          {/* ── EXPORT & DATA ── */}
          {activeSection === "Export & Data" && (
            <Section icon="⊕" title="Export & Data" subtitle="Download your data or clear the current session">

              <div className="sg-group-label">Export Candidates</div>

              <div className="sg-danger-row">
                <div className="sg-danger-info">
                  <div className="sg-danger-title">Download as CSV</div>
                  <div className="sg-danger-desc">
                    Export the current shortlist as a spreadsheet — includes name, match score, interest score, and final score.
                    {candidates && candidates.length > 0
                      ? ` ${candidates.length} candidates ready.`
                      : " No candidates loaded yet."}
                  </div>
                </div>
                <button onClick={handleExportCSV}>⬇ CSV</button>
              </div>

              <div className="sg-danger-row">
                <div className="sg-danger-info">
                  <div className="sg-danger-title">Download as JSON</div>
                  <div className="sg-danger-desc">
                    Full export including all candidate data, your scoring config, and preferences. Useful for backup or migration.
                  </div>
                </div>
                <button onClick={handleExportJSON}>⬇ JSON</button>
              </div>

              <div className="sg-divider" />
              <div className="sg-group-label">Session Data</div>

              {/* Candidate pool stats */}
              <div className="sg-preview-card" style={{ marginBottom: "12px" }}>
                <div className="sg-preview-label">Current Session</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginTop: "8px" }}>
                  {[
                    { label: "Candidates Loaded", value: candidates?.length || 0, color: "#a89eff" },
                    { label: "Shortlisted (≥70)", value: candidates?.filter(c => (c.final_score || 0) >= 70).length || 0, color: "#00e5a0" },
                    { label: "Avg Final Score", value: candidates?.length ? Math.round(candidates.reduce((a, c) => a + (c.final_score || 0), 0) / candidates.length) : "—", color: "#ffb547" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px", letterSpacing: "0.05em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sg-danger-row" style={{ borderColor: "rgba(255,107,138,0.15)" }}>
                <div className="sg-danger-info">
                  <div className="sg-danger-title" style={{ color: "#ff6b8a" }}>Clear Candidate Pool</div>
                  <div className="sg-danger-desc">
                    Remove all loaded candidates from this session. You will need to resubmit a Job Description to repopulate. This cannot be undone.
                  </div>
                </div>
                <button className="sg-btn-delete" onClick={handleClearCandidates}>Clear Pool</button>
              </div>

            </Section>
          )}

        </div>
      </div>
    </div>
  );
}