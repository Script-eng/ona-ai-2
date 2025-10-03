import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import LanguageSelection from "./pages/LanguageSelection";
import InputMethod from "./pages/InputMethod";
import Command from "./pages/Command";
import UploadSummary from "./pages/UploadSummary";
import GeneratedWork from "./pages/GeneratedWork";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/language" element={<LanguageSelection />} />
        <Route path="/input-method" element={<InputMethod />} />
        <Route path="/command" element={<Command />} />
        <Route path="/upload-summary" element={<UploadSummary />} />
        <Route path="/generated" element={<GeneratedWork />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
