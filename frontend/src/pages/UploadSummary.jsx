import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/ona-ai-logo.png";
import AvatarBox from "../components/AvatarBox";

export default function UploadSummary() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [avatarState, setAvatarState] = useState("idle");
  
  // const API_BASE = "http://127.0.0.1:8000";
  // const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ona-ai-2-production.up.railway.app";

  console.log('API BASE:', import.meta.env.VITE_API_BASE_URL);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a document first.");
      return;
    }

    const validTypes = ['application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF file only.");
      return;
    }

    setProcessing(true);
    setError("");
    setSummary("");
    setAudioSrc("");
    setAvatarState("processing");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/summarize/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Backend response:", data);

      if (data.summary_text && data.audio_content) {
        setSummary(data.summary_text);
        setAudioSrc(data.audio_content);
        setAvatarState("speaking");
      } else {
        console.error("Unexpected backend response:", data);
        setError("Failed to get summary from backend");
        setAvatarState("idle");
      }
    } catch (err) {
      console.error("Error during upload:", err);
      setError("Error: " + err.message);
      setAvatarState("idle");
    } finally {
      setProcessing(false);
    }
  };

  const handleContinue = () => {
    // Pass the summary data to the GeneratedWork page
    navigate("/generated", { 
      state: { 
        summary: summary,
        fileName: file?.name || "document"
      } 
    });
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
          
          {audioSrc && (
            <div style={{ marginTop: "15px" }}>
              <audio controls style={{ width: "100%" }}>
                <source src={audioSrc} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        className="option-btn"
        onChange={handleFileChange}
        accept=".pdf"
        disabled={processing}
      />

      <button
        className="option-btn"
        onClick={handleUpload}
        disabled={processing || !file}
      >
        {processing ? "Processing..." : "Summarize & Read"}
      </button>

      {summary && (
        <button
          className="option-btn"
          onClick={handleContinue}
        >
          ➡️ Continue to Generated Work
        </button>
      )}

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}