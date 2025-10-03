// import React, { useState, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import "../App.css";

// export default function GeneratedWork() {
//   const [sessionId] = useState("default");
//   const [preview, setPreview] = useState("");
//   const [error, setError] = useState("");
//   const [downloading, setDownloading] = useState(false);
//   const [title, setTitle] = useState("AI_Generated_Document");

//   const fetchPreview = async () => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/document-preview?session_id=${sessionId}`
//       );
//       const data = await res.json();
//       if (data.success) setPreview(data.preview || "");
//       else setError(data.error || "Could not load preview");
//     } catch (err) {
//       setError("Network error: " + err.message);
//     }
//   };

//   useEffect(() => {
//     fetchPreview();
//   }, []);

//   const handleDownload = async () => {
//     try {
//       setDownloading(true);
//       const res = await fetch("http://localhost:5000/api/generate-document", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ session_id: sessionId, title }),
//       });
//       if (!res.ok) throw new Error("Failed to generate document");
//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${title}.docx`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (err) {
//       setError("Download error: " + err.message);
//     } finally {
//       setDownloading(false);
//     }
//   };

//   return (
//     <div className="page-screen">
//       <h1 className="page-title">Ona AI</h1>

//       <div className="card">
//         <h3>Generate Work: Document Preview</h3>
//         {preview ? (
//           <div className="response-box">
//             <ReactMarkdown>{preview}</ReactMarkdown>
//           </div>
//         ) : (
//           <p>No content yet. Please create a command first.</p>
//         )}
//         <input
//           type="text"
//           className="text-input"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <button className="option-btn" onClick={handleDownload} disabled={downloading}>
//           {downloading ? "Downloading…" : "⬇️ Download Word Document"}
//         </button>
//       </div>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../App.css";
import logo from "../assets/ona-ai-logo.png";
import AvatarBox from "../components/AvatarBox";

export default function GeneratedWork() {
  const [sessionId] = useState("default");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [title, setTitle] = useState("AI_Generated_Document");

  const fetchPreview = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/document-preview?session_id=${sessionId}`
      );
      const data = await res.json();
      if (data.success) setPreview(data.preview || "");
      else setError(data.error || "Could not load preview");
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  useEffect(() => { fetchPreview(); }, []);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch("http://localhost:5000/api/generate-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, title }),
      });
      if (!res.ok) throw new Error("Failed to generate document");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Download error: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="page-screen">
      <div className="page-header">
        <img src={logo} alt="Ona AI Logo" />
        <h1>Ona AI</h1>
      </div>
      <h3>Generated Work</h3>

      <AvatarBox state="presenting" />

      <div className="card">
        {preview ? (
          <div className="response-box"><ReactMarkdown>{preview}</ReactMarkdown></div>
        ) : (
          <p>No content yet. Please create a command first.</p>
        )}
        <input type="text" className="text-input"
          value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <button className="option-btn" onClick={handleDownload} disabled={downloading}>
        {downloading ? "Downloading…" : "⬇️ Download Word Document"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
