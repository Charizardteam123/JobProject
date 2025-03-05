import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/dashboard.css";
import user from "../assets/user.svg";
import logo from "../assets/logo.png"

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");

      console.log("Logout successful");
      navigate("/"); // Redirect to login
    } catch (err) {
      console.error("Logout error:", err);
    }
  };



  return (
    <nav className="navbar">
      <div className="logo">
      <img src={logo} alt = "Logo" className="logo" />
      </div>
     
      <div className="user-menu">
        <img
          src={user}
          alt="User Icon"
          className="user-icon"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />

        {isDropdownOpen && (
          <div className="dropdown-content">
            <button onClick={() => navigate(`/home/${userId}`)}>Dashboard</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={handleLogout}>Log out</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
