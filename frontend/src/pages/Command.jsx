import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../assets/ona-ai-logo.png";
import AvatarBox from "../components/AvatarBox";

export default function Command() {
  const [sessionId] = useState("default");

  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [transcription, setTranscription] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");

  const [showImprove, setShowImprove] = useState(false);
  const [improveInput, setImproveInput] = useState("");
  const [editRecording, setEditRecording] = useState(false);
  const [editTranscription, setEditTranscription] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const editRecorderRef = useRef(null);
  const editChunksRef = useRef([]);

  const navigate = useNavigate();

  const blobToWebmFile = (chunks, name = "recording.webm") => {
    const audioBlob = new Blob(chunks, { type: "audio/webm" });
    return new File([audioBlob], name, { type: "audio/webm" });
  };

  const callTranscribe = async (file) => {
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("session_id", sessionId);
    const res = await fetch("http://localhost:5000/api/transcribe", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Transcription failed");
    return data.transcription;
  };

  const callChat = async (text) => {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, session_id: sessionId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Chat failed");
    return data.response;
  };

  const addToDocument = async (content, speaker = "AI Assistant") => {
    await fetch("http://localhost:5000/api/add-to-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, session_id: sessionId, speaker, content_type: "paragraph" }),
    });
  };

  const callImprove = async (instruction) => {
    const res = await fetch("http://localhost:5000/api/improve-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ improvement_instruction: instruction, session_id: sessionId }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Improve failed");
    return data.improved_response;
  };

  // Recording flow
  const startRecording = async () => {
    try {
      setError("");
      setTranscription("");
      setAiResponse("");
      setProcessing(false);

      // 🔑 Clear session in background (non-blocking)
      fetch("http://localhost:5000/api/clear-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      }).catch((err) => console.error("Clear session failed:", err));

      // 🎤 Start microphone recording immediately
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.start();
      setRecording(true);
    } catch (err) {
      setError("Microphone denied: " + err.message);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    setRecording(false);
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      try {
        setProcessing(true);
        const file = blobToWebmFile(audioChunksRef.current);
        const text = await callTranscribe(file);
        setTranscription(text);
        const response = await callChat(text);
        setAiResponse(response);
        await addToDocument(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setProcessing(false);
      }
    };
  };

  // Improve via text
  const handleImproveText = async () => {
    if (!improveInput.trim()) return;
    try {
      setProcessing(true);
      const improved = await callImprove(improveInput.trim());
      setAiResponse(improved);
      await addToDocument(improved, "AI Assistant (improved)");
      setImproveInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Improve via voice
  const startEditRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      editChunksRef.current = [];
      editRecorderRef.current = mr;

      mr.ondataavailable = (e) => { if (e.data.size > 0) editChunksRef.current.push(e.data); };
      mr.start();
      setEditRecording(true);
    } catch (err) {
      setError("Microphone denied: " + err.message);
    }
  };

  const stopEditRecording = () => {
    if (!editRecorderRef.current) return;
    editRecorderRef.current.stop();
    setEditRecording(false);

    editRecorderRef.current.onstop = async () => {
      try {
        setProcessing(true);
        const file = blobToWebmFile(editChunksRef.current, "editRecording.webm");
        const text = await callTranscribe(file);
        setEditTranscription(text);
        const improved = await callImprove(text);
        setAiResponse(improved);
        await addToDocument(improved, "AI Assistant (improved via voice)");
      } catch (err) {
        setError(err.message);
      } finally {
        setProcessing(false);
      }
    };
  };

  // Avatar state logic
  const avatarState = processing
    ? "processing"
    : recording
    ? "listening"
    : aiResponse
    ? "speaking"
    : "idle";

  return (
    <div className="page-screen">
      <div className="page-header">
        <img src={logo} alt="Ona AI Logo" />
        <h1>Ona AI</h1>
      </div>

      {/* One avatar only, based on state */}
      <AvatarBox state={avatarState} />

      <p className="status-text">
        {recording ? "🎤 Ona AI is listening..."
          : processing ? "⏳ Processing..."
          : "✅ Ona AI is ready"}
      </p>

      {/* Idle state */}
      {!recording && !transcription && !aiResponse && (
        <>
          <div className="tip-card">
            <h3>🎤 Make a voice command</h3>
            <p>Eg: “Write me an essay on dolphins in the ecosystem.”</p>
          </div>
          <button className="option-btn" onClick={startRecording} disabled={processing}>
            🎤 Engage Ona AI
          </button>
        </>
      )}

      {/* Recording */}
      {recording && (
        <button className="option-btn" onClick={stopRecording}>
          ⏹️ Stop Recording
        </button>
      )}

      {/* Processing */}
      {processing && (
        <p className="status-text">⏳ Processing your command…</p>
      )}

      {/* Transcription */}
      {transcription && (
        <div className="card">
          <h4>Transcription:</h4>
          <p>{transcription}</p>
        </div>
      )}

      {/* AI Response */}
      {aiResponse && (
        <>
          <div className="card">
            <h4>AI Response:</h4>
            <p>{aiResponse}</p>
          </div>

          <button className="option-btn" onClick={() => setShowImprove(!showImprove)}>
            ✍️ Make edit suggestions
          </button>

          {showImprove && (
            <div className="card">
              <input
                type="text"
                className="text-input"
                placeholder='e.g. "Make this more formal"'
                value={improveInput}
                onChange={(e) => setImproveInput(e.target.value)}
              />
              <button className="option-btn" onClick={handleImproveText} disabled={processing}>
                ✍️ Improve via Text
              </button>

              {!editRecording ? (
                <button className="option-btn" onClick={startEditRecording} disabled={processing}>
                  🎤 Improve via Voice Command
                </button>
              ) : (
                <>
                  <p className="status-text">🎤 Listening for improvement instruction…</p>
                  <button className="option-btn" onClick={stopEditRecording}>
                    ⏹️ Stop Voice Command
                  </button>
                </>
              )}

              {editTranscription && (
                <p><strong>Heard:</strong> {editTranscription}</p>
              )}
            </div>
          )}

          <button className="option-btn" onClick={() => navigate("/generated")}>
            ➡️ Continue to Generated Work
          </button>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
