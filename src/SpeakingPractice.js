import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SpeakingPractice.css";

// Option lists
const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" }
];

const purposes = [
  { value: "interview", label: "Job Interview" },
  { value: "self", label: "Self-improvement" },
  { value: "public", label: "Public Speaking Practice" },
  { value: "fun", label: "Fun/Random" }
];

const categories = [
  { value: "travel", label: "Travel" },
  { value: "culture", label: "Culture" },
  { value: "abstract", label: "Abstract Concepts" },
  { value: "oneword", label: "One-word Prompt" },
  { value: "technology", label: "Technology" },
  { value: "current", label: "Current Events" },
  { value: "random", label: "Surprise Me" }
];

function SpeakingPractice() {
  const [skill, setSkill] = useState(skillLevels[0].value);
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleSelection = (value, selected, setSelected) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const getRandomTopic = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5050/api/topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill,
          purposes: selectedPurposes,
          categories: selectedCategories
        })
      });
      const data = await res.json();
      navigate("/topic", { state: { topic: data.topic } });
    } catch (err) {
      navigate("/topic", { state: { topic: "Failed to fetch topic. Please try again." } });
    }
    setLoading(false);
  };

  return (
    <div className="practice-container">
      <h1>Impromptu Speaking Practice</h1>
      <div className="section">
        <div className="section-title">Skill Level</div>
        <div className="button-group">
          {skillLevels.map(opt => (
            <button
              key={opt.value}
              className={`option-btn${skill === opt.value ? " selected" : ""}`}
              onClick={() => setSkill(opt.value)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="section-title">Purpose</div>
        <div className="button-group">
          {purposes.map(opt => (
            <button
              key={opt.value}
              className={`option-btn${selectedPurposes.includes(opt.value) ? " selected" : ""}`}
              onClick={() => toggleSelection(opt.value, selectedPurposes, setSelectedPurposes)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="section-title">Category</div>
        <div className="button-group">
          {categories.map(opt => (
            <button
              key={opt.value}
              className={`option-btn${selectedCategories.includes(opt.value) ? " selected" : ""}`}
              onClick={() => toggleSelection(opt.value, selectedCategories, setSelectedCategories)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <button className="start-btn" onClick={getRandomTopic} disabled={loading}>
        {loading ? "Loading..." : "Start Session"}
      </button>
    </div>
  );
}

export default SpeakingPractice;
