import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSignInAlt, FaUserPlus, FaInfoCircle } from "react-icons/fa";

export const CommonNavbar = () => {
  const location = useLocation(); // get current route path

  // helper function to style icon based on active route
  const getIconColor = (path) =>
    location.pathname === path ? "#0d6efd" : "#6c757d"; // bootstrap blue when active, muted gray otherwise

  // helper function to return active border
  const getActiveBorder = (path) =>
    location.pathname === path
      ? { borderBottom: "3px solid #0d6efd" }
      : { borderBottom: "3px solid transparent" };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top shadow-sm">
      <div className="container-fluid">
        {/* Logo */}
        <Link to="/">
          <img
            src="/Image/logo.png"
            alt="Logo"
            height="50"
            width="80"
            className="web-img"
          />
        </Link>

        {/* Toggler Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            {/* Home */}
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center gap-1 px-3 ${
                  location.pathname === "/" ? "fw-bold text-primary" : ""
                }`}
                style={getActiveBorder("/")}
                to="/"
              >
                <FaHome color={getIconColor("/")} /> Home
              </Link>
            </li>

            {/* Login */}
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center gap-1 px-3 ${
                  location.pathname === "/login" ? "fw-bold text-primary" : ""
                }`}
                style={getActiveBorder("/login")}
                to="/login"
              >
                <FaSignInAlt color={getIconColor("/login")} /> Login
              </Link>
            </li>

            {/* Sign Up */}
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center gap-1 px-3 ${
                  location.pathname === "/signup" ? "fw-bold text-primary" : ""
                }`}
                style={getActiveBorder("/signup")}
                to="/signup"
              >
                <FaUserPlus color={getIconColor("/signup")} /> Sign Up
              </Link>
            </li>

            {/* About Us */}
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center gap-1 px-3 ${
                  location.pathname === "/aboutus" ? "fw-bold text-primary" : ""
                }`}
                style={getActiveBorder("/aboutus")}
                to="/aboutus"
              >
                <FaInfoCircle color={getIconColor("/aboutus")} /> About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
