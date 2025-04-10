import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminNavbar } from "./AdminNavbar";

export const AdminSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const userId = localStorage.getItem("id");

  useEffect(() => {
    // Fetch notification count
    axios
      .get(`/notifications/count/${userId}`)
      .then((response) => setNotificationCount(response.data.count))
      .catch((error) =>
        console.error("Error fetching notification count:", error)
      );

    // Fetch unread report count
    axios
      .get("/report/unread-count")
      .then((res) => setReportCount(res.data.count))
      .catch((err) => console.error("Error fetching report count:", err));
  }, [userId]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div className="app-wrapper">
        <AdminNavbar toggleSidebar={toggleSidebar} />

        <aside
          className={`app-sidebar bg-body-secondary shadow ${
            isSidebarOpen ? "open" : "d-none"
          }`}
          data-bs-theme="dark"
        >
          <div className="sidebar-brand">
            <Link to="/admin/home" className="brand-link">
              <span className="brand-text fw-light text-uppercase">
                Stay Sphere
              </span>
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
                  <Link to="allproperties" className="nav-link">
                    <i className="nav-icon bi bi-building" />
                    <p>Manage Properties</p>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="allbookings" className="nav-link">
                    <i className="nav-icon bi bi-calendar-check" />
                    <p>Manage Bookings</p>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="allusers" className="nav-link">
                    <i className="nav-icon bi bi-people" />
                    <p>Manage Users</p>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="allreports" className="nav-link">
                    <i className="nav-icon bi bi-flag" />
                    <p>
                      Reports & Issues{" "}
                      {reportCount > 0 && (
                        <span className="badge bg-danger">{reportCount}</span>
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
                  <Link
                    to="/"
                    className="nav-link text-danger"
                    onClick={handleLogout}
                  >
                    <i className="nav-icon bi bi-box-arrow-right" />
                    <p>Logout</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </>
  );
};
