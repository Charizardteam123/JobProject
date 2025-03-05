import React, { useState } from "react";
import { useNavigate } from "react-router";
import NavBar from "./NavBar";
import user from "../assets/user.svg";
import JobCard from "./JobCard";
import '../styles/profile.css'

function Profile() {
  const navigate = useNavigate();
  
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="profile-container">
        <div className="userinfo">
          <img src={user} alt="User Icon" className="user-icon" />
          <h2>Welcome back @User!</h2>
          <h3>user@gmail.com</h3>
          <h5>Resume</h5>
        </div>
        <div className="savedjobs">
          <h3>Saved jobs</h3>
          <JobCard/>
        </div>
        <div className="appliedjobs">
          <h3>Applied Jobs</h3>
          <JobCard/>
        </div>
      </div>
    </>
  );
}

export default Profile;
