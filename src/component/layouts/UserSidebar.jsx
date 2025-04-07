import React, { useEffect, useState } from "react";
import { UserNavbar } from "./UserNavbar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

export const UserSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!isSidebarOpen);
  };
  const [wishlist, setWishlist] = useState([]); // ✅ Add wishlist state
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (userId) {
      axios
        .get(`/user/wishlist/${userId}`)
        .then((response) => setWishlist(response.data.data))
        .catch((error) => console.error("Error fetching wishlist:", error));
    }
    // ✅ Fetch unread notification count
    axios
      .get(`/notifications/count/${userId}`)
      .then((response) => setNotificationCount(response.data.count))
      .catch((error) =>
        console.error("Error fetching notification count:", error)
      );
  }, [userId]);

  const navigate = useNavigate();

  const handleLogout =() => {
    localStorage.clear();
    navigate("/")
  }

  return (
    <>
      <div className="app-wrapper">
        <UserNavbar toggleSidebar={toggleSidebar} />
        <aside
          className={`app-sidebar bg-body-secondary shadow ${
            isSidebarOpen ? "open" : "d-none"
          }`}
          data-bs-theme="dark"
        >
          <div className="sidebar-brand">
            <Link to="/user/home" className="brand-link">
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
                  <Link to="mybooking" className="nav-link">
                    <i className="nav-icon bi bi-calendar-check" />
                    <p>My Bookings</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="wishlist" className="nav-link">
                    <i className="nav-icon bi bi-heart" />
                    <p>Wishlist ({wishlist.length})</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="bookingreview" className="nav-link">
                    <i class="nav-icon bi bi-card-list"></i>
                    <p>Review your bookings</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="messages" className="nav-link">
                    <i className="nav-icon bi bi-chat-dots" />
                    <p>Connect with Host</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="notifications" className="nav-link">
                    <i className="nav-icon bi bi-bell" />
                    <p>
                      Notifications{" "}
                      {notificationCount > 0 && (
                        <span className="badge bg-danger">
                          {notificationCount}
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
