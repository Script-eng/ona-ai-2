import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ✅ added
import "../App.css";
import logo from "../assets/ona-ai-logo.png";
import AvatarBox from "../components/AvatarBox";
import { initAudio, onSpeechStart, onSpeechEnd, cleanupAudio } from "../services/audioService";

export default function InputMethod() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();                 // ✅ added

  useEffect(() => {
    try {
      initAudio();
      onSpeechStart(() => setIsListening(true));
      onSpeechEnd(() => setIsListening(false));
    } catch {
      setError("Audio init failed");
    }
    return () => cleanupAudio();
  }, []);

  return (
    <div className="page-screen">
      <div className="page-header">
        <img src={logo} alt="Ona AI Logo" />
        <h1>Ona AI</h1>
      </div>

      <h1>Choose main input / output method</h1>
      <AvatarBox state={isListening ? "listening" : "idle"} />

      <button 
        className="option-btn" 
        onClick={() => navigate("/command")}   // ✅ go to command flow
      >
        Voice navigation
      </button>

      <button 
        className="option-btn" 
        onClick={() => navigate("/upload-summary")}   // ✅ go to upload flow
      >
        Upload a document
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
