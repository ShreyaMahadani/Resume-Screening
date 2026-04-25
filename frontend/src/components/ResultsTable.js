import React, { useState } from "react";

function ScorePill({ value }) {
  if (value === undefined || value === null) return <span style={{ color: "#3a4560" }}>—</span>;
  const n = Number(value);
  const cls = n >= 75 ? "high" : n >= 50 ? "mid" : "low";
  return <span className={`score-pill ${cls}`}>{n}%</span>;
}

function RankBadge({ rank }) {
  const cls = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "";
  return <span className={`rank-badge ${cls}`}>{rank}</span>;
}

function ResultsTable({ candidates, onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (c) => {
    setSelected(c.name);
    onSelect(c);
  };

  if (!candidates || candidates.length === 0) {
    return (
      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title">Candidate Results</div>
            <div className="section-subtitle">Matched candidates will appear here</div>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <p>No candidates yet.<br />Submit a job description to see AI-ranked results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <div className="section-title">Candidate Results</div>
          <div className="section-subtitle">{candidates.length} candidates ranked by AI</div>
        </div>
        <span style={{
          background: "rgba(108,99,255,0.12)",
          color: "#a89eff",
          fontSize: "12px",
          fontWeight: 600,
          padding: "4px 12px",
          borderRadius: "20px"
        }}>
          {candidates.length} found
        </span>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Match</th>
              <th>Interest</th>
              <th>Final Score</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr
                key={c.name || i}
                onClick={() => handleSelect(c)}
                style={{
                  background: selected === c.name ? "rgba(108,99,255,0.08)" : undefined,
                  outline: selected === c.name ? "1px solid rgba(108,99,255,0.25)" : undefined,
                }}
              >
                <td><RankBadge rank={i + 1} /></td>
                <td>
                  <div style={{ fontWeight: 500 }}>{c.name}</div>
                  {c.role && <div style={{ fontSize: "11px", color: "#6b7a99", marginTop: "2px" }}>{c.role}</div>}
                </td>
                <td><ScorePill value={c.match_score} /></td>
                <td><ScorePill value={c.interest_score} /></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ScorePill value={c.final_score} />
                    <div style={{
                      flex: 1,
                      height: "4px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "99px",
                      overflow: "hidden",
                      minWidth: "40px",
                    }}>
                      <div style={{
                        width: `${Math.min(c.final_score || 0, 100)}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #6c63ff, #00d4ff)",
                        borderRadius: "99px",
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsTable;