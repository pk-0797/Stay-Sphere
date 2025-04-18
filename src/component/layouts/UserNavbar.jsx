import React, { useEffect, useState } from "react";
import hamburgermenu from "../../assets/Images/hamburgermenu.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const UserNavbar = ({ toggleSidebar }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
      const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(`/notifications/count/${userId}`);
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="app-header navbar navbar-expand bg-body ">
      {/*begin::Container*/}
      <div className="container-fluid ">
        <ul className="navbar-nav">
          <li className="nav-item ">
            <a
              className="nav-link btn btn-light"
              href="#"
              role="button"data-bs-toggle="tooltip"
              style={{
                color: "black",
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              onClick={toggleSidebar}
            >
              <img
                src={hamburgermenu}
                style={{ height: "25px", width: "25px" }}
              ></img>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav   ms-auto">
          <li className="nav-item nav-icon d-none d-md-block ">
            <Link to="home" className="nav-link" data-bs-toggle="tooltip"
              title="Home">
              <i className="nav-icon bi bi-house-door-fill" />
              
            </Link>
          </li>
          <li className="nav-item nav-icon d-none d-md-block">
            <Link to="mybooking" className="nav-link"data-bs-toggle="tooltip"
              title="My Bookings">
              <i className="nav-icon bi bi-calendar-check" />
            </Link>
          </li>
          <li className="nav-item nav-icon d-none d-md-block">
            <Link to="wishlist" className="nav-link"data-bs-toggle="tooltip"
              title="Wishlist">
              <i className="nav-icon bi bi-heart" />
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="notifications"data-bs-toggle="tooltip"
              title="Notifications">
              <i className="nav-icon bi bi-bell-fill" />
              {unreadCount > 0 && (
                <span
                  className="badge bg-warning position-absolute"
                  style={{
                    top: "5px",
                    right: "-2px",
                    fontSize: "12px",
                    padding: "3px 6px",
                    borderRadius: "50%",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              data-widget="navbar-search"
              to="profile"
              role="button"data-bs-toggle="tooltip"
              title="Profile"
            >
              <i className="nav-icon bi bi-person-circle" />
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/"
              className="nav-link text-danger"
              data-bs-toggle="tooltip"
              title=""
              onClick={handleLogout}
            >
              <i className="nav-icon bi bi-box-arrow-right" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
