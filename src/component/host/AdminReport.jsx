import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const AdminReport = () => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");

  const senderId = localStorage.getItem("id");
  const senderType = localStorage.getItem("role");
  const receiverId = "67e9fcaa8609191405ae3b81"; // Admin ID

  const categories = [
    "Listing Not Showing",
    "Booking Dispute",
    "Guest Misconduct",
    "Payment Method Issue",
    "Change Email/Phone",
    "Delete Account",
    "Change Password",
    "Security Concern",
    "Update Profile Details",
    "Other",
  ];

  const handleSend = async () => {
    if (!category) {
      return Swal.fire("Missing Category", "Please select a category.", "warning");
    }

    if (!message.trim()) {
      return Swal.fire("Empty Message", "Please write your message.", "warning");
    }

    const payload = {
      senderId,
      receiverId,
      senderType,
      message: `[${category}] ${message}`,
    };

    try {
      const response = await axios.post("/report/send/admin", payload);
      console.log("✅ Message sent successfully:", response.data);

      setMessage("");
      setCategory("");

      Swal.fire("Success", "Your message was sent to the admin!", "success");
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      console.error("🚨 Error sending message:", errMsg);

      Swal.fire("Error", errMsg, "error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-center text-primary">Report an Issue to Admin</h3>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Select Issue Category <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Your Message <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            id="message"
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
          />
        </div>

        <div className="d-grid">
          <button className="btn btn-primary" onClick={handleSend}>
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;
