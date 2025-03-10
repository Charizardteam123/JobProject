import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/login_register.css";
import logo from "../assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Invalid credentials");
        return;
      }

      const data = await response.json();

      console.log("log in data", data.user);

      // localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("userEmail", data.user.email)

      console.log("Login successful, User ID:", data.user.id);

      navigate(`/home/${data.user.id}`);
    } catch (err) {
      console.error("Login error", err);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <div className="login-title">
          <img src={logo} alt = 'logo' className="logo-in-login"/>
          <p>Your intelligent career companion</p>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/forgot-password");
            }}
            className="forgot-password"
          >
            Forgot Password?
          </a>
          <button type="submit" className="submit-button">
            Login
          </button>
          <div className="login-signup">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
