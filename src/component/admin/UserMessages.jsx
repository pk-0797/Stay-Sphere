import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const UserMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("/report/admin/userreports");
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const deleteReport = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/report/delete/${id}`);
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        Swal.fire("Deleted!", "The report has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting report:", error);
        Swal.fire("Error!", "Failed to delete the report.", "error");
      }
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case "host":
        return "badge bg-success";
      case "user":
        return "badge bg-primary";
      case "guest":
        return "badge bg-warning text-dark";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-dark text-center text-white fw-bold">
          Reports from Hosts & Guests
        </div>
        <div className="card-body">
          {messages.length === 0 ? (
            <p className="text-muted text-center">No messages yet.</p>
          ) : (
            <ul className="list-group">
              {messages.map((msg) => (
                <li className="list-group-item" key={msg._id}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>
                      <span className={getBadgeClass(msg.senderType)}>
                        {msg.senderType.charAt(0).toUpperCase() +
                          msg.senderType.slice(1)}
                      </span>
                    </span>
                    <small className="text-muted">
                      {new Date(msg.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <p className="mb-0">{msg.message}</p>
                  <small className="text-muted">
                    Sent by: {msg.senderId?.fullName} ({msg.senderId?.email}) -{" "}
                    {msg.senderId?.role}
                  </small>
                  <div className="mt-2 text-end">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteReport(msg._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

