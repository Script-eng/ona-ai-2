import React from "react";
import logo from "./assets/ona-ai-logo.png"; // replace with your logo
import "./App.css";

function App() {
  const handleGetStarted = () => {
    alert("Get Started clicked!"); // later replace with navigation
  };

  return (
    <div className="landing-screen">
      <div className="landing-content">
        <img src={logo} alt="Ona AI Logo" className="landing-logo" />
        <h1>Welcome to Ona AI</h1>
        <p>Your AI-powered assistant for smarter solutions</p>
        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
