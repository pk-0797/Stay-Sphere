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
    <div className="container-fluid d-flex justify-content-center align-items-center py-5 px-3">
      <div className="col-lg-8 col-md-10 col-sm-12">
        <div className="card shadow-sm border-1 rounded-4 p-4 p-md-5 text-center">
          <div className="card-body">
            <h1 className="display-5 fw-bold text-primary mb-3">
              Welcome,
            </h1>
            <h2
              className="fw-bold text-white d-inline-block px-3 py-2 rounded"
              style={{ backgroundColor: "#2D6CDF", fontSize: "1.75rem" }}
            >
              {user.fullName || "Loading..."} !!
            </h2>
            <p className="lead text-muted mt-4 px-2">
              We are thrilled to have you here. Start listing your property
              and offer an unforgettable experience to your guests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
