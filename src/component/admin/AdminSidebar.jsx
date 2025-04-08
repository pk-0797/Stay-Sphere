import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminNavbar } from "./AdminNavbar";

export const AdminSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setSidebarOpen(!isSidebarOpen);
  };
  
  const userId = localStorage.getItem("id");

  useEffect(() => {
   
    
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
                    <i class="nav-icon bi bi-people"></i>
                    <p>Manage Users</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="messages" className="nav-link">
                    <i className="nav-icon bi bi-chat-dots" />
                    <p>Messages</p>
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
                  <Link to="allreports" className="nav-link">
                    <i className="nav-icon bi bi-flag" />
                    <p>Reports & Issues</p>
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

// import React, { useEffect, useState } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AdminNavbar } from "./AdminNavbar";

// export const AdminSidebar = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };
  
//   const userId = localStorage.getItem("id");

//   useEffect(() => {
//     axios
//       .get(`/notifications/count/${userId}`)
//       .then((response) => setNotificationCount(response.data.count))
//       .catch((error) =>
//         console.error("Error fetching notification count:", error)
//       );
//   }, [userId]);

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <>
//       <div className="app-wrapper">
//         <AdminNavbar toggleSidebar={toggleSidebar} />
        
//         {/* Sidebar */}
//         <aside
//           className={`app-sidebar bg-body-secondary shadow ${isSidebarOpen ? "open" : "d-none d-md-block"}`}
//           data-bs-theme="dark"
//         >
//           {/* Sidebar Brand */}
//           <div className="sidebar-brand text-center py-3">
//             <Link to="/admin/home" className=" text-decoration-none">
//               <span className="fw-bold text-uppercase text-light">
//                 🏢 Stay Sphere Admin
//               </span>
//             </Link>
//           </div>

//           {/* Sidebar Menu */}
//           <div className="sidebar-menu-container">
//             <nav className="mt-2">
//               <ul className="nav flex-column">
//                 <li className="nav-item">
//                   <Link to="home" className="nav-link">
//                     <i className="nav-icon bi bi-house-door" />
//                     <p>Dashboard</p>
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link to="manage-hosts" className="nav-link">
//                     <i className="nav-icon bi bi-people" />
//                     <p>Manage Hosts</p>
//                   </Link>
//                 </li>
                
//                 <li className="nav-item">
//                   <Link to="manage-users" className="nav-link">
//                     <i className="nav-icon bi bi-person-check" />
//                     <p>Manage Users</p>
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link to="manage-properties" className="nav-link">
//                     <i className="nav-icon bi bi-building" />
//                     <p>Manage Properties</p>
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link to="bookings" className="nav-link">
//                     <i className="nav-icon bi bi-calendar-check" />
//                     <p>Bookings</p>
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link to="messages" className="nav-link">
//                     <i className="nav-icon bi bi-chat-dots" />
//                     <p>Messages</p>
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link to="notifications" className="nav-link">
//                     <i className="nav-icon bi bi-bell" />
//                     <p>
//                       Notifications{" "}
//                       {notificationCount > 0 && (
//                         <span className="badge bg-danger">
//                           {notificationCount}
//                         </span>
//                       )}
//                     </p>
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link to="reports" className="nav-link">
//                     <i className="nav-icon bi bi-flag" />
//                     <p>Reports & Issues</p>
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link to="settings" className="nav-link">
//                     <i className="nav-icon bi bi-gear" />
//                     <p>Admin Settings</p>
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link to="/" className="nav-link text-danger" onClick={handleLogout}>
//                     <i className="nav-icon bi bi-box-arrow-right" />
//                     <p>Logout</p>
//                   </Link>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="app-main">
//           <Outlet />
//         </main>
//       </div>
//     </>
//   );
// };
