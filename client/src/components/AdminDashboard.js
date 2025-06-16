import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminDashboard.css";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
      withCredentials: true
    })
    .then((res) => setUsers(res.data))
    .catch((err) => console.error("Error fetching users", err));
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/logout`, {}, { withCredentials: true });
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
<div className="admin-home-container">
  <div className="admin-logout-icon-container">
    <FiLogOut className="admin-logout-icon" onClick={handleLogout} title="Logout" />
  </div>
  <h1 className="admin-title">Admin Dashboard</h1>
  <p className="admin-subtitle">Manage registered users</p>

  <div className="user-list-box">
    <h3>All Registered Users</h3>
    <table className="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>User ID</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}

export default AdminDashboard;
