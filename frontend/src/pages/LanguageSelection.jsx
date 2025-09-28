import React from "react";
import logo from "../assets/ona-ai-logo.png";
import "../App.css";

export default function LanguageSelection() {
  const languages = ["Mixed languages", "English", "Swahili", "French", "Kikuyu"];

  return (
    <div className="page-screen">
      <img src={logo} alt="Ona AI Logo" className="page-logo" />

      <h1 className="page-title">Ona AI</h1>

      <h1>Choose your language!</h1>

      <div className="video-placeholder">▶</div>

      {languages.map((lang) => (
        <button key={lang} className="option-btn">
          {lang}
        </button>
      ))}
    </div>
  );
}
