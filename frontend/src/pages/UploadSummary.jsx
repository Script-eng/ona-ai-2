import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/ona-ai-logo.png";
import AvatarBox from "../components/AvatarBox";

export default function UploadSummary() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [avatarState, setAvatarState] = useState("idle");

  const sessionId = "default";
  const API_BASE = "http://192.168.0.116:7000";

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a document first.");
      return;
    }
    setProcessing(true);
    setError("");
    setSummary("");
    setAvatarState("processing");

    try {
      // 🔑 Clear session before summarizing a new document
      fetch(`${API_BASE}/api/clear-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      }).catch((err) => console.error("Clear session failed:", err));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", sessionId);

      // 🔑 Adjust endpoint name once confirmed by backend team
      const res = await fetch(`${API_BASE}/api/summarize`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setAvatarState("speaking");
      } else {
        setError(data.error || "Failed to summarize document");
        setAvatarState("idle");
      }
    } catch (err) {
      setError("Network error: " + err.message);
      setAvatarState("idle");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-screen">
      <div className="page-header">
        <img src={logo} alt="Ona AI Logo" />
        <h1>Ona AI</h1>
      </div>
      <h3 style={{ marginBottom: "10px" }}>Upload a document to summarize</h3>

      <AvatarBox state={avatarState} />

      {summary && (
        <div className="card">
          <h4>Summary:</h4>
          <p>{summary}</p>
        </div>
      )}

      <input
        type="file"
        className="option-btn"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt"
      />
      <button
        className="option-btn"
        onClick={handleUpload}
        disabled={processing}
      >
        {processing ? "Processing..." : "Summarize & Read"}
      </button>

      {summary && (
        <button
          className="option-btn"
          onClick={() => navigate("/generated")}
        >
          ➡️ Continue to Generated Work
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
