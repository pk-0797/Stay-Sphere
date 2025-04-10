// import React, { useEffect, useState } from "react";
// import hamburgermenu from "../../assets/Images/hamburgermenu.png";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// export const AdminNavbar = ({ toggleSidebar }) => {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const userId = localStorage.getItem("id");

//   useEffect(() => {
//     fetchUnreadCount();
//   }, []);

//   const fetchUnreadCount = async () => {
//     try {
//       const res = await axios.get(`/notifications/count/${userId}`);
//       setUnreadCount(res.data.count);
//     } catch (err) {
//       console.error("Error fetching unread notifications:", err);
//     }
//   };

//   const navigate = useNavigate();

//   const handleLogout =() => {
//     localStorage.clear();
//     navigate("/")
//   }

//   return (
//     <nav className="app-header navbar navbar-expand bg-body ">
//       {/*begin::Container*/}
//       <div className="container-fluid ">
//         <ul className="navbar-nav">
//           <li className="nav-item ">
//             <a
//               className="nav-link btn btn-light"
//               href="#"
//               role="button"
//               style={{
//                 color: "black",
//                 padding: "5px 10px",
//                 border: "1px solid #ccc",
//                 borderRadius: "5px",
//               }}
//               onClick={toggleSidebar}
//             >
//               <img
//                 src={hamburgermenu}
//                 style={{ height: "25px", width: "25px" }}
//               ></img>
//             </a>
//           </li>
//         </ul>
//         <ul className="navbar-nav   ms-auto">
//           <li className="nav-item nav-icon d-none d-md-block">
//             <Link to="home" className="nav-link">
//               <i className="nav-icon bi bi-house-door" />
//             </Link>
//           </li>

//           <li className="nav-item">
//             <Link
//               className="nav-link"
//               data-widget="navbar-search"
//               to="allproperties"
//               role="button"
//             >
//               <i className="nav-icon bi bi-building" />
//             </Link>
//           </li>

//           <li className="nav-item">
//             <Link
//               className="nav-link"
//               data-widget="navbar-search"
//               to="allbookings"
//               role="button"
//             >
//               <i className="nav-icon bi bi-calendar-check" />
//             </Link>
//           </li>

//           <li className="nav-item">
//             <Link
//               className="nav-link"
//               data-widget="navbar-search"
//               to="allusers"
//               role="button"
//             >
//               <i className="nav-icon bi bi-people" />
//             </Link>
//           </li>

//           <li className="nav-item">
//             <Link
//               className="nav-link"
//               data-widget="navbar-search"
//               to="allreports"
//               role="button"
//             >
//               <i className="nav-icon bi bi-flag" />
//             </Link>
//           </li>

//           <li className="nav-item">
//             <Link
//               className="nav-link"
//               data-widget="navbar-search"
//               to="profile"
//               role="button"
//             >
//               <i className="nav-icon bi bi-person-circle" />
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link
//               to="/"
//               className="nav-link text-danger"
//               data-bs-toggle="tooltip"
//               title="Logout" onClick={handleLogout}
//             >
//               <i className="nav-icon bi bi-box-arrow-right" />
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

import React, { useEffect, useState } from "react";
import hamburgermenu from "../../assets/Images/hamburgermenu.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const AdminNavbar = ({ toggleSidebar }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadReports, setUnreadReports] = useState(0);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchUnreadCount();
    fetchUnreadReports();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(`/notifications/count/${userId}`);
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  };

  const fetchUnreadReports = async () => {
    try {
      const res = await axios.get("/report/unread-count");
      setUnreadReports(res.data.count);
    } catch (err) {
      console.error("Error fetching unread reports:", err);
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
                alt="menu"
                style={{ height: "25px", width: "25px" }}
              />
            </a>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item nav-icon d-none d-md-block">
            <Link to="home" className="nav-link">
              <i className="nav-icon bi bi-house-door" />
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="allproperties" role="button">
              <i className="nav-icon bi bi-building" />
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="allbookings" role="button">
              <i className="nav-icon bi bi-calendar-check" />
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="allusers" role="button">
              <i className="nav-icon bi bi-people" />
            </Link>
          </li>

          <li className="nav-item position-relative">
            <Link className="nav-link" to="allreports" role="button">
              <i className="nav-icon bi bi-flag" />
              {unreadReports > 0 && (
                <span className="navbar-badge badge text-bg-danger">
                  {unreadReports}
                </span>
              )}
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="profile" role="button">
              <i className="nav-icon bi bi-person-circle" />
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/"
              className="nav-link text-danger"
              title="Logout"
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
