import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Form.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");  // Add this

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await axios.post("http://localhost:5000/api/login", form);
      alert(res.data.message);
    } catch (err) {
      // ✅ Read error from backend if present
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
