import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, LineChart, Line, Cell, Legend,
} from "recharts";
import "./AnalyticsPage.css";

/* ── helpers ─────────────────────────────────────── */
const COLORS = ["#6c63ff","#00d4ff","#00e5a0","#ffb547","#ff6b8a","#a78bfa","#34d399","#f59e0b"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ap-tooltip">
      {label && <div className="ap-tooltip-label">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="ap-tooltip-row">
          <span style={{ color: p.color || p.fill }}>■</span>
          <span>{p.name || p.dataKey}</span>
          <span className="ap-tooltip-val">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ── main component ───────────────────────────────── */
export default function AnalyticsPage({ candidates }) {
  const data = useMemo(() => {
    if (!candidates.length) return null;

    /* 1. Score distribution buckets */
    const buckets = [
      { range: "0–20",  count: 0 },
      { range: "21–40", count: 0 },
      { range: "41–60", count: 0 },
      { range: "61–75", count: 0 },
      { range: "76–90", count: 0 },
      { range: "91–100",count: 0 },
    ];
    candidates.forEach((c) => {
      const s = c.final_score || 0;
      if      (s <= 20)  buckets[0].count++;
      else if (s <= 40)  buckets[1].count++;
      else if (s <= 60)  buckets[2].count++;
      else if (s <= 75)  buckets[3].count++;
      else if (s <= 90)  buckets[4].count++;
      else               buckets[5].count++;
    });

    /* 2. Skill frequency */
    const skillMap = {};
    candidates.forEach((c) =>
      (c.skills || []).forEach((s) => { skillMap[s] = (skillMap[s] || 0) + 1; })
    );
    const skillFreq = Object.entries(skillMap)
      .sort((a, b) => b[1] - a[1])
      .map(([skill, count]) => ({ skill, count }));

    /* 3. Experience distribution */
    const expMap = {};
    candidates.forEach((c) => {
      const key = `${c.experience} yr${c.experience !== 1 ? "s" : ""}`;
      expMap[key] = (expMap[key] || 0) + 1;
    });
    const expDist = Object.entries(expMap)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([exp, count]) => ({ exp, count }));

    /* 4. Match vs Interest scatter */
    const scatter = candidates.map((c) => ({
      name: c.name,
      match: c.match_score || 0,
      interest: c.interest_score || 0,
      final: c.final_score || 0,
    }));

    /* 5. Top 5 by final score (for radar) */
    const top5 = [...candidates]
      .sort((a, b) => (b.final_score || 0) - (a.final_score || 0))
      .slice(0, 5)
      .map((c) => ({
        name: c.name,
        Match: c.match_score || 0,
        Interest: c.interest_score || 0,
        Final: c.final_score || 0,
        Experience: Math.min((c.experience || 0) * 18, 100),
        Skills: Math.min((c.skills?.length || 0) * 25, 100),
      }));

    /* 6. Score comparison bar (top 8) */
    const scoreComp = [...candidates]
      .sort((a, b) => (b.final_score || 0) - (a.final_score || 0))
      .slice(0, 8)
      .map((c) => ({
        name: c.name,
        Match: c.match_score || 0,
        Interest: c.interest_score || 0,
        Final: c.final_score || 0,
      }));

    /* 7. KPIs */
    const avg = (arr) => Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
    const kpis = {
      avgMatch:    avg(candidates.map((c) => c.match_score || 0)),
      avgInterest: avg(candidates.map((c) => c.interest_score || 0)),
      avgFinal:    avg(candidates.map((c) => c.final_score || 0)),
      topScore:    Math.max(...candidates.map((c) => c.final_score || 0)),
      strongHires: candidates.filter((c) => (c.final_score || 0) >= 80).length,
      potential:   candidates.filter((c) => (c.final_score || 0) >= 60 && (c.final_score || 0) < 80).length,
      weakFit:     candidates.filter((c) => (c.final_score || 0) < 60).length,
      totalSkills: Object.keys(skillMap).length,
    };

    return { buckets, skillFreq, expDist, scatter, top5, scoreComp, kpis };
  }, [candidates]);

  /* ── empty state ── */
  if (!candidates.length || !data) {
    return (
      <div className="ap-empty">
        <div className="ap-empty-icon">◇</div>
        <p>No data yet. Submit a Job Description from the Dashboard to generate analytics.</p>
      </div>
    );
  }

  const { buckets, skillFreq, expDist, scatter, top5, scoreComp, kpis } = data;

  return (
    <div className="ap-page">

      {/* ── KPI strip ── */}
      <div className="ap-kpi-row">
        {[
          { label: "Avg Match",    value: kpis.avgMatch + "%",    color: "#6c63ff", icon: "⚡" },
          { label: "Avg Interest", value: kpis.avgInterest + "%", color: "#00d4ff", icon: "💡" },
          { label: "Avg Final",    value: kpis.avgFinal + "%",    color: "#00e5a0", icon: "🎯" },
          { label: "Top Score",    value: kpis.topScore + "%",    color: "#ffb547", icon: "🏆" },
          { label: "Strong Hires", value: kpis.strongHires,       color: "#00e5a0", icon: "✅" },
          { label: "Potential",    value: kpis.potential,         color: "#ffb547", icon: "🟡" },
          { label: "Weak Fit",     value: kpis.weakFit,           color: "#ff6b8a", icon: "❌" },
          { label: "Unique Skills",value: kpis.totalSkills,       color: "#a78bfa", icon: "◈" },
        ].map((k) => (
          <div className="ap-kpi" key={k.label}>
            <span className="ap-kpi-icon">{k.icon}</span>
            <span className="ap-kpi-value" style={{ color: k.color }}>{k.value}</span>
            <span className="ap-kpi-label">{k.label}</span>
          </div>
        ))}
      </div>

      {/* ── Row 1: Score distribution + Skill frequency ── */}
      <div className="ap-row ap-row--2col">

        <div className="ap-card">
          <div className="ap-card-header">
            <div className="ap-card-title">Final Score Distribution</div>
            <div className="ap-card-sub">How candidates spread across score ranges</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={buckets} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="range" tick={{ fill: "#6b7a99", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7a99", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(108,99,255,0.06)" }} />
              <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]}>
                {buckets.map((_, i) => (
                  <Cell key={i} fill={i >= 3 ? "#6c63ff" : i === 2 ? "#ffb547" : "#ff6b8a"} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ap-card">
          <div className="ap-card-header">
            <div className="ap-card-title">Skill Frequency</div>
            <div className="ap-card-sub">How often each skill appears across candidates</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillFreq} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#6b7a99", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="skill" type="category" tick={{ fill: "#a0aec0", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(108,99,255,0.06)" }} />
              <Bar dataKey="count" name="Count" radius={[0, 6, 6, 0]}>
                {skillFreq.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ── Row 2: Score comparison grouped bar + Experience dist ── */}
      <div className="ap-row ap-row--ratio">

        <div className="ap-card">
          <div className="ap-card-header">
            <div className="ap-card-title">Score Comparison — Top 8</div>
            <div className="ap-card-sub">Match · Interest · Final side by side</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scoreComp} barGap={2} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#6b7a99", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#6b7a99", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(108,99,255,0.06)" }} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#6b7a99", paddingTop: "8px" }} />
              <Bar dataKey="Match"    fill="#6c63ff" radius={[4,4,0,0]} fillOpacity={0.85} />
              <Bar dataKey="Interest" fill="#00d4ff" radius={[4,4,0,0]} fillOpacity={0.85} />
              <Bar dataKey="Final"    fill="#00e5a0" radius={[4,4,0,0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ap-card">
          <div className="ap-card-header">
            <div className="ap-card-title">Experience Breakdown</div>
            <div className="ap-card-sub">Candidate count by years of experience</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={expDist} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="exp" tick={{ fill: "#6b7a99", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7a99", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(108,99,255,0.06)" }} />
              <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]}>
                {expDist.map((entry, i) => {
                  const exp = parseInt(entry.exp);
                  const color = exp >= 4 ? "#ffb547" : exp >= 2 ? "#6c63ff" : "#00d4ff";
                  return <Cell key={i} fill={color} fillOpacity={0.85} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="ap-exp-legend">
            <span><span style={{color:"#00d4ff"}}>■</span> Junior (&lt;2 yrs)</span>
            <span><span style={{color:"#6c63ff"}}>■</span> Mid (2–3 yrs)</span>
            <span><span style={{color:"#ffb547"}}>■</span> Senior (4+ yrs)</span>
          </div>
        </div>

      </div>

      {/* ── Row 3: Radar + Scatter ── */}
      <div className="ap-row ap-row--2col">

        <div className="ap-card">
          <div className="ap-card-header">
            <div className="ap-card-title">Top 5 — Radar Profile</div>
            <div className="ap-card-sub">Multi-dimensional view of best candidates</div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={[
              { metric: "Match",      ...Object.fromEntries(top5.map(c => [c.name, c.Match])) },
              { metric: "Interest",   ...Object.fromEntries(top5.map(c => [c.name, c.Interest])) },
              { metric: "Final",      ...Object.fromEntries(top5.map(c => [c.name, c.Final])) },
              { metric: "Experience", ...Object.fromEntries(top5.map(c => [c.name, c.Experience])) },
              { metric: "Skills",     ...Object.fromEntries(top5.map(c => [c.name, c.Skills])) },
            ]}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#6b7a99", fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              {top5.map((c, i) => (
                <Radar
                  key={c.name}
                  name={c.name}
                  dataKey={c.name}
                  stroke={COLORS[i]}
                  fill={COLORS[i]}
                  fillOpacity={0.08}
                  strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: "11px", color: "#6b7a99" }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="ap-card">
          <div className="ap-card-header">
            <div className="ap-card-title">Match vs Interest Scatter</div>
            <div className="ap-card-sub">Identify highly interested & high-match candidates</div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="match"
                name="Match Score"
                domain={[0, 100]}
                tick={{ fill: "#6b7a99", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{ value: "Match %", position: "insideBottom", offset: -2, fill: "#3a4560", fontSize: 11 }}
              />
              <YAxis
                dataKey="interest"
                name="Interest Score"
                domain={[0, 100]}
                tick={{ fill: "#6b7a99", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{ value: "Interest %", angle: -90, position: "insideLeft", fill: "#3a4560", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.1)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="ap-tooltip">
                      <div className="ap-tooltip-label">{d.name}</div>
                      <div className="ap-tooltip-row"><span>Match</span><span className="ap-tooltip-val">{d.match}%</span></div>
                      <div className="ap-tooltip-row"><span>Interest</span><span className="ap-tooltip-val">{d.interest}%</span></div>
                      <div className="ap-tooltip-row"><span>Final</span><span className="ap-tooltip-val">{d.final}%</span></div>
                    </div>
                  );
                }}
              />
              <Scatter data={scatter} name="Candidates">
                {scatter.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.final >= 80 ? "#00e5a0" : entry.final >= 60 ? "#6c63ff" : "#ff6b8a"}
                    fillOpacity={0.85}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="ap-exp-legend">
            <span><span style={{color:"#00e5a0"}}>●</span> Strong Hire (≥80)</span>
            <span><span style={{color:"#6c63ff"}}>●</span> Potential (60–79)</span>
            <span><span style={{color:"#ff6b8a"}}>●</span> Weak Fit (&lt;60)</span>
          </div>
        </div>

      </div>

      {/* ── Row 4: Leaderboard table ── */}
      <div className="ap-card">
        <div className="ap-card-header">
          <div className="ap-card-title">Full Candidate Leaderboard</div>
          <div className="ap-card-sub">All candidates ranked by final score</div>
        </div>
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Skills</th>
                <th>Exp</th>
                <th>Match</th>
                <th>Interest</th>
                <th>Final</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {[...candidates]
                .sort((a, b) => (b.final_score || 0) - (a.final_score || 0))
                .map((c, i) => {
                  const fs = c.final_score || 0;
                  const verdict = fs >= 80 ? { label: "Strong Hire", cls: "strong" }
                    : fs >= 60 ? { label: "Potential", cls: "potential" }
                    : { label: "Weak Fit", cls: "weak" };
                  return (
                    <tr key={c.name} className={i < 3 ? "ap-table-top" : ""}>
                      <td>
                        <span className={`ap-rank ap-rank--${i + 1 <= 3 ? i + 1 : "n"}`}>{i + 1}</span>
                      </td>
                      <td className="ap-table-name">{c.name}</td>
                      <td>
                        <div className="ap-tag-row">
                          {(c.skills || []).map((s) => (
                            <span key={s} className="ap-tag">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td>{c.experience} yr{c.experience !== 1 ? "s" : ""}</td>
                      <td><span className="ap-score-chip ap-score-chip--match">{c.match_score ?? "—"}</span></td>
                      <td><span className="ap-score-chip ap-score-chip--interest">{c.interest_score ?? "—"}</span></td>
                      <td>
                        <div className="ap-final-cell">
                          <span className="ap-score-chip ap-score-chip--final">{c.final_score ?? "—"}</span>
                          <div className="ap-mini-bar">
                            <div className="ap-mini-bar-fill" style={{ width: `${Math.min(fs, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td><span className={`ap-verdict ap-verdict--${verdict.cls}`}>{verdict.label}</span></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}