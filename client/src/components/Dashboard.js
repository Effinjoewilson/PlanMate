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
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/me`, { withCredentials: true })
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
    setLoadingActivity(true);
    setActivityText("");

    // Fetch activities for that date
    const dateString = date.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata"
    });
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/activities?date=${dateString}`, { withCredentials: true })
      .then((res) => setActivities(res.data))
      .catch(() => setActivities([]))
      .finally(() => setLoadingActivity(false));
  };


  const saveActivity = () => {
    const trimmedText = activityText.trim();

    if (!trimmedText) {
      alert("Please enter some activity before saving.");
      return;
    }
    const dateString = selectedDate.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata"
    });

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/activities`,
        { date: dateString, text: activityText, status: "Not started" },
        { withCredentials: true }
      )
      .then((res) => {
        setActivities((prev) => [
          ...prev,
          { id: Date.now(), text: activityText, status: "Not started" },
        ]);
        setActivityText("");
      })
      .catch((err) => console.error("Save error:", err));
  };

  const handleStatusChange = (activityId, newStatus) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/activities/${activityId}`,
        { status: newStatus },
        { withCredentials: true }
      )
      .then(() => {
        setActivities((prev) =>
          prev.map((a) => (a.id === activityId ? { ...a, status: newStatus } : a))
        );
      })
      .catch((err) => console.error("Update error:", err));
  };

  const handleDelete = (activityId) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/activities/${activityId}`, {
        withCredentials: true,
      })
      .then(() => {
        setActivities((prev) => prev.filter((a) => a.id !== activityId));
      })
      .catch((err) => console.error("Delete error:", err));
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
                      style={{ width: "100%", height: "15%", fontSize: "1rem" }}
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

                    {/* List of saved activities */}
                    <div style={{ textAlign: "left", marginTop: "20px" }}>
                      <h4>Saved Activities:</h4>
                      {activities.length === 0 ? (
                        <p>No activities saved for this date.</p>
                      ) : (
                        <ol style={{ paddingLeft: "20px", marginTop: "10px", marginBottom: "0" }}>
                          {activities.map((act, index) => (
                            <li
                              key={act.id}
                              style={{
                                marginBottom: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "0.95rem",
                              }}
                            >
                              <span style={{ flexGrow: 1 }}>{act.text}</span>
                              <select
                                value={act.status}
                                onChange={(e) => handleStatusChange(act.id, e.target.value)}
                                style={{
                                  fontSize: "0.9rem",
                                  padding: "2px 6px",
                                }}
                              >
                                <option value="Not started">Not started</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                              </select>
                              <button
                                onClick={() => handleDelete(act.id)}
                                style={{
                                  color: "#c00",
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "1rem",
                                  padding: "0 4px",
                                }}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </li>
                          ))}
                        </ol>




                      )}
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
