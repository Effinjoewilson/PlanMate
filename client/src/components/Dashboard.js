import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/dashboard.css";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCard, setShowCard] = useState(false);
  const [activityText, setActivityText] = useState("");
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetch("https://wttr.in/?format=j1")
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error("Weather fetch error:", err));
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowCard(true);
    setLoadingActivity(false);
    setActivityText("");
  };

  const saveActivity = () => {
    // Logic to save activityText
    setShowCard(false);
  };

  const closeCard = () => {
    setShowCard(false);
  };

  return (
    <div className="home-container">
      {/* Always render this title area */}
      <h2 className="subtitle">Daily Activity Dashboard</h2>
      <p className="description">Manage your day, track weather, and stay productive</p>

      {/* Conditional content rendering */}
      {isLoading ? (
        <p>Loading your dashboard...</p>
      ) : !user ? (
        <div>
          <h3>Unauthorized</h3>
          <p>Please log in to access your dashboard.</p>
        </div>
      ) : (
        <>
          <h2 className="subtitle">Hi {user.name}</h2>

          <div className="dashboard-center">
            <div className="calendar-wrapper">
              <Calendar onClickDay={handleDateClick} />
            </div>

            <div className="weather-box">
              <h3>Current Weather</h3>
              {weather ? (
                <>
                  <p>
                    <strong>Location:</strong> {weather.nearest_area[0].areaName[0].value}
                  </p>
                  <p>
                    <strong>Temperature:</strong> {weather.current_condition[0].temp_C}°C
                  </p>
                  <p>
                    <strong>Condition:</strong> {weather.current_condition[0].weatherDesc[0].value}
                  </p>
                </>
              ) : (
                <p>Loading weather...</p>
              )}
            </div>
          </div>

          {showCard && (
            <div className="full-card-overlay">
              <div className="full-card">
                <h2>{selectedDate.toDateString()}</h2>
                {loadingActivity ? (
                  <p>Loading activity...</p>
                ) : (
                  <>
                    <textarea
                      rows={8}
                      value={activityText}
                      onChange={(e) => setActivityText(e.target.value)}
                      style={{ width: "100%", fontSize: "1rem" }}
                      placeholder="Add your activity for this date here..."
                    />
                    <div style={{ marginTop: "15px" }}>
                      <button className="btn" onClick={saveActivity}>
                        Save
                      </button>{" "}
                      <button className="btn" onClick={closeCard}>
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
