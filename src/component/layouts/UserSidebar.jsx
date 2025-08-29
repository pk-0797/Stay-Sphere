import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaCalendarCheck,
  FaHeart,
  FaListAlt,
  FaCommentDots,
  FaBell,
  FaUserCircle,
  FaFlag,
  FaSignOutAlt,
} from "react-icons/fa";

export const UserSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);

  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  // ✅ closes sidebar on mobile after clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchWishlist = async () => {
        try {
          const res = await axios.get(`/user/wishlist/${userId}`);
          setWishlist(res.data.data);
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      };

      const fetchNotifications = async () => {
        try {
          const res = await axios.get(`/notifications/count/${userId}`);
          setNotificationCount(res.data.count);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchWishlist();
      fetchNotifications();

      const interval = setInterval(() => {
        fetchWishlist();
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    handleLinkClick(); // ✅ also close sidebar on logout
  };

  return (
    <div className="d-flex">
      {/* Top Navbar */}
      <div
        className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light w-100"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1030 }}
      >
        <button className="btn btn-outline-primary" onClick={toggleSidebar}>
          ☰
        </button>
        <Link to="/user/home">
          <img src="/Image/logo.png" alt="" height={"40px"} width={"50px"} />
        </Link>
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
          <ul className="list-unstyled">
            <li>
              <Link
                to="home"
                onClick={handleLinkClick}
                className="d-flex align-items-center p-2 text-dark"
                style={{ textDecoration: "none" }}
              >
                <FaHome color="#007bff" className="me-2" /> Home
              </Link>
            </li>
            <li>
              <Link
                to="mybooking"
                onClick={handleLinkClick}
                className="d-flex align-items-center p-2 text-dark"
                style={{ textDecoration: "none" }}
              >
                <FaCalendarCheck color="#28a745" className="me-2" /> My Bookings
              </Link>
            </li>
            <li>
              <Link
                to="wishlist"
                onClick={handleLinkClick}
                className="d-flex align-items-center p-2 text-dark"
                style={{ textDecoration: "none" }}
              >
                <FaHeart color="#dc3545" className="me-2" /> Wishlist (
                {wishlist.length})
              </Link>
            </li>
            <li>
              <Link
                to="bookingreview"
                onClick={handleLinkClick}
                className="d-flex align-items-center p-2 text-dark"
                style={{ textDecoration: "none" }}
              >
                <FaListAlt color="#17a2b8" className="me-2" /> Review Your
                Bookings
              </Link>
            </li>
            <li>
              <Link
                to="messages"
                onClick={handleLinkClick}
                className="d-flex align-items-center p-2 text-dark"
                style={{ textDecoration: "none" }}
              >
                <FaCommentDots color="#ffc107" className="me-2" /> Connect with
                Host
              </Link>
            </li>
            <li>
              <Link
                to="notifications"
                onClick={handleLinkClick}
                className="d-flex align-items-center p-2 text-dark"
                style={{ textDecoration: "none" }}
              >
                <FaBell color="#6f42c1" className="me-2" /> Notifications
                {notificationCount > 0 && (
                  <span className="badge bg-danger ms-2">
                    {notificationCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="profile"
                onClick={handleLinkClick}
                className="d-flex align-items-center p-2 text-dark"
                style={{ textDecoration: "none" }}
              >
                <FaUserCircle color="#fd7e14" className="me-2" /> Profile
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="contact-admin"
                onClick={handleLinkClick}
                className="d-flex align-items-center p-2 text-dark"
                style={{ textDecoration: "none" }}
              >
                <FaFlag color="#20c997" className="me-2" /> Report Admin
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="btn btn-link text-danger d-flex align-items-center p-2"
                style={{ textDecoration: "none" }}
              >
                <FaSignOutAlt color="#dc3545" className="me-2" /> Logout
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
    </div>
  );
};
