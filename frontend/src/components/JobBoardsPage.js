import React, { useState, useMemo } from "react";
import "./JobBoardsPage.css";

/* ── Static seed data ─────────────────────────────────────── */
const SEED_JOBS = [
  {
    id: 1,
    title: "Senior Python Developer",
    department: "Engineering",
    type: "Full-time",
    location: "Remote",
    experience: "4+ years",
    requiredSkills: ["Python", "Django", "SQL"],
    salary: "₹18L – ₹24L",
    posted: "2 days ago",
    deadline: "2024-02-15",
    status: "Active",
    applicants: 0,
    priority: "High",
    description: "We are looking for a Senior Python Developer to join our backend team. You will design scalable APIs, optimize database queries, and mentor junior developers.",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    department: "Product",
    type: "Full-time",
    location: "Bangalore",
    experience: "3+ years",
    requiredSkills: ["Python", "React", "SQL"],
    salary: "₹14L – ₹20L",
    posted: "5 days ago",
    deadline: "2024-02-20",
    status: "Active",
    applicants: 0,
    priority: "High",
    description: "Join our product team to build end-to-end features across the stack. Strong Python backend + React frontend skills required.",
  },
  {
    id: 3,
    title: "Django Backend Engineer",
    department: "Engineering",
    type: "Contract",
    location: "Remote",
    experience: "2+ years",
    requiredSkills: ["Python", "Django", "Flask"],
    salary: "₹10L – ₹14L",
    posted: "1 week ago",
    deadline: "2024-02-28",
    status: "Active",
    applicants: 0,
    priority: "Medium",
    description: "6-month contract role to help migrate legacy services to Django REST framework. Strong API design skills needed.",
  },
  {
    id: 4,
    title: "Data Engineer",
    department: "Data",
    type: "Full-time",
    location: "Pune",
    experience: "2+ years",
    requiredSkills: ["Python", "SQL"],
    salary: "₹12L – ₹16L",
    posted: "2 weeks ago",
    deadline: "2024-03-01",
    status: "Paused",
    applicants: 0,
    priority: "Medium",
    description: "Build and maintain data pipelines, ETL processes, and reporting infrastructure. Experience with SQL and Python required.",
  },
  {
    id: 5,
    title: "Java Backend Developer",
    department: "Platform",
    type: "Full-time",
    location: "Hyderabad",
    experience: "3+ years",
    requiredSkills: ["Java", "Spring", "SQL"],
    salary: "₹12L – ₹18L",
    posted: "3 weeks ago",
    deadline: "2024-03-05",
    status: "Closed",
    applicants: 0,
    priority: "Low",
    description: "Work on our core platform services using Java Spring Boot. Microservices and REST API experience preferred.",
  },
];

const DEPARTMENTS = ["All", "Engineering", "Product", "Data", "Platform", "Design", "DevOps"];
const JOB_TYPES   = ["All", "Full-time", "Part-time", "Contract", "Internship"];
const LOCATIONS   = ["All", "Remote", "Bangalore", "Pune", "Hyderabad", "Mumbai", "Delhi"];
const PRIORITIES  = ["High", "Medium", "Low"];
const STATUSES    = ["Active", "Paused", "Closed"];

const EMPTY_FORM = {
  title: "", department: "Engineering", type: "Full-time",
  location: "Remote", experience: "", requiredSkills: "",
  salary: "", deadline: "", priority: "High", description: "",
};

/* ── helpers ──────────────────────────────────────────────── */
function matchCandidatesForJob(job, candidates) {
  if (!candidates?.length) return [];
  return candidates
    .filter((c) => (c.skills || []).some((s) => job.requiredSkills.includes(s)))
    .map((c) => {
      const matched = (c.skills || []).filter((s) => job.requiredSkills.includes(s));
      const fit = Math.round((matched.length / job.requiredSkills.length) * 100);
      return { ...c, matchedSkills: matched, fitScore: fit };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 5);
}

/* ── sub-components ───────────────────────────────────────── */
function StatusBadge({ status }) {
  const cls = status === "Active" ? "active" : status === "Paused" ? "paused" : "closed";
  return <span className={`jb-status jb-status--${cls}`}>{status}</span>;
}

function PriorityBadge({ priority }) {
  const cls = priority === "High" ? "high" : priority === "Medium" ? "mid" : "low";
  return <span className={`jb-priority jb-priority--${cls}`}>{priority}</span>;
}

function JobCard({ job, onSelect, selected, candidates }) {
  const matched = useMemo(() => matchCandidatesForJob(job, candidates), [job, candidates]);
  const isSelected = selected?.id === job.id;

  return (
    <div
      className={`jb-card ${isSelected ? "jb-card--selected" : ""} jb-card--${job.status.toLowerCase()}`}
      onClick={() => onSelect(job)}
    >
      <div className="jb-card-top">
        <div className="jb-dept-icon">{job.department[0]}</div>
        <div className="jb-card-meta">
          <div className="jb-card-title">{job.title}</div>
          <div className="jb-card-dept">{job.department} · {job.type}</div>
        </div>
        <PriorityBadge priority={job.priority} />
      </div>

      <div className="jb-card-info">
        <span className="jb-info-chip">📍 {job.location}</span>
        <span className="jb-info-chip">🎓 {job.experience}</span>
        <span className="jb-info-chip">💰 {job.salary}</span>
      </div>

      <div className="jb-card-skills">
        {job.requiredSkills.map((s) => (
          <span key={s} className="jb-skill-tag">{s}</span>
        ))}
      </div>

      <div className="jb-card-footer">
        <StatusBadge status={job.status} />
        <span className="jb-posted">Posted {job.posted}</span>
        {matched.length > 0 && (
          <span className="jb-matched-badge">
            ✦ {matched.length} matched candidate{matched.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

function JobDetail({ job, candidates, onClose, onStatusChange }) {
  const matched = useMemo(() => matchCandidatesForJob(job, candidates), [job, candidates]);

  return (
    <div className="jb-detail">
      <div className="jb-detail-header">
        <div>
          <div className="jb-detail-title">{job.title}</div>
          <div className="jb-detail-sub">{job.department} · {job.type} · {job.location}</div>
        </div>
        <button className="btn-ghost jb-close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="jb-detail-badges">
        <StatusBadge status={job.status} />
        <PriorityBadge priority={job.priority} />
        <span className="jb-info-chip">🎓 {job.experience}</span>
        <span className="jb-info-chip">💰 {job.salary}</span>
        {job.deadline && <span className="jb-info-chip">📅 Deadline: {job.deadline}</span>}
      </div>

      <div className="jb-detail-section">
        <div className="jb-detail-section-title">Job Description</div>
        <p className="jb-detail-desc">{job.description}</p>
      </div>

      <div className="jb-detail-section">
        <div className="jb-detail-section-title">Required Skills</div>
        <div className="jb-card-skills">
          {job.requiredSkills.map((s) => (
            <span key={s} className="jb-skill-tag jb-skill-tag--lg">{s}</span>
          ))}
        </div>
      </div>

      <div className="jb-detail-section">
        <div className="jb-detail-section-title">
          Matched Candidates
          <span className="jb-match-count">{matched.length} found from your pool</span>
        </div>
        {matched.length === 0 ? (
          <div className="jb-no-match">No candidates in your current pool match this role yet.</div>
        ) : (
          <div className="jb-match-list">
            {matched.map((c) => (
              <div className="jb-match-row" key={c.name}>
                <div className="jb-match-avatar">{c.name[0]}</div>
                <div className="jb-match-info">
                  <div className="jb-match-name">{c.name}</div>
                  <div className="jb-match-skills">
                    {(c.skills || []).map((s) => (
                      <span
                        key={s}
                        className={`jb-skill-tag jb-skill-tag--sm ${c.matchedSkills.includes(s) ? "jb-skill-tag--hit" : ""}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="jb-match-fit">
                  <div className="jb-fit-score" style={{
                    color: c.fitScore >= 80 ? "#00e5a0" : c.fitScore >= 50 ? "#6c63ff" : "#ffb547"
                  }}>
                    {c.fitScore}%
                  </div>
                  <div className="jb-fit-label">fit</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="jb-detail-actions">
        {STATUSES.filter(s => s !== job.status).map((s) => (
          <button
            key={s}
            className={`btn-outline jb-status-btn jb-status-btn--${s.toLowerCase()}`}
            onClick={() => onStatusChange(job.id, s)}
          >
            Mark as {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function PostJobModal({ onClose, onPost }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())            e.title = "Required";
    if (!form.experience.trim())       e.experience = "Required";
    if (!form.requiredSkills.trim())   e.requiredSkills = "Required";
    if (!form.salary.trim())           e.salary = "Required";
    if (!form.deadline)                e.deadline = "Required";
    if (!form.description.trim())      e.description = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePost = () => {
    if (!validate()) return;
    onPost({
      ...form,
      id: Date.now(),
      requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      posted: "Just now",
      status: "Active",
      applicants: 0,
    });
    onClose();
  };

  return (
    <div className="jb-modal-overlay" onClick={onClose}>
      <div className="jb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jb-modal-header">
          <div className="jb-modal-title">Post New Job</div>
          <button className="btn-ghost jb-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="jb-modal-body">
          <div className="jb-form-grid">
            <div className="jb-field jb-field--full">
              <label className="jb-label">Job Title *</label>
              <input className={`jb-input ${errors.title ? "jb-input--err" : ""}`} placeholder="e.g. Senior Python Developer" value={form.title} onChange={(e) => set("title", e.target.value)} />
              {errors.title && <span className="jb-err">{errors.title}</span>}
            </div>

            <div className="jb-field">
              <label className="jb-label">Department</label>
              <select className="jb-select" value={form.department} onChange={(e) => set("department", e.target.value)}>
                {DEPARTMENTS.filter(d => d !== "All").map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div className="jb-field">
              <label className="jb-label">Job Type</label>
              <select className="jb-select" value={form.type} onChange={(e) => set("type", e.target.value)}>
                {JOB_TYPES.filter(t => t !== "All").map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="jb-field">
              <label className="jb-label">Location</label>
              <select className="jb-select" value={form.location} onChange={(e) => set("location", e.target.value)}>
                {LOCATIONS.filter(l => l !== "All").map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div className="jb-field">
              <label className="jb-label">Experience Required *</label>
              <input className={`jb-input ${errors.experience ? "jb-input--err" : ""}`} placeholder="e.g. 3+ years" value={form.experience} onChange={(e) => set("experience", e.target.value)} />
              {errors.experience && <span className="jb-err">{errors.experience}</span>}
            </div>

            <div className="jb-field jb-field--full">
              <label className="jb-label">Required Skills * <span style={{fontWeight:400,opacity:0.6}}>(comma-separated)</span></label>
              <input className={`jb-input ${errors.requiredSkills ? "jb-input--err" : ""}`} placeholder="e.g. Python, Django, SQL" value={form.requiredSkills} onChange={(e) => set("requiredSkills", e.target.value)} />
              {errors.requiredSkills && <span className="jb-err">{errors.requiredSkills}</span>}
              {form.requiredSkills && (
                <div className="jb-skill-preview">
                  {form.requiredSkills.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s} className="jb-skill-tag">{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="jb-field">
              <label className="jb-label">Salary Range *</label>
              <input className={`jb-input ${errors.salary ? "jb-input--err" : ""}`} placeholder="e.g. ₹12L – ₹18L" value={form.salary} onChange={(e) => set("salary", e.target.value)} />
              {errors.salary && <span className="jb-err">{errors.salary}</span>}
            </div>

            <div className="jb-field">
              <label className="jb-label">Application Deadline *</label>
              <input type="date" className={`jb-input ${errors.deadline ? "jb-input--err" : ""}`} value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
              {errors.deadline && <span className="jb-err">{errors.deadline}</span>}
            </div>

            <div className="jb-field jb-field--full">
              <label className="jb-label">Priority</label>
              <div className="jb-priority-select">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    className={`jb-priority-opt ${form.priority === p ? "jb-priority-opt--active" : ""} jb-priority-opt--${p.toLowerCase()}`}
                    onClick={() => set("priority", p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="jb-field jb-field--full">
              <label className="jb-label">Job Description *</label>
              <textarea
                className={`jb-textarea ${errors.description ? "jb-input--err" : ""}`}
                placeholder="Describe responsibilities, requirements, and what you're looking for…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
              {errors.description && <span className="jb-err">{errors.description}</span>}
            </div>
          </div>
        </div>

        <div className="jb-modal-footer">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button onClick={handlePost}>⊕ Post Job</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────── */
export default function JobBoardsPage({ candidates }) {
  const [jobs, setJobs]           = useState(SEED_JOBS);
  const [selected, setSelected]   = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [filterDept, setFilterDept]   = useState("All");
  const [filterType, setFilterType]   = useState("All");
  const [filterLoc, setFilterLoc]     = useState("All");
  const [activeTab, setActiveTab]     = useState("All");   // ← single source of truth for status filter

  // ── FIX: tabs derived from jobs state so they always reflect current data ──
  const tabs = useMemo(() => [
    { label: "All",    count: jobs.length },
    { label: "Active", count: jobs.filter(j => j.status === "Active").length },
    { label: "Paused", count: jobs.filter(j => j.status === "Paused").length },
    { label: "Closed", count: jobs.filter(j => j.status === "Closed").length },
  ], [jobs]);

  // ── FIX: filtered fully derived, activeTab drives status filter ──
  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (activeTab !== "All" && j.status !== activeTab) return false;
      if (filterDept !== "All" && j.department !== filterDept) return false;
      if (filterType !== "All" && j.type !== filterType) return false;
      if (filterLoc  !== "All" && j.location  !== filterLoc)  return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          j.title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.requiredSkills.some(s => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [jobs, activeTab, filterDept, filterType, filterLoc, search]);

  // ── FIX: after posting, switch to "All" tab so the new job is always visible ──
  const handlePost = (job) => {
    setJobs((prev) => [job, ...prev]);
    setActiveTab("All");        // ← guarantee the new job appears
    setSearch("");              // clear search too
    setFilterDept("All");
    setFilterType("All");
    setFilterLoc("All");
  };

  const handleStatusChange = (id, newStatus) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status: newStatus } : j));
    // also update the selected panel so status badge refreshes immediately
    setSelected((prev) => prev?.id === id ? { ...prev, status: newStatus } : prev);
  };

  // ── FIX: sidebar badge reflects actual jobs.length, not hardcoded 5 ──
  const kpis = useMemo(() => ({
    total:        jobs.length,
    active:       jobs.filter(j => j.status === "Active").length,
    paused:       jobs.filter(j => j.status === "Paused").length,
    closed:       jobs.filter(j => j.status === "Closed").length,
    totalMatched: jobs.reduce((acc, j) => acc + matchCandidatesForJob(j, candidates).length, 0),
  }), [jobs, candidates]);

  return (
    <div className="jb-page">

      {/* ── KPI strip ── */}
      <div className="jb-kpi-row">
        {[
          { label: "Total Jobs",        value: kpis.total,        icon: "⊕", color: "#6c63ff" },
          { label: "Active",            value: kpis.active,       icon: "●", color: "#00e5a0" },
          { label: "Paused",            value: kpis.paused,       icon: "◐", color: "#ffb547" },
          { label: "Closed",            value: kpis.closed,       icon: "○", color: "#ff6b8a" },
          { label: "Candidate Matches", value: kpis.totalMatched, icon: "✦", color: "#00d4ff" },
        ].map((k, i) => (
          <div className="jb-kpi" key={k.label} style={{ animationDelay: `${i * 0.06}s` }}>
            <span className="jb-kpi-icon" style={{ color: k.color }}>{k.icon}</span>
            <span className="jb-kpi-value" style={{ color: k.color }}>{k.value}</span>
            <span className="jb-kpi-label">{k.label}</span>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="jb-controls">
        {/* Status tabs — counts always live */}
        <div className="jb-tabs">
          {tabs.map((t) => (
            <button
              key={t.label}
              className={`jb-tab ${activeTab === t.label ? "jb-tab--active" : ""}`}
              onClick={() => setActiveTab(t.label)}
            >
              {t.label}
              <span className="jb-tab-count">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="jb-controls-right">
          <div className="jb-search-wrap">
            <span className="jb-search-icon">⌕</span>
            <input
              className="jb-search"
              placeholder="Search title, dept, skill…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button className="jb-search-clear" onClick={() => setSearch("")}>✕</button>}
          </div>

          <select className="jb-select-sm" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>

          <select className="jb-select-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>

          <select className="jb-select-sm" value={filterLoc} onChange={(e) => setFilterLoc(e.target.value)}>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>

          <button onClick={() => setShowModal(true)}>⊕ Post Job</button>
        </div>
      </div>

      {/* ── Body: list + detail ── */}
      <div className={`jb-body ${selected ? "jb-body--split" : ""}`}>
        <div className="jb-list">
          {filtered.length === 0 ? (
            <div className="jb-empty">
              <div className="jb-empty-icon">⊕</div>
              <p>No jobs match your filters.</p>
            </div>
          ) : (
            filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                selected={selected}
                onSelect={setSelected}
                candidates={candidates}
              />
            ))
          )}
        </div>

        {selected && (
          <div className="jb-detail-wrap">
            <JobDetail
              job={selected}
              candidates={candidates}
              onClose={() => setSelected(null)}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>

      {showModal && (
        <PostJobModal onClose={() => setShowModal(false)} onPost={handlePost} />
      )}
    </div>
  );
}