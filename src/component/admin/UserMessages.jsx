import React, { useEffect, useState } from "react";
import axios from "axios";

export const UserMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("/report/admin/userreports");
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  // Get color class based on senderType
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

  const [replyText, setReplyText] = useState("");

const handleReply = async (userId) => {
  const adminId = localStorage.getItem("id");

  if (!replyText.trim()) return;

  const payload = {
    senderId: adminId,
    receiverId: userId,
    message: replyText,
  };

  try {
    await axios.post("/report/admin/reply", payload);
    setReplyText("");
    Swal.fire("Success", "Reply sent to user!", "success");
  } catch (err) {
    Swal.fire("Error", "Failed to send reply.", "error");
  }
};


  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-dark text-white fw-bold">
          Reports from Users, Hosts & Guests
        </div>
        <div className="card-body">
          {messages.length === 0 ? (
            <p className="text-muted">No messages yet.</p>
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
                </li>
              ))}
            </ul>
          )}
        </div>
        
      </div>
    </div>
  );
};
