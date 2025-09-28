import React, { useState, useEffect } from "react";
import "../App.css";
import ListeningBars from "../components/ListeningBars";
import { initAudio, onSpeechStart, onSpeechEnd, cleanupAudio } from "../services/audioService";

export default function InputMethod() {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      initAudio();
      onSpeechStart(() => setIsListening(true));
      onSpeechEnd(() => setIsListening(false));
    } catch (err) {
      setError("Audio init failed");
    }

    return () => cleanupAudio();
  }, []);

  return (
    <div className="page-screen">
      <ListeningBars isListening={isListening} />
      <h1 className="page-title">Ona AI</h1>
      <h1>Choose main input / output method</h1>
      <div className="video-placeholder">▶</div>
      <button className="option-btn" onClick={() => (window.location.href = "/language")}>
        Voice navigation
      </button>
      <button className="option-btn" onClick={() => (window.location.href = "/language")}>
        Motion gesture navigation
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}