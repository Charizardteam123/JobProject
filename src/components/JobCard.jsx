// import "../styles/jobcard.css";
// import locationIcon from "../assets/location.svg";
// import compIcon from "../assets/company.svg" // or your icon path

// function JobCard() {
//   return (
//     <div className="card-container">
//       <h3 className="role-title">Role</h3>

//       {/* Icon + Location row */}
//       <div className="location-row">
//         <img src={locationIcon} alt="Location icon" className="loc-icon" />
//         <p>Location</p>
//       </div>

//       <div className="company-row">
//         <img src={compIcon} alt="Company icon" className="com-icon" />
//         <p>Company</p>
//       </div>
      
//       <p className="description-text">Description</p>

//       <div className="card-buttons">
//         <button>Apply</button>
//         <button>Save</button>
//       </div>
//     </div>
//   );
// }

// export default JobCard;

import "../styles/jobcard.css";
import locationIcon from "../assets/location.svg";
import compIcon from "../assets/company.svg";

function JobCard({ role, location, company, description, link }) {

  const handleApply = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in");
      return;
    }
    try {
      // Change endpoint
      await fetch(`http://localhost:3000/api/users/${userId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, location, company, description, link }),
      });
      // Open the job link in a new tab (if provided by AI)
      if (link) window.open(link, "_blank");
    } catch (err) {
      console.error("Error applying for job:", err);
    }
  };

 
  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in");
      return;
    }
    try {
      // Change endpoint
      await fetch(`http://localhost:3000/api/users/${userId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, location, company, description, link }),
      });
      alert("Job saved!");
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  return (
    <div className="card-container">
      <h3 className="role-title">{role}</h3>

      <div className="location-row">
        <img src={locationIcon} alt="Location icon" className="loc-icon" />
        <p>{location}</p>
      </div>

      <div className="company-row">
        <img src={compIcon} alt="Company icon" className="com-icon" />
        <p>{company}</p>
      </div>

      <p className="description-text">{description}</p>

      <div className="card-buttons">
        <button onClick={handleApply}>Apply</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default JobCard;
