import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ona-ai-logo.png";
import "../App.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-screen">
      <div className="landing-content">
        <img src={logo} alt="Ona AI Logo" className="landing-logo" />
        <h1 className="landing-title">Ona AI</h1>
        <button className="get-started-btn" onClick={() => navigate("/language")}>
          Get Started
        </button>
      </div>
    </div>
  );
}