import axios from "axios";
import React, { useEffect, useState } from "react";

export const HostHome = () => {
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
      <div className="col-md-8 text-center">
        <div className="card shadow-lg p-5 border-0 rounded-4">
          <div className="card-body">
            <h1 className="display-4 fw-bold text-primary">Welcome,</h1>
            <h1
              className="fw-bold text-white d-inline-block px-3 py-2 rounded"
              style={{ backgroundColor: "#2D6CDF" }}
            >
              {user.fullName || "Loading..."} !!
            </h1>
            <p className="lead text-muted mt-3">
              We are thrilled to have you here. Start listing your property and
              offer an unforgettable experience to your guests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
