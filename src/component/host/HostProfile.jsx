import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";

export const HostProfile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`/user/${userId}`, user);
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 1300,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-start mt-4 vh-100 ">
      <div className="card p-4 shadow-sm rounded-4" style={{ width: "100%" }}>
        <div className="card-body">
          <ToastContainer
            position="top-center"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Slide}
          />
          <h2 className="text-center mb-4 text-primary">Profile Details</h2>
          <form>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-bold">Full Name</label>
              <input
                type="text"
                className="form-control border rounded-3"
                name="fullName"
                value={user.fullName || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Email (Non-Editable) */}
            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control border rounded-3"
                value={user.email || ""}
                disabled
              />
            </div>

            {/* Phone Number */}
            <div className="mb-3">
              <label className="form-label fw-bold">Phone No</label>
              <input
                type="text"
                className="form-control border rounded-3"
                name="phoneNo"
                value={user.phoneNo || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Age */}
            <div className="mb-3">
              <label className="form-label fw-bold">Age</label>
              <input
                type="number"
                className="form-control border rounded-3"
                name="age"
                placeholder="Enter your age"
                value={user.age || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Buttons */}
            <div className="text-center mt-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="btn btn-success me-2 px-4 shadow-sm"
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-4 shadow-sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-primary me-2 px-4 shadow-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  {/* Back Button (only in non-editing mode) */}
                  <button
                    type="button"
                    className="btn btn-outline-dark ms-2 px-4 shadow-sm"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
