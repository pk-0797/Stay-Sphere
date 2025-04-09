import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

export const MessagesFromUsers = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState({});
  const socket = io("http://localhost:3002");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/messages/all`);
      if (res.data && Array.isArray(res.data.data)) {
        setMessages(res.data.data);
        res.data.data.forEach((msg) => fetchPropertyDetails(msg.bookingId));
      } else {
        setMessages([]);
      }
    } catch (err) {
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyDetails = async (bookingId) => {
    if (!bookingId || propertyDetails[bookingId]) return;
    try {
      const res = await axios.get(`/booking/getpropertyby/${bookingId}`);
      setPropertyDetails((prev) => ({ ...prev, [bookingId]: res.data.data }));
    } catch (err) {
      console.error("Error fetching property details:", err);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/messages/delete/${id}`);
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg._id !== id)
          );
          Swal.fire("Deleted!", "The message has been deleted.", "success");
        } catch (err) {
          console.error("Error deleting message:", err);
          Swal.fire("Error!", "Failed to delete message.", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchMessages();
    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      fetchPropertyDetails(newMessage.bookingId);
    });
    return () => {
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📩 All Messages</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Loading messages...</div>}
      {!loading && messages.length > 0 ? (
        <table className="table  table-hover border rounded">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Booking ID</th>
              <th>Property</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {messages.map((msg, index) => {
              const property = propertyDetails[msg.bookingId] || {};
              return (
                <tr key={msg._id}>
                  <td>{index + 1}</td>
                  <td>{msg.name || "N/A"}</td>
                  <td>{msg.email || "N/A"}</td>
                  <td>{msg.bookingId || "N/A"}</td>
                  <td>{property.title || "Fetching..."}</td>
                  <td style={{ maxWidth: "250px", whiteSpace: "pre-wrap" }}>
                    {msg.message || "No message"}
                  </td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(msg._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-muted">No messages found.</div>
      )}
    </div>
  );
};
