import React, { useState } from "react";

function JDInput({ onSubmit }) {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!jd.trim()) return;
    setLoading(true);
    await onSubmit(jd);
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste job description here… e.g. 'We are looking for a Senior React Developer with 5+ years of experience…'"
      />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        {jd && (
          <button
            className="btn-outline"
            onClick={() => setJd("")}
          >
            Clear
          </button>
        )}
        <button onClick={handleSubmit} disabled={loading || !jd.trim()}>
          {loading ? (
            <>
              <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span>
              Analyzing…
            </>
          ) : (
            <>⚡ Analyze & Match</>
          )}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default JDInput;