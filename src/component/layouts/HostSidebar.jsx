import React, { useEffect, useState } from "react";
import { HostNavbar } from "./HostNavbar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const socket = io("http://localhost:3002");
export const HostSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!isSidebarOpen);
  };

  const socket = io("http://localhost:3002");
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const res = await axios.get(`/messages/all`);
        const unreadCount = res.data.data.filter((msg) => !msg.isRead).length;
        setNewMessages(unreadCount);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchUnreadMessages();

    // Real-time update using socket.io
    socket.on("newMessage", (newMessage) => {
      setNewMessages((prev) => prev + 1);
    });

    const interval = setInterval(fetchUnreadMessages, 5000);
    return () => {
      clearInterval(interval);
      socket.off("newMessage");
    };
  }, []);

  const [newRequests, setNewRequests] = useState(0);
  const hostId = localStorage.getItem("id");

  useEffect(() => {
    const fetchNewBookings = async () => {
      try {
        const res = await axios.get(`/booking/host/${hostId}`);
        if (res.data && res.data.data) {
          const pendingBookings = res.data.data.filter(
            (booking) => booking.status === "Pending"
          );
          setNewRequests(pendingBookings.length); // Update state with the count of pending requests
        }
      } catch (error) {
        console.error("Error fetching new bookings:", error);
      }
    };

    fetchNewBookings(); // Fetch once when the component mounts
    const interval = setInterval(fetchNewBookings, 30000); // Auto-refresh every 30 sec

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [hostId]);

  const [newMessages, setNewMessages] = useState(0);

  useEffect(() => {
    const fetchNewMessages = async () => {
      try {
        const res = await axios.get(`/messages/host/${hostId}`);
        if (res.data && res.data.data) {
          setNewMessages(res.data.data.length); // Update state with new messages count
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchNewMessages();

    // ✅ Ensure socket listens for new messages
    socket.on("newMessage", () => {
      setNewMessages((prev) => prev + 1);
    });

    return () => {
      socket.off("newMessage"); // Cleanup socket listener
    };
  }, [hostId]);

  const navigate = useNavigate();

  const handleLogout =() => {
    localStorage.clear();
    navigate("/")
  }

  return (
    <>
      <div className="app-wrapper">
        <HostNavbar toggleSidebar={toggleSidebar} />
        <aside
          className={`app-sidebar bg-body-secondary shadow ${
            isSidebarOpen ? "open" : "d-none"
          }`}
          data-bs-theme="dark"
        >
          <div className="sidebar-brand">
            <Link to="/host/home" className="brand-link">
              <div className="brand-text  text-uppercase">Stay Sphere</div>
            </Link>
          </div>

          <div className="sidebar-menu-container">
            <nav className="mt-2">
              <ul className="nav sidebar-menu flex-column" role="menu">
                <li className="nav-item">
                  <Link to="home" className="nav-link">
                    <i className="nav-icon bi bi-house-door" />
                    <p>Home</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="addproperty" className="nav-link">
                    <i class=" nav-icon bi bi-house-add"></i>
                    <p>Explore Listings</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="myproperty" className="nav-link">
                    <i className="nav-icon bi bi-calendar-check" />
                    <p>My Property</p>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="bookingrequest" className="nav-link">
                    <i className="nav-icon bi bi-repeat"></i>
                    <p>
                      Booking Request
                      {newRequests > 0 && (
                        <span className="badge bg-danger ms-2">
                          {newRequests}
                        </span>
                      )}
                    </p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/host/messages" className="nav-link">
                    <i className="nav-icon bi bi-chat-dots" />
                    <p>
                      Messages
                      {newMessages > 0 && (
                        <span className="badge bg-danger ms-2">
                          {newMessages}
                        </span>
                      )}
                    </p>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="profile" className="nav-link">
                    <i className="nav-icon bi bi-person-circle" />
                    <p>Profile Settings</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-link text-danger" onClick={handleLogout}>
                    <i className="nav-icon bi bi-box-arrow-right" />
                    <p>Logout</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        <main class="app-main">
          <Outlet></Outlet>
        </main>
      </div>
    </>
  );
};
