import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaBuilding,
  FaCommentDots,
  FaClipboardList,
  FaUserCog,
  FaFlag,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3002");

export const HostSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newRequests, setNewRequests] = useState(0);
  const [newMessages, setNewMessages] = useState(0);

  const navigate = useNavigate();
  const hostId = localStorage.getItem("id");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Fetch new bookings
  useEffect(() => {
    const fetchNewBookings = async () => {
      try {
        const res = await axios.get(`/booking/host/${hostId}`);
        if (res.data && res.data.data) {
          const pendingBookings = res.data.data.filter(
            (booking) => booking.status === "Pending"
          );
          setNewRequests(pendingBookings.length);
        }
      } catch (error) {
        console.error("Error fetching new bookings:", error);
      }
    };

    fetchNewBookings();
    const interval = setInterval(fetchNewBookings, 30000);
    return () => clearInterval(interval);
  }, [hostId]);

  // Fetch unread messages + socket.io updates
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const res = await axios.get(`/messages/host/${hostId}`);
        const unreadCount = res.data.data.filter((msg) => !msg.isRead).length;
        setNewMessages(unreadCount);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchUnreadMessages();

    socket.on("newMessage", () => {
      setNewMessages((prev) => prev + 1);
    });

    const interval = setInterval(fetchUnreadMessages, 5000);
    return () => {
      clearInterval(interval);
      socket.off("newMessage");
    };
  }, [hostId]);

  return (
    <div className="d-flex">
      {/* Top Navbar */}
      <div
        className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light w-100"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1030 }}
      >
        <button
          className="btn btn-outline-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        <h5 className="mb-0">Host Dashboard</h5>
      </div>

      {/* Sidebar */}
      <aside
        className="bg-white border-end vh-100 p-3 shadow-sm position-fixed"
        style={{
          top: "56px",
          left: isOpen ? "0" : "-250px",
          width: "250px",
          transition: "all 0.3s ease",
          zIndex: 1020,
        }}
      >
        <nav>
          <ul className="list-unstyled m-0">
            <li>
              <Link
                to="/host/home"
                className="sidebar-link d-flex align-items-center p-2"
              >
                <FaHome className="me-2 text-primary" /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/host/addproperty"
                className="sidebar-link d-flex align-items-center p-2"
              >
                <FaPlus className="me-2 text-warning" /> Add Property
              </Link>
            </li>
            <li>
              <Link
                to="/host/myproperty"
                className="sidebar-link d-flex align-items-center p-2"
              >
                <FaBuilding className="me-2 text-success" /> My Property
              </Link>
            </li>
            <li>
              <Link
                to="/host/bookingrequest"
                className="sidebar-link d-flex align-items-center p-2"
              >
                <FaClipboardList className="me-2 text-danger" /> Booking
                Requests
                {newRequests > 0 && (
                  <span className="badge bg-danger ms-2">{newRequests}</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/host/messages"
                className="sidebar-link d-flex align-items-center p-2"
              >
                <FaCommentDots className="me-2 text-info" /> Messages
                {newMessages > 0 && (
                  <span className="badge bg-danger ms-2">{newMessages}</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/host/profile"
                className="sidebar-link d-flex align-items-center p-2"
              >
                <FaUserCog className="me-2 text-dark" /> Profile Settings
              </Link>
            </li>
            <li>
              <Link
                to="/host/contact-admin"
                className="sidebar-link d-flex align-items-center p-2"
              >
                <FaFlag className="me-2 text-danger" /> Report Admin
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="sidebar-link btn btn-link text-danger d-flex align-items-center p-2 w-100 text-start"
              >
                <FaSignOutAlt className="me-2 text-secondary" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className="flex-grow-1"
        style={{
          marginTop: "70px",
          marginLeft: isOpen ? "250px" : "0px",
          transition: "all 0.3s ease",
        }}
      >
        <Outlet />
      </main>

      <style>
        {`
          .sidebar-link {
            text-decoration: none;
            color: #333;
            border-radius: 6px;
            transition: all 0.2s ease;
          }
          .sidebar-link:hover {
            background-color: #f0f2f5;
            color: #007bff;
            text-decoration: none;
          }
        `}
      </style>
    </div>
  );
};
