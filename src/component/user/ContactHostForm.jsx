import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ import SweetAlert2
import { FaEnvelope, FaUser, FaPaperPlane } from "react-icons/fa";

export const ContactHostForm = () => {
  const { bookingId, hostId } = useParams();
  const [hostDetails, setHostDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [selectedIssues, setSelectedIssues] = useState([]);

  const issueOptions = [
    "Booking Confirmation Not Received Yet",
    "Payment Issues",
    "Cancellation or Refund Request",
    "Check-in Problems (Late/Early Check-in)",
    "Check-out Problems",
    "Room Not As Described",
    "Issues with Amenities (WiFi, AC, etc.)",
    "Cleanliness Issues",
    "Noise Complaints",
    "Security Concerns",
    "Extra Charges Applied Incorrectly",
    "Need to Extend My Stay",
    "Host is Unresponsive",
    "Change Guest Details",
    "Special Requests Not Fulfilled",
    "Other",
  ];

  useEffect(() => {
    const fetchHostDetails = async () => {
      try {
        const res = await axios.get(`/user/${hostId}`);
        setHostDetails(res.data.data);
      } catch (err) {
        console.error(
          "Error fetching host details:",
          err.response?.data || err.message
        );
        Swal.fire("Error", "Failed to load host details!", "error");
      }
    };
    fetchHostDetails();
  }, [hostId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleIssueSelection = (issue) => {
    setSelectedIssues((prevIssues) =>
      prevIssues.includes(issue)
        ? prevIssues.filter((i) => i !== issue)
        : [...prevIssues, issue]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/messages/send", {
        bookingId,
        hostId,
        name: formData.name,
        email: formData.email,
        message:
          selectedIssues.join(", ") +
          (formData.message ? ` | Additional: ${formData.message}` : ""),
      });

      // ✅ SweetAlert2 success popup
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: response.data.message,
        showConfirmButton: true,
      });

      setFormData({ name: "", email: "", message: "" });
      setSelectedIssues([]);
    } catch (err) {
      // ✅ SweetAlert2 error popup
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err.response?.data?.message || "Failed to send message. Try again!",
      });
    }
  };

  return (
    <div className="container mb-4">
      {/* Page Header */}
      <h3 className="text-center text-primary fw-bold mb-3 d-flex align-items-center justify-content-center gap-2">
        <FaEnvelope /> Connect with Host
      </h3>

      {hostDetails && (
        <div className="alert alert-dark text-center shadow-sm">
          Contacting Host: <strong>{hostDetails.fullName}</strong> (
          <i>{hostDetails.email}</i>)
        </div>
      )}

      {/* Contact Form */}
      <div className="card shadow-sm border-0 rounded-3 p-4 mt-3">
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaUser className="me-2 text-primary" />
              Your Name
            </label>
            <input
              type="text"
              className="form-control shadow-sm"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaEnvelope className="me-2 text-primary" />
              Your Email
            </label>
            <input
              type="email"
              className="form-control shadow-sm"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Issues Selection */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Your Issues</label>
            <div className="d-flex flex-wrap gap-2">
              {issueOptions.map((issue, index) => (
                <button
                  key={index}
                  type="button"
                  className={`btn rounded-pill shadow-sm ${
                    selectedIssues.includes(issue)
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  style={{ fontSize: "0.85rem" }}
                  onClick={() => toggleIssueSelection(issue)}
                >
                  {issue}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          {selectedIssues.includes("Other") && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Custom Message</label>
              <textarea
                className="form-control shadow-sm"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Info Note */}
          <div className="alert alert-info small mb-3 shadow-sm" role="alert">
            <strong>Note:</strong> After submitting, please check your email for
            host responses and updates.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary px-5 py-2 w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
          >
            <FaPaperPlane /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};
