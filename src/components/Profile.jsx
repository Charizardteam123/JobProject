// import React, { useState } from "react";
// import { useNavigate } from "react-router";
// import NavBar from "./NavBar";
// import user from "../assets/user.svg";
// import JobCard from "./JobCard";
// import '../styles/profile.css'

// function Profile() {
//   const navigate = useNavigate();
  
//   return (
//     <>
//       <div>
//         <NavBar />
//       </div>
//       <div className="profile-container">
//         <div className="userinfo">
//           <img src={user} alt="User Icon" className="user-icon" />
//           <h2>Welcome back @User!</h2>
//           <h3>user@gmail.com</h3>
//           <h5>Resume</h5>
//         </div>
//         <div className="savedjobs">
//           <h3>Saved jobs</h3>
//           <JobCard/>
//         </div>
//         <div className="appliedjobs">
//           <h3>Applied Jobs</h3>
//           <JobCard/>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Profile;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import NavBar from "./NavBar";
import user from "../assets/user.svg";
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
          <img src={user} alt="User Icon" className="user-icon" />
          <h2>Welcome back {username}!</h2>
          <h3>{storedEmail}</h3>
          <h5>Resume</h5>
        </div>

        <div className="savedjobs">
          <h3>Saved jobs</h3>
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
          <h3>Applied Jobs</h3>
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
