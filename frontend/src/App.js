import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

import JDInput from "./components/JDInput";
import ResultsTable from "./components/ResultsTable";
import ChatBox from "./components/ChatBox";
import CandidatesPage from "./components/CandidatesPage";
import AnalyticsPage from "./components/AnalyticsPage";
import "./App.css";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeNav, setActiveNav] = useState("Dashboard");

  const handleJDSubmit = async (jd) => {
    try {
      const res = await axios.post("http://localhost:5000/process", { jd });
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
      alert("Backend not running!");
    }
  };

  const downloadCSV = () => {
    const headers = ["Name", "Match Score", "Interest Score", "Final Score"];
    const rows = candidates.map((c) => [c.name, c.match_score, c.interest_score, c.final_score]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "shortlist.csv";
    document.body.appendChild(link);
    link.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Candidate Shortlist", 10, 10);
    candidates.forEach((c, i) => {
      doc.text(`${c.name} | Match: ${c.match_score} | Interest: ${c.interest_score} | Final: ${c.final_score}`, 10, 20 + i * 10);
    });
    doc.save("shortlist.pdf");
  };

  const handleChatFromCandidates = (candidate) => {
    setSelectedCandidate(candidate);
    setActiveNav("Dashboard");
  };

  const navItems = [
    { icon: "⬡", label: "Dashboard" },
    { icon: "◈", label: "Candidates" },
    { icon: "◇", label: "Analytics" },
    { icon: "⊕", label: "Job Boards" },
    { icon: "⚙", label: "Settings" },
  ];

  const stats = [
    { icon: "👥", color: "purple", label: "Total Candidates", value: candidates.length || 0, change: "+12%", up: true },
    { icon: "✅", color: "green",  label: "Shortlisted", value: candidates.filter(c => (c.final_score || 0) >= 70).length, change: "+8%", up: true },
    { icon: "⚡", color: "cyan",   label: "Avg Match Score", value: candidates.length ? Math.round(candidates.reduce((a, c) => a + (c.match_score || 0), 0) / candidates.length) + "%" : "—", change: "+3%", up: true },
    { icon: "🎯", color: "orange", label: "Top Score", value: candidates.length ? Math.max(...candidates.map(c => c.final_score || 0)) : "—", change: "—", up: null },
  ];

  const PAGE_TITLES = {
    Dashboard:  { h: " Talent Dashboard",  sub: " candidate screening & shortlisting" },
    Candidates: { h: "◈ Candidates",          sub: `${candidates.length} candidates loaded` },
    Analytics:  { h: "◇ Analytics",           sub: "Data-driven insights from your candidate pool" },
    "Job Boards":{ h: "⊕ Job Boards",         sub: "Coming soon" },
    Settings:   { h: "⚙ Settings",            sub: "Coming soon" },
  };

  return (
    <div className="dashboard">
      {/* ── Sidebar ── */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">⬡</div>
          <h2>AI Scout</h2>
        </div>
        <span className="sidebar-section-label">Navigation</span>
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`sidebar-item ${activeNav === item.label ? "active" : ""}`}
            onClick={() => setActiveNav(item.label)}
          >
            <span className="item-icon">{item.icon}</span>
            {item.label}
            {item.label === "Candidates" && candidates.length > 0 && (
              <span style={{ marginLeft: "auto", background: "rgba(108,99,255,0.2)", color: "#a89eff", fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "20px" }}>
                {candidates.length}
              </span>
            )}
            {item.label === "Analytics" && candidates.length > 0 && (
              <span style={{ marginLeft: "auto", background: "rgba(0,229,160,0.12)", color: "#00e5a0", fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "20px" }}>
                Live
              </span>
            )}
          </div>
        ))}
        <div className="sidebar-footer">
          <div className="avatar">HR</div>
          <div className="user-info">
            <div className="user-name">HR Manager</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <h1>{PAGE_TITLES[activeNav]?.h}</h1>
            <p>{PAGE_TITLES[activeNav]?.sub}</p>
          </div>
          <div className="topbar-right">
            <div className="topbar-badge">Backend Live</div>
            {candidates.length > 0 && activeNav === "Dashboard" && (
              <div className="actions">
                <button className="btn-ghost" onClick={downloadCSV}>⬇ CSV</button>
                <button className="btn-ghost" onClick={downloadPDF}>⬇ PDF</button>
              </div>
            )}
          </div>
        </div>

        <div className="main-body">

          {/* DASHBOARD */}
          {activeNav === "Dashboard" && (
            <>
              <div className="stats-row">
                {stats.map((s) => (
                  <div className="stat-card" key={s.label}>
                    <div className="stat-card-top">
                      <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                      {s.up !== null && <span className={`stat-change ${s.up ? "up" : "down"}`}>{s.change}</span>}
                    </div>
                    <div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="jd-section">
                <div className="section-header">
                  <div>
                    <div className="section-title">Job Description Analyzer</div>
                    <div className="section-subtitle">Paste your JD to rank and match candidates automatically</div>
                  </div>
                </div>
                <JDInput onSubmit={handleJDSubmit} />
              </div>
              <div className="main-grid">
                <ResultsTable candidates={candidates} onSelect={setSelectedCandidate} />
                <ChatBox candidate={selectedCandidate} />
              </div>
            </>
          )}

          {/* CANDIDATES */}
          {activeNav === "Candidates" && (
            candidates.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "60px 24px" }}>
                <div style={{ fontSize: "40px", opacity: 0.4 }}>◈</div>
                <p style={{ color: "var(--text-muted)", marginTop: "12px" }}>No candidates yet. Submit a Job Description from the Dashboard first.</p>
                <button style={{ marginTop: "16px" }} onClick={() => setActiveNav("Dashboard")}>→ Go to Dashboard</button>
              </div>
            ) : (
              <CandidatesPage candidates={candidates} onChat={handleChatFromCandidates} />
            )
          )}

          {/* ANALYTICS */}
          {activeNav === "Analytics" && (
            candidates.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "60px 24px" }}>
                <div style={{ fontSize: "40px", opacity: 0.3 }}>◇</div>
                <p style={{ color: "var(--text-muted)", marginTop: "12px" }}>No data yet. Submit a Job Description from the Dashboard to generate analytics.</p>
                <button style={{ marginTop: "16px" }} onClick={() => setActiveNav("Dashboard")}>→ Go to Dashboard</button>
              </div>
            ) : (
              <AnalyticsPage candidates={candidates} />
            )
          )}

          {/* PLACEHOLDER PAGES */}
          {["Job Boards", "Settings"].includes(activeNav) && (
            <div className="card" style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ fontSize: "40px", opacity: 0.3 }}>🚧</div>
              <p style={{ color: "var(--text-muted)", marginTop: "12px" }}>{activeNav} — coming soon.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;