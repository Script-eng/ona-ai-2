import React from "react";
import { useNavigate } from "react-router-dom";   // ✅ added
import logo from "../assets/ona-ai-logo.png";
import "../App.css";
import AvatarBox from "../components/AvatarBox";

export default function LanguageSelection() {
  const navigate = useNavigate();                 // ✅ added
  const languages = ["Mixed languages", "English", "Swahili", "French", "Kikuyu"];

  return (
    <div className="page-screen">
      <div className="page-header">
        <img src={logo} alt="Ona AI Logo" />
        <h1>Ona AI</h1>
      </div>

      <h1>Choose your language!</h1>
      <AvatarBox state="idle" />

      {languages.map((lang) => (
        <button 
          key={lang} 
          className="option-btn"
          onClick={() => navigate("/input-method")}   // ✅ added
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
