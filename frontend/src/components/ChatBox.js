import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function ChatBox({ candidate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (candidate) {
      setMessages([{
        role: "bot",
        text: `Hi! I'm ready to tell you about **${candidate.name}**. Ask me anything — their skills, experience, fit, or interview questions.`,
      }]);
    } else {
      setMessages([]);
    }
  }, [candidate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !candidate) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        candidate,
        message: input,
      });
      setMessages((prev) => [...prev, { role: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Could not connect to the backend. Please ensure the server is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbox-card">
      {/* Header */}
      <div className="chatbox-header">
        <div className="chatbox-avatar">🤖</div>
        <div>
          <div className="chatbox-title">
            {candidate ? candidate.name : "AI Assistant"}
          </div>
          <div className="chatbox-status">
            {candidate ? "● Candidate selected" : "Select a candidate"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chatbox">
        {!candidate && (
          <div className="empty-state" style={{ padding: "24px" }}>
            <div className="empty-icon">💬</div>
            <p>Select a candidate from the table to start a conversation.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "bot" ? "bot" : "user"}>
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bot" style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <span style={{ animation: "bounce 0.8s infinite 0.0s" }}>●</span>
            <span style={{ animation: "bounce 0.8s infinite 0.15s" }}>●</span>
            <span style={{ animation: "bounce 0.8s infinite 0.3s" }}>●</span>
            <style>{`
              @keyframes bounce {
                0%, 100% { opacity: 0.3; transform: translateY(0); }
                50%       { opacity: 1;   transform: translateY(-3px); }
              }
            `}</style>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chatbox-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={candidate ? "Ask about this candidate…" : "Select a candidate first"}
          disabled={!candidate}
        />
        <button
          onClick={sendMessage}
          disabled={!candidate || !input.trim() || loading}
          style={{ padding: "9px 14px" }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatBox;