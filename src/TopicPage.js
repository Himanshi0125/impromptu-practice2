import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import voiceIndicator from "./assets/voice-indicator.json"; // adjust path as needed
import "./SpeakingPractice.css";

function TopicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic || "No topic found.";
  const lottieRef = useRef();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Start Vapi speaking and animation on mount
  useEffect(() => {
    // let vapiStarted = false;
    const speakWithVapi = () => {
      if (window.vapiInstance && window.vapiInstance.send) {
        window.vapiInstance.send({ type: "user_message", message: topic });
        setIsSpeaking(true);
        //vapiStarted = true;
      }
    };
    // Wait for Vapi to load
    const timer = setTimeout(speakWithVapi, 600);
    return () => clearTimeout(timer);
  }, [topic]);

  // Listen for Vapi events to pause animation when speaking ends
  useEffect(() => {
    const handleVapiEvent = (event) => {
      // Vapi emits a 'speech_end' event when done speaking
      if (event?.type === "speech_end" || event?.type === "end") {
        setIsSpeaking(false);
      }
      // Optionally, you can handle 'speech_start' if needed
      if (event?.type === "speech_start") {
        setIsSpeaking(true);
      }
    };
    // Listen for Vapi events
    window.addEventListener("vapi", handleVapiEvent);
    return () => {
      window.removeEventListener("vapi", handleVapiEvent);
    };
  }, []);

  // Control Lottie animation play/pause
  useEffect(() => {
    if (lottieRef.current) {
      if (isSpeaking) {
        lottieRef.current.play();
      } else {
        lottieRef.current.pause();
      }
    }
  }, [isSpeaking]);

  return (
    <div className="practice-container">
      <h1>Your Impromptu Topic</h1>
      <div className="topic-card">
        <h2>Topic:</h2>
        <p>{topic}</p>
        <div className="ai-speaking-visual" style={{ marginTop: 24 }}>
          <Lottie
            lottieRef={lottieRef}
            animationData={voiceIndicator}
            loop
            autoplay={false}
            style={{ width: 80, margin: "0 auto" }}
          />
          <div
            style={{
              fontSize: "0.95rem",
              color: "#2563eb",
              marginTop: "6px",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {isSpeaking ? "AI is speaking..." : "AI finished speaking"}
          </div>
        </div>
      </div>
      <button className="start-btn" onClick={() => navigate("/")}>
        Back to Practice
      </button>
    </div>
  );
}

export default TopicPage;
