import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/login_register.css";
import logo from "../assets/logo.png";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        alert("Invalid credentials");
        return;
      }

      const data = await response.json();

      console.log("Register successful", data);

      navigate("/");
    } catch (err) {
      console.error("Register error", err);
      alert("Register failed");
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <div className="login-title">
          <img src={logo} alt = 'logo' className="logo-in-login"/>
          <p> Start your journey now!</p>
    
        </div>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          ></input>

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          ></input>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          ></input>
          <br></br>
          <button
            type="submit"
            className="submit-button"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
