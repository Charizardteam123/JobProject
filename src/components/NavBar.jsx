import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/dashboard.css";
import user from "../assets/user.svg";

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const data = '1234';

  return (
    <nav className="navbar">
      <div className="logo">NAME</div>
     
      <div className="user-menu">
        <img
          src={user}
          alt="User Icon"
          className="user-icon"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />

        {isDropdownOpen && (
          <div className="dropdown-content">
            <button onClick={() => navigate(`/home/${data}`)}>Dashboard</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button>Log out</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
