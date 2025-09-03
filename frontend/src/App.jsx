import React from "react";
import EligibilityForm from "./components/EligibilityForm";
import "./index.css";

function App() {
  return (
    <div className="app-container">
      <div className="card">
        <h2 className="title">Interview Eligibility Checker</h2>
        <EligibilityForm />
      </div>
    </div>
  );
}

export default App;
