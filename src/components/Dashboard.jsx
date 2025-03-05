// import React, { useState } from "react";
// import JobCard from "./JobCard";
// import "../styles/dashboard.css";
// import NavBar from "./NavBar";

// function Dashboard() {
//   const [resumeText, setResumeText] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Submitted resume:", resumeText);
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Navbar */}
//       <NavBar />

//       {/* AI Prompt Section */}
//       <div className="ai-prompt-section">
//         <form onSubmit={handleSubmit}>
//           <textarea
//             placeholder="prompt AI (text area)"
//             value={resumeText}
//             onChange={(e) => setResumeText(e.target.value)}
//           />
//           <button type="submit">Submit</button>
//         </form>
//       </div>

//       {/* Filters Section */}
//       <div className="filters-section">
//         <button>Location</button>
//         <button>Remote</button>
//         <button>Company</button>
//       </div>

//       {/* Job Cards Section */}
//       <div className="jobs-grid">
//         <JobCard />
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
import React, { useState } from "react";
import JobCard from "./JobCard";
import "../styles/dashboard.css";
import NavBar from "./NavBar";

function Dashboard() {

  const [resumeText, setResumeText] = useState("");
  const [jobs, setJobs] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted resume:", resumeText);

    try {
      // Change endpoint
      const response = await fetch("http://localhost:3000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: resumeText }),
      });

      const data = await response.json();
      console.log("Data in Dashboard line 72: ",data)
      
      setJobs(data);
    } catch (error) {
      console.error("Error fetching AI jobs:", error);
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
          <button type="submit">Submit</button>
        </form>
      </div>

   
      <div className="filters-section">
        <button>Location</button>
        <button>Remote</button>
        <button>Company</button>
      </div>

     
      <div className="jobs-grid">
        {jobs.map((job, index) => (
          <JobCard
            key={index}
            role={job.role}
            location={job.location}
            company={job.company}
            description={job.description}
            link={job.link}  // if AI provides a link to apply
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
