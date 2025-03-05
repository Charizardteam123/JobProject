import React, { useState } from "react";
import JobCard from "./JobCard";
import "../styles/dashboard.css";
import NavBar from "./NavBar";

function Dashboard() {
  const [resumeText, setResumeText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted resume:", resumeText);
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <NavBar />

      {/* AI Prompt Section */}
      <div className="ai-prompt-section">
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="prompt AI (text area)"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <button>Location</button>
        <button>Remote</button>
        <button>Company</button>
      </div>

      {/* Job Cards Section */}
      <div className="jobs-grid">
        <JobCard />
      </div>
    </div>
  );
}

export default Dashboard;
