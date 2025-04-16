import React, { useEffect, useState } from "react";
import hamburgermenu from "../../assets/Images/hamburgermenu.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

export const HostNavbar = ({ toggleSidebar }) => {
  const [pendingBookings, setPendingBookings] = useState(0);
  const [newMessages, setNewMessages] = useState(0);
  const hostId = localStorage.getItem("id");
  const socket = io("http://localhost:3002");

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const res = await axios.get(`/booking/host/${hostId}`);
        const pendingCount = res.data.data.filter(
          (b) => b.status === "Pending"
        ).length;
        setPendingBookings(pendingCount);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchPendingBookings();
    const interval = setInterval(fetchPendingBookings, 10000);
    return () => clearInterval(interval);
  }, [hostId]);

  // useEffect(() => {
  //   const fetchUnreadMessages = async () => {
  //     try {
  //       const res = await axios.get(`/messages/all`);
  //       const unreadCount = res.data.data.filter((msg) => !msg.isRead).length;
  //       setNewMessages(unreadCount);
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };

  //   fetchUnreadMessages();

  //   // Real-time update using socket.io
  //   socket.on("newMessage", (newMessage) => {
  //     setNewMessages((prev) => prev + 1);
  //   });

  //   const interval = setInterval(fetchUnreadMessages, 5000);
  //   return () => {
  //     clearInterval(interval);
  //     socket.off("newMessage");
  //   };
  // }, []);
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        // Get the host ID from localStorage
        const hostId = localStorage.getItem("id");
  
        // Fetch messages associated with this host
        const res = await axios.get(`/messages/host/${hostId}`);
        
        // Filter for unread messages
        const unreadCount = res.data.data.filter((msg) => !msg.isRead).length;
        setNewMessages(unreadCount);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    fetchUnreadMessages();
  
    // Real-time update using socket.io
    socket.on("newMessage", (newMessage) => {
      // Check if the new message is for this host
      if (newMessage.hostId === hostId) {
        setNewMessages((prev) => prev + 1);
      }
    });
  
    const interval = setInterval(fetchUnreadMessages, 5000);
    return () => {
      clearInterval(interval);
      socket.off("newMessage");
    };
  }, []);
  

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("id");
  
      if (!userId || userId === "null") {
        console.error("No valid user ID found in localStorage");
        return;
      }
  
      await axios.post("/user/logout", { userId });
  
      // Ensure socket disconnects properly
      if (socket && socket.connected) {
        socket.disconnect();
      }
  
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

  return (
    <nav className="app-header navbar navbar-expand bg-body">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link btn btn-light"
              href="#"
              role="button"
              onClick={toggleSidebar}
              data-bs-toggle="tooltip"
            >
              <img
                src={hamburgermenu}
                style={{ height: "25px", width: "25px" }}
                alt="Menu"
              />
            </a>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              to="home"
              className="nav-link"
              data-bs-toggle="tooltip"
              title="Home"
            >
              <i className="nav-icon bi bi-house-door-fill" />
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="addproperty"
              className="nav-link"
              data-bs-toggle="tooltip"
              title="Add Property"
            >
              <i className="nav-icon bi bi-house-add"></i>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="myproperty"
              className="nav-link"
              data-bs-toggle="tooltip"
              title="My Properties"
            >
              <i className="nav-icon bi bi-calendar-check" />
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="messages"
              className="nav-link"
              data-bs-toggle="tooltip"
              title="Messages"
            >
              <i className="nav-icon bi bi-chat-right-text"></i>
              {newMessages > 0 && (
                <span className="navbar-badge badge text-bg-danger">
                  {newMessages}
                </span>
              )}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="bookingrequest"
              className="nav-link"
              data-bs-toggle="tooltip"
              title="Booking Requests"
            >
              <i className="nav-icon bi bi-repeat"></i>
              {pendingBookings > 0 && (
                <span className="navbar-badge badge text-bg-danger">
                  {pendingBookings}
                </span>
              )}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="profile"
              className="nav-link"
              data-bs-toggle="tooltip"
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

<ul className="navbar-nav ms-auto">
  <li className="nav-item">
    <a className="nav-link" data-widget="navbar-search" href="#" role="button">
      <i className="bi bi-search" />
    </a>
  </li>

  <li className="nav-item dropdown">
    <a className="nav-link" data-bs-toggle="dropdown" href="#">
      <i className="bi bi-chat-text" />
      <span className="navbar-badge badge text-bg-danger">3</span>
    </a>
    <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
      <a href="#" className="dropdown-item">
        <div className="d-flex">
          <div className="flex-shrink-0">
            <img
              src="../../dist/assets/img/user1-128x128.jpg"
              alt="User Avatar"
              className="img-size-50 rounded-circle me-3"
            />
          </div>
          <div className="flex-grow-1">
            <h3 className="dropdown-item-title">
              Brad Diesel
              <span className="float-end fs-7 text-danger">
                <i className="bi bi-star-fill" />
              </span>
            </h3>
            <p className="fs-7">Call me whenever you can...</p>
            <p className="fs-7 text-secondary">
              <i className="bi bi-clock-fill me-1" /> 4 Hours Ago
            </p>
          </div>
        </div>
      </a>
      <div className="dropdown-divider" />
      <a href="#" className="dropdown-item">
        {/*begin::Message*/}
        <div className="d-flex">
          <div className="flex-shrink-0">
            <img
              src="../../dist/assets/img/user8-128x128.jpg"
              alt="User Avatar"
              className="img-size-50 rounded-circle me-3"
            />
          </div>
          <div className="flex-grow-1">
            <h3 className="dropdown-item-title">
              John Pierce
              <span className="float-end fs-7 text-secondary">
                <i className="bi bi-star-fill" />
              </span>
            </h3>
            <p className="fs-7">I got your message bro</p>
            <p className="fs-7 text-secondary">
              <i className="bi bi-clock-fill me-1" /> 4 Hours Ago
            </p>
          </div>
        </div>
      </a>
      <div className="dropdown-divider" />
      <a href="#" className="dropdown-item">
        <div className="d-flex">
          <div className="flex-shrink-0">
            <img
              src="../../dist/assets/img/user3-128x128.jpg"
              alt="User Avatar"
              className="img-size-50 rounded-circle me-3"
            />
          </div>
          <div className="flex-grow-1">
            <h3 className="dropdown-item-title">
              Nora Silvester
              <span className="float-end fs-7 text-warning">
                <i className="bi bi-star-fill" />
              </span>
            </h3>
            <p className="fs-7">The subject goes here</p>
            <p className="fs-7 text-secondary">
              <i className="bi bi-clock-fill me-1" /> 4 Hours Ago
            </p>
          </div>
        </div>
      </a>
      <div className="dropdown-divider" />
      <a href="#" className="dropdown-item dropdown-footer">
        See All Messages
      </a>
    </div>
  </li>

  <li className="nav-item dropdown">
    <a className="nav-link" data-bs-toggle="dropdown" href="#">
      <i className="bi bi-bell-fill" />
      <span className="navbar-badge badge text-bg-warning">15</span>
    </a>
    <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
      <span className="dropdown-item dropdown-header">15 Notifications</span>
      <div className="dropdown-divider" />
      <a href="#" className="dropdown-item">
        <i className="bi bi-envelope me-2" /> 4 new messages
        <span className="float-end text-secondary fs-7">3 mins</span>
      </a>
      <div className="dropdown-divider" />
      <a href="#" className="dropdown-item">
        <i className="bi bi-people-fill me-2" /> 8 friend requests
        <span className="float-end text-secondary fs-7">12 hours</span>
      </a>
      <div className="dropdown-divider" />
      <a href="#" className="dropdown-item">
        <i className="bi bi-file-earmark-fill me-2" /> 3 new reports
        <span className="float-end text-secondary fs-7">2 days</span>
      </a>
      <div className="dropdown-divider" />
      <a href="#" className="dropdown-item dropdown-footer">
        {" "}
        See All Notifications{" "}
      </a>
    </div>
  </li>

  <li className="nav-item">
    <a className="nav-link" href="#" data-lte-toggle="fullscreen">
      <i data-lte-icon="maximize" className="bi bi-arrows-fullscreen" />
      <i
        data-lte-icon="minimize"
        className="bi bi-fullscreen-exit"
        style={{ display: "none" }}
      />
    </a>
  </li>

  <li className="nav-item dropdown user-menu">
    <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
      <img
        src="../../dist/assets/img/user2-160x160.jpg"
        className="user-image rounded-circle shadow"
        alt="User Image"
      />
      <span className="d-none d-md-inline">Alexander Pierce</span>
    </a>
    <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
      {/*begin::User Image*/}
      <li className="user-header text-bg-primary">
        <img
          src="../../dist/assets/img/user2-160x160.jpg"
          className="rounded-circle shadow"
          alt="User Image"
        />
        <p>
          Alexander Pierce - Web Developer
          <small>Member since Nov. 2023</small>
        </p>
      </li>

      <li className="user-body">
        <div className="row">
          <div className="col-4 text-center">
            <a href="#">Followers</a>
          </div>
          <div className="col-4 text-center">
            <a href="#">Sales</a>
          </div>
          <div className="col-4 text-center">
            <a href="#">Friends</a>
          </div>
        </div>
      </li>

      <li className="user-footer">
        <a href="#" className="btn btn-default btn-flat">
          Profile
        </a>
        <a href="#" className="btn btn-default btn-flat float-end">
          Sign out
        </a>
      </li>
    </ul>
  </li>
</ul>;
