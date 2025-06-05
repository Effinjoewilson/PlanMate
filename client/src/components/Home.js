import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container1">
      <h1 className="main-title">Daily Activity</h1>
      <h2 className="subtitle">Welcome</h2>
      <p className="description">Please log in or sign up to continue</p>
      <div className="button-group">
        <button className="btn" onClick={() => navigate('/login')}>Login</button>
        <button className="btn outline" onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  );
}

export default Home;
