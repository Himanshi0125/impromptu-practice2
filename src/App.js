import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpeakingPractice from "./SpeakingPractice";
import TopicPage from "./TopicPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpeakingPractice />} />
        <Route path="/topic" element={<TopicPage />} />
      </Routes>
    </Router>
  );
}

export default App;
