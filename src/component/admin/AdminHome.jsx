import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AdminHome = () => {
  const [user, setUser] = useState({});

  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/user/${userId}`);
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };
  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center">
      <div className="col-md-10 text-center">
        <div className="card shadow-sm p-5 border-0 rounded-4">
          <div className="card-body">
            <h3 className="display-4 fw-bold text-primary">👋 Welcome Back,</h3>
            <h3
              className="fw-bold text-white d-inline-block px-4 py-2 rounded shadow-sm"
              style={{ backgroundColor: "#2D6CDF" }}
            >
              {user.fullName || "Administrator"}!
            </h3>
            <p className="lead text-muted mt-4">
              🔹 As an administrator, you oversee both hosts and guests. Ensure
              smooth operations, monitor user activity, and manage the platform
              efficiently.
            </p>
            <p className="text-muted">
              🛠️ Manage hosts, verify listings, and maintain platform integrity.
            </p>
            <p className="text-muted">
              📊 Track user activity, monitor reports, and address issues
              proactively.
            </p>
            <p className="text-muted">
              📅 Oversee bookings, resolve disputes, and enhance platform
              reliability.
            </p>
            <Link to="/admin/allproperties" className="btn btn-primary mt-3 px-4 py-2 rounded-pill shadow-sm">
              🏢 Manage Properties
            </Link>
            <Link to="/admin/allusers" className="btn btn-outline-success mt-3 mx-2 px-4 py-2 rounded-pill shadow-sm">
              👤 View Users
            </Link>

            <Link
              to="/admin/dashboard"
              className="btn btn-outline-warning mt-3 px-4 py-2 rounded-pill shadow-sm "
            >
              📊 Platform Analytics
            </Link>

            <Link className="btn btn-outline-danger mt-3 mx-2 px-4 py-2 rounded-pill shadow-sm">
              🚨 Reports & Issues
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
