import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import NavBar from "./NavBar";
import user from "../assets/userProfile.svg";
import resume from "../assets/resume.svg";
import JobCard from "./JobCard";
import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [username, setUsername] = useState("");
  const storedEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    // Retrieve user info from localStorage
    const userId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "");

    console.log("Retrieved userId from localStorage:", userId);

    if (!userId) {
      navigate("/");
      return;
    }

    const fetchJobs = async () => {
      try {
        // user id and job id to do this in req.body 
        // Change endpoint
        const res = await fetch(`http://localhost:3000/api/${userId}/jobs`);
        const data = await res.json();
        setSavedJobs(data.saved || []);
        setAppliedJobs(data.applied || []);
      } catch (err) {
        console.error("Error fetching user jobs:", err);
      }
    };

    fetchJobs();
  }, [navigate]);

  return (
    <>
      <NavBar />
      <div className="profile-container">
        <div className="userinfo">
          <img src={user} alt="User Icon" className="user-icon2" />
          <ul>
            <li><h2>Welcome back {username}!</h2></li>
            <li><h3>{storedEmail}</h3></li>
            <li className="resume-container"><img src={resume} alt="Resume Icon" className="resume-icon" /><h5>Resume</h5></li>
          </ul>
          
         
        </div>

        <div className="savedjobs">
          <h2>Saved Jobs</h2>
          {savedJobs.map((job, index) => (
            <JobCard
              key={index}
              role={job.role}
              location={job.location}
              company={job.company}
              description={job.description}
              link={job.link}
            />
          ))}
        </div>

        <div className="appliedjobs">
          <h2>Applied Jobs</h2>
          {appliedJobs.map((job, index) => (
            <JobCard
              key={index}
              role={job.role}
              location={job.location}
              company={job.company}
              description={job.description}
              link={job.link}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Profile;
