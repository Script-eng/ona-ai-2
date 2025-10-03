import React from "react";
import "../styles/ListeningBars.css";

const ListeningBars = ({ isListening }) => {
  return (
    <div className={`listening-bars ${isListening ? "active" : ""}`}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default ListeningBars;