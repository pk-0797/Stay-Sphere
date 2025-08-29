import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash, FaBell, FaSyncAlt } from "react-icons/fa";

const socket = io("http://localhost:3002");

export const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchNotifications();

    socket.on(`notification-${userId}`, (notification) => {
      console.log("Received notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off(`notification-${userId}`);
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/notifications/${userId}`);
      setNotifications(res.data.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/notifications/mark-read/${notificationId}`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const deleteNotification = async (notificationId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This notification will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/notifications/delete/${notificationId}`);
        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== notificationId)
        );
        setSelectedNotifications((prev) =>
          prev.filter((id) => id !== notificationId)
        );

        Swal.fire("Deleted!", "Notification has been removed.", "success");
      } catch (err) {
        console.error("Error deleting notification:", err);
        Swal.fire("Error!", "Failed to delete notification.", "error");
      }
    }
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((notifId) => notifId !== id)
        : [...prev, id]
    );
  };

  const deleteMultipleNotifications = async () => {
    if (selectedNotifications.length === 0) {
      return Swal.fire("No Selection", "Select notifications to delete.", "info");
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Selected notifications will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      try {
        await axios.post(`/notifications/delete-multiple`, {
          ids: selectedNotifications,
        });
        setNotifications((prev) =>
          prev.filter((notif) => !selectedNotifications.includes(notif._id))
        );
        setSelectedNotifications([]);
        Swal.fire("Deleted!", "Selected notifications have been removed.", "success");
      } catch (err) {
        console.error("Error deleting multiple notifications:", err);
        Swal.fire("Error!", "Failed to delete selected notifications.", "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h4 className="fw-bold text-primary d-flex align-items-center gap-2">
          <FaBell /> Notifications
        </h4>
        <button
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          onClick={fetchNotifications}
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {/* Notifications */}
      {notifications.length > 0 ? (
        <>
          {/* Bulk Action */}
          <div className="mb-3 d-flex justify-content-end">
            <button
              className="btn btn-danger d-flex align-items-center gap-2"
              onClick={deleteMultipleNotifications}
              disabled={selectedNotifications.length === 0}
            >
              <FaTrash /> Delete Selected ({selectedNotifications.length})
            </button>
          </div>

          {/* Desktop / Tablet Table */}
          <div className="d-none d-md-block table-responsive rounded shadow-sm">
            <table className="table table-hover align-middle">
              <thead className="table-primary text-uppercase text-center">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedNotifications(
                          e.target.checked ? notifications.map((n) => n._id) : []
                        )
                      }
                      checked={
                        selectedNotifications.length === notifications.length &&
                        notifications.length > 0
                      }
                    />
                  </th>
                  <th>#</th>
                  <th className="text-start">Message</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notif, index) => (
                  <tr
                    key={notif._id}
                    className={`${notif.isRead ? "" : "table-warning"} text-center`}
                    onClick={() => markAsRead(notif._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notif._id)}
                        onChange={() => toggleSelectNotification(notif._id)}
                      />
                    </td>
                    <td className="fw-bold text-secondary">{index + 1}</td>
                    <td
                      className="text-wrap text-start"
                      style={{ maxWidth: "350px" }}
                    >
                      {notif.message}
                    </td>
                    <td className="text-nowrap small">
                      {new Date(notif.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`badge px-3 py-2 ${
                          notif.isRead ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {notif.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif._id);
                        }}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="d-block d-md-none">
            {notifications.map((notif, index) => (
              <div
                key={notif._id}
                className={`card shadow-sm mb-3 ${
                  notif.isRead ? "" : "border-warning"
                }`}
                onClick={() => markAsRead(notif._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0 text-secondary">#{index + 1}</h6>
                    <span
                      className={`badge ${
                        notif.isRead ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {notif.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                  <p className="mb-2 text-dark">{notif.message}</p>
                  <small className="text-muted">
                    {new Date(notif.createdAt).toLocaleString()}
                  </small>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notif._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelectNotification(notif._id);
                        }}
                      />{" "}
                      Select
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif._id);
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="alert alert-info text-center mt-3 p-4 shadow-sm rounded fw-semibold">
          🎉 No new notifications
        </div>
      )}
    </div>
  );
};

export default Notification;
