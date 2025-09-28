import React from "react";
import logo from "../assets/ona-ai-logo.png";
import "../App.css";

function Landing() {
  return (
    <div className="landing-screen">
      <div className="landing-content">
        <img src={logo} alt="Ona AI Logo" className="landing-logo" />
        <h1>Welcome to Ona AI</h1>
        <p>Your AI-powered assistant for smarter solutions</p>
        <a href="/input-method">
          <button className="get-started-btn">Get Started</button>
        </a>
      </div>
    </div>
  );
}

export default Landing;
