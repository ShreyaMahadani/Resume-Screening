import React, { useState, useMemo } from "react";
import "./CandidatesPage.css";

const LEVEL = (exp) =>
  exp >= 4 ? { label: "Senior", cls: "senior" }
  : exp >= 2 ? { label: "Mid-level", cls: "mid" }
  : { label: "Junior", cls: "junior" };

const VERDICT = (score) =>
  score >= 80 ? { label: "Strong Hire", cls: "strong" }
  : score >= 60 ? { label: "Potential", cls: "potential" }
  : { label: "Weak Fit", cls: "weak" };

const ALL_SKILLS = [
  "Python","Django","Flask","SQL","Java","Spring","React","JavaScript",
];

export default function CandidatesPage({ candidates, onChat }) {
  const [search, setSearch]         = useState("");
  const [filterSkill, setFilterSkill] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  const [sortBy, setSortBy]         = useState("final_score");
  const [shortlisted, setShortlisted] = useState(new Set());

  const toggleShortlist = (name) => {
    setShortlisted((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = [...candidates];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.skills || []).some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filterSkill !== "All") {
      list = list.filter((c) => (c.skills || []).includes(filterSkill));
    }

    if (filterLevel !== "All") {
      list = list.filter((c) => LEVEL(c.experience).label === filterLevel);
    }

    list.sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));
    return list;
  }, [candidates, search, filterSkill, filterLevel, sortBy]);

  return (
    <div className="cp-page">
      {/* ── Header ── */}
      <div className="cp-header">
        <div>
          <h2 className="cp-title">All Candidates</h2>
          <p className="cp-sub">
            {filtered.length} of {candidates.length} candidates
            {shortlisted.size > 0 && ` · ${shortlisted.size} shortlisted`}
          </p>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="cp-controls">
        <div className="cp-search-wrap">
          <span className="cp-search-icon">⌕</span>
          <input
            className="cp-search"
            placeholder="Search by name or skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="cp-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <div className="cp-filters">
          <select
            className="cp-select"
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
          >
            <option value="All">All Skills</option>
            {ALL_SKILLS.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select
            className="cp-select"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="All">All Levels</option>
            <option>Junior</option>
            <option>Mid-level</option>
            <option>Senior</option>
          </select>

          <select
            className="cp-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="final_score">Sort: Final Score</option>
            <option value="match_score">Sort: Match Score</option>
            <option value="interest_score">Sort: Interest</option>
            <option value="experience">Sort: Experience</option>
          </select>
        </div>
      </div>

      {/* ── Cards grid ── */}
      {filtered.length === 0 ? (
        <div className="cp-empty">
          <span className="cp-empty-icon">◈</span>
          <p>No candidates match your filters.</p>
        </div>
      ) : (
        <div className="cp-grid">
          {filtered.map((c, i) => {
            const level   = LEVEL(c.experience);
            const verdict = VERDICT(c.final_score || 0);
            const isShort = shortlisted.has(c.name);

            return (
              <div
                className={`cp-card ${isShort ? "cp-card--shortlisted" : ""}`}
                key={c.name}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Top row */}
                <div className="cp-card-top">
                  <div className="cp-avatar">
                    {c.name.charAt(0)}
                  </div>
                  <div className="cp-card-meta">
                    <div className="cp-card-name">{c.name}</div>
                    <div className="cp-card-badges">
                      <span className={`cp-level-badge cp-level-${level.cls}`}>
                        {level.label}
                      </span>
                      <span className="cp-exp-badge">
                        {c.experience} yr{c.experience !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <span className={`cp-verdict cp-verdict--${verdict.cls}`}>
                    {verdict.label}
                  </span>
                </div>

                {/* Skills */}
                <div className="cp-skills">
                  {(c.skills || []).map((s) => (
                    <span
                      key={s}
                      className={`cp-skill-tag ${filterSkill === s ? "cp-skill-tag--active" : ""}`}
                      onClick={() => setFilterSkill(filterSkill === s ? "All" : s)}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Score bars */}
                <div className="cp-scores">
                  {[
                    { label: "Match",    value: c.match_score,    color: "#6c63ff" },
                    { label: "Interest", value: c.interest_score, color: "#00d4ff" },
                    { label: "Final",    value: c.final_score,    color: "#00e5a0" },
                  ].map(({ label, value, color }) => (
                    <div className="cp-score-row" key={label}>
                      <span className="cp-score-label">{label}</span>
                      <div className="cp-score-bar-bg">
                        <div
                          className="cp-score-bar-fill"
                          style={{
                            width: `${Math.min(value || 0, 100)}%`,
                            background: color,
                          }}
                        />
                      </div>
                      <span className="cp-score-num">{value ?? "—"}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="cp-actions">
                  <button
                    className={`cp-btn-shortlist ${isShort ? "cp-btn-shortlist--active" : ""}`}
                    onClick={() => toggleShortlist(c.name)}
                  >
                    {isShort ? "★ Shortlisted" : "☆ Shortlist"}
                  </button>
                  <button
                    className="cp-btn-chat"
                    onClick={() => onChat(c)}
                  >
                    💬 Chat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}