import "../styles/jobcard.css";
import locationIcon from "../assets/location.svg";
import compIcon from "../assets/company.svg" // or your icon path

function JobCard() {
  return (
    <div className="card-container">
      <h3 className="role-title">Role</h3>

      {/* Icon + Location row */}
      <div className="location-row">
        <img src={locationIcon} alt="Location icon" className="loc-icon" />
        <p>Location</p>
      </div>

      <div className="company-row">
        <img src={compIcon} alt="Company icon" className="com-icon" />
        <p>Company</p>
      </div>
      
      <p className="description-text">Description</p>

      <div className="card-buttons">
        <button>Apply</button>
        <button>Save</button>
      </div>
    </div>
  );
}

export default JobCard;
