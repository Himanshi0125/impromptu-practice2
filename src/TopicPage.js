import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SpeakingPractice.css";

function TopicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic || "No topic found.";

  return (
    <div className="practice-container">
      <h1>Your Impromptu Topic</h1>
      <div className="topic-card">
        <h2>Topic:</h2>
        <p>{topic}</p>
      </div>
      <button className="start-btn" onClick={() => navigate("/")}>
        Back to Practice
      </button>
    </div>
  );
}

export default TopicPage;
