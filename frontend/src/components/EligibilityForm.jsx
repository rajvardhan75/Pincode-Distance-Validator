import React, { useState } from "react";
import axios from "axios";

const EligibilityForm = () => {
  const [officePin, setOfficePin] = useState("");
  const [candidatePin, setCandidatePin] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [result, setResult] = useState("");
  const [candidateArea, setCandidateArea] = useState("");

  const checkEligibility = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/check-eligibility`,
        {
          officePin,
          candidatePin,
          maxDistance,
        }
      );

      if (res.data.eligible) {
        setResult(`✅ Eligible (Distance: ${res.data.distance} km)`);
      } else {
        setResult(`❌ Not Eligible (Distance: ${res.data.distance} km)`);
      }

      // save candidate area name returned from backend
      if (res.data.candidateArea) {
        setCandidateArea(res.data.candidateArea);
      }
    } catch (err) {
      setResult("⚠️ Error: " + (err.response?.data?.error || err.message));
      setCandidateArea("");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Office Pincode"
        value={officePin}
        onChange={(e) => setOfficePin(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Candidate Pincode"
        value={candidatePin}
        onChange={(e) => setCandidatePin(e.target.value)}
        className="input"
      />
      <input
        type="number"
        placeholder="Max Distance (km)"
        value={maxDistance}
        onChange={(e) => setMaxDistance(e.target.value)}
        className="input"
      />

      <button onClick={checkEligibility} className="button">
        Check Eligibility
      </button>

      <h3 className="result">{result}</h3>
      {candidateArea && <p>📍 Candidate Area: {candidateArea}</p>}
    </div>
  );
};

export default EligibilityForm;
