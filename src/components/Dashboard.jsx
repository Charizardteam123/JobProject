import React, { useState } from "react";
import JobCard from "./JobCard";
import "../styles/dashboard.css";
import NavBar from "./NavBar";
import robot from '../assets/construction.svg';

function Dashboard() {
  const [resumeText, setResumeText] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("bestFit"); // Default tab is "Best Fit"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitted resume:", resumeText);
    localStorage.setItem("resume", resumeText);

    try {
      const response = await fetch(
        "http://localhost:3000/api/job-recommendations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume: resumeText }),
        }
      );

      const parsedResponse = await response.json();
      console.log("Raw AI Response:", parsedResponse.recommendation);
      // const jobArray = JSON.parse(data);
      let jobArray;
      if (typeof parsedResponse.recommendation === "string") {
        // 2. Parse it to turn it into a real array
        jobArray = JSON.parse(parsedResponse.recommendation);
      } else {
        // 3. Maybe it's already an array? (Edge case)
        jobArray = parsedResponse.recommendation;
      }

      if (Array.isArray(jobArray)) {
        setJobs(jobArray);
      } else {
        console.error("Expected an array, but got:", jobArray);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error parsing recommendation as JSON:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="dashboard-container">
      <NavBar />

      <div className="ai-prompt-section">
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="prompt AI (text area)"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <button type="submit" className="button-ai" disabled={loading}>
            {loading ? "🔄 Getting Jobs" : "Submit"}
          </button>
        </form>
      </div>

      <div className="filters-section">
        <button 
          className={activeTab === "bestFit" ? "active" : ""} 
          onClick={() => setActiveTab("bestFit")}
        >
          Best Fit
        </button>
        <button 
          className={activeTab === "alternative" ? "active" : ""} 
          onClick={() => setActiveTab("alternative")}
        >
          Alternative
        </button>
      </div>

      <div className="jobs-grid">
        {activeTab === "bestFit" ? (
          Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job, index) => (
              <JobCard
                key={index}
                role={job.title} // Change `role` to `title`
                location={job.location}
                company={job.company}
                description={job.description}
              />
            ))
          ) : (
            <p></p>
          )
        ) : (
          <div id="under-construction">
            <img src={robot} alt='robot' className="robot-icon"/>
            <ul>
              <li><h3 className="coming-soon">Coming Soon!</h3></li>
              <li><h5 className="coming-soon-2">Under construction</h5></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;