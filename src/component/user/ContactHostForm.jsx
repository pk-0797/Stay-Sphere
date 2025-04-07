// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// export const ContactHostForm = () => {
//   const { bookingId, hostId } = useParams(); // Get params from URL
//   const [hostDetails, setHostDetails] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });
//   const [status, setStatus] = useState(null);

// // Fetch Host Details
// useEffect(() => {
//     const fetchHostDetails = async () => {
//       try {
//         const res = await axios.get(`/user/${hostId}`); // ✅ Corrected API path
//         setHostDetails(res.data.data);
//       } catch (err) {
//         console.error("Error fetching host details:", err.response?.data || err.message);
//       }
//     };
//     fetchHostDetails();
//   }, [hostId]);
  

//   // Handle Input Changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/messages/send", { // ✅ Fixed route
//         bookingId,
//         hostId,
//         ...formData,
//       });
//       setStatus({ type: "success", message: response.data.message });
//       setFormData({ name: "", email: "", message: "" });
//     } catch (err) {
//       setStatus({ type: "error", message: err.response?.data?.message || "Failed to send message. Try again!" });
//     }
//   };
  

//   return (
//     <div className="container mt-4">
//       <h3 className="text-center text-primary">Contact Host</h3>

//       {hostDetails && (
//         <div className="alert alert-info text-center">
//           Contacting Host: <strong>{hostDetails.fullName}</strong> (<i>{hostDetails.email}</i>)
//         </div>
//       )}

//       <div className="card shadow p-4 mt-3">
//         {status && (
//           <div className={`alert alert-${status.type === "success" ? "success" : "danger"}`} role="alert">
//             {status.message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Your Name</label>
//             <input
//               type="text"
//               className="form-control"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Your Email</label>
//             <input
//               type="email"
//               className="form-control"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Message</label>
//             <textarea
//               className="form-control"
//               name="message"
//               rows="4"
//               value={formData.message}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-100">
//             Send Message
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const ContactHostForm = () => {
  const { bookingId, hostId } = useParams();
  const [hostDetails, setHostDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
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
        console.error("Error fetching host details:", err.response?.data || err.message);
      }
    };
    fetchHostDetails();
  }, [hostId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleIssueSelection = (issue) => {
    setSelectedIssues((prevIssues) =>
      prevIssues.includes(issue) ? prevIssues.filter((i) => i !== issue) : [...prevIssues, issue]
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
        message: selectedIssues.join(", ") + (formData.message ? ` | Additional: ${formData.message}` : ""),
      });
      setStatus({ type: "success", message: response.data.message });
      setFormData({ name: "", email: "", message: "" });
      setSelectedIssues([]);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to send message. Try again!",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center text-primary">Contact Host</h3>

      {hostDetails && (
        <div className="alert alert-info text-center">
          Contacting Host: <strong>{hostDetails.fullName}</strong> (<i>{hostDetails.email}</i>)
        </div>
      )}

      <div className="card shadow p-4 mt-3">
        {status && (
          <div className={`alert alert-${status.type === "success" ? "success" : "danger"}`} role="alert">
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Your Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Select Your Issues</label>
            <div className="d-flex flex-wrap gap-2">
              {issueOptions.map((issue, index) => (
                <button
                  key={index}
                  type="button"
                  className={`btn ${selectedIssues.includes(issue) ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => toggleIssueSelection(issue)}
                >
                  {issue}
                </button>
              ))}
            </div>
          </div>

          {selectedIssues.includes("Other") && (
            <div className="mb-3">
              <label className="form-label">Custom Message</label>
              <textarea
                className="form-control"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-color px-5 mb-5 w-100 "
                id="log-btn">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

