import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Form.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");  // Add this

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/login", form);
    localStorage.setItem("token", res.data.token); // ✅ store JWT
    localStorage.setItem("user", JSON.stringify(res.data.user)); // optional
    navigate("/dashboard"); // ✅ redirect
  } catch (err) {
    // handle error
  }
};

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>} {/* Display error message */}
        <p>Don't have an account? <Link to="/signup">Signup</Link></p>
      </form>
    </div>
  );
}

export default Login;
