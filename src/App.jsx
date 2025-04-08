import "./App.css"; // Original App.css Is Removed!!
import { Login } from "./component/common/Login";
import { SignUp } from "./component/common/SignUp";
import { Error404 } from "./component/common/Error404";
import { UserSidebar } from "./component/layouts/UserSidebar";
import { UserProfile } from "./component/user/UserProfile";
import { Route, Routes } from "react-router-dom";
import "./assets/adminlte.css";
import "./assets/adminlte.min.css";
import { ForgetPass } from "./component/common/ForgetPass";
import { ResetPassword } from "./component/common/ResetPassword";
import { Home } from "./component/common/Home";
import axios from "axios";
import { HostSidebar } from "./component/layouts/HostSidebar";
import { AddProperty } from "./component/host/AddProperty";
import { AddBooking } from "./component/user/AddBooking";
import { ViewMyProperty } from "./component/host/ViewMyProperty";
import { ViewMyBooking } from "./component/user/ViewMyBooking";
import { UserHome } from "./component/user/UserHome";
import { UpdateOrCancelBooking } from "./component/host/UpdateOrCancelBooking";
import { Review } from "./component/user/Review";
import { ReviewFormForUser } from "./component/user/ReviewFormForUser";
import { Wishlist } from "./component/user/Wishlist";
import { MessageComponent } from "./component/user/MessageComponent";
import { HostProfile } from "./component/host/HostProfile";
import Notifications from "./component/user/Notifications";
import { HostHome } from "./component/host/HostHome";
import { ContactHostForm } from "./component/user/ContactHostForm";
import { MessagesFromUsers } from "./component/host/MessagesFromUsers";
import { UpdatePropertyPrice } from "./component/host/UpdatePropertyPrice";
import { PrivateRoute } from "./component/hooks/PrivateRoute";
import { AdminLogin } from "./component/admin/AdminLogin";
import { AdminSidebar } from "./component/admin/AdminSidebar";
import { AdminHome } from "./component/admin/AdminHome";
import { AdminProfile } from "./component/admin/AdminProfile";
import { AdminDashboard } from "./component/admin/AdminDashboard";
import { ManageUsers } from "./component/admin//ManageUsers";
import { ManageProperties } from "./component/admin/ManageProperties";
import { ManageBookings } from "./component/admin/ManageBookings";
import { HomeDetails } from "./component/user/HomeDetails";
import { PropertyDetails } from "./component/common/PropertyDetails";

import { UserMessages } from "./component/admin/UserMessages";
import AdminReport from "./component/host/AdminReport";
import ReportAdmin from "./component/user/ReportAdmin";

// className= "app-wrapper" in UserSidebar and HostSidebar

function App() {
  axios.defaults.baseURL = "http://localhost:3002";

  return (
    <>
      <body className="layout-fixed sidebar-expand-lg bg-body-tertiary app-loaded sidebar-open">
        <div className="app-wrapper app-main">
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />}></Route>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/forgotpassword" element={<ForgetPass />}></Route>

            <Route
              path="/resetpassword/:token"
              element={<ResetPassword />}
            ></Route>
            <Route path="/property/details/:id" element={<PropertyDetails />} />

            {/* For User */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user" element={<UserSidebar />}>
                <Route path="profile" element={<UserProfile />}></Route>
                <Route path="wishlist" element={<Wishlist />}></Route>
                <Route path="booking/:id" element={<AddBooking />}></Route>
                <Route
                  path="property/details/:id"
                  element={<HomeDetails />}
                ></Route>
                <Route path="mybooking" element={<ViewMyBooking />}></Route>
                <Route path="home" element={<UserHome />}></Route>
                <Route
                  path="messages"
                  element={<MessageComponent></MessageComponent>}
                ></Route>
                <Route path="bookingreview" element={<Review />}></Route>
                <Route
                  path="contact-host/:bookingId/:hostId"
                  element={<ContactHostForm />}
                />
                <Route
                  path="bookingreview/reviewform/:propertyId/:bookingId"
                  element={<ReviewFormForUser />}
                />
                <Route path="notifications" element={<Notifications />}></Route>
                <Route path="contact-admin" element={<ReportAdmin />} />
              </Route>
            </Route>

            {/* For Host */}
            <Route element={<PrivateRoute allowedRoles={["host"]} />}>
              <Route path="/host" element={<HostSidebar />}>
                <Route path="home" element={<HostHome />} />
                <Route path="profile" element={<HostProfile />} />
                <Route path="messages" element={<MessagesFromUsers />}></Route>
                <Route
                  path="/host/updateproperty/:id"
                  element={<UpdatePropertyPrice />}
                />

                <Route path="addproperty" element={<AddProperty />} />
                <Route path="editproperty/:id" element={<AddProperty />} />
                <Route path="myproperty" element={<ViewMyProperty />} />
                <Route
                  path="bookingrequest"
                  element={<UpdateOrCancelBooking></UpdateOrCancelBooking>}
                ></Route>
                <Route path="contact-admin" element={<AdminReport />} />
              </Route>
            </Route>

            {/* For Admin */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminSidebar />}>
                <Route path="home" element={<AdminHome />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route
                  path="allusers"
                  element={<ManageUsers></ManageUsers>}
                ></Route>
                <Route
                  path="allproperties"
                  element={<ManageProperties />}
                ></Route>
                <Route path="allbookings" element={<ManageBookings />}></Route>
                <Route path="allreports" element={<UserMessages />} />
              </Route>
            </Route>
            <Route path="/*" element={<Error404 />}></Route>
          </Routes>
        </div>
      </body>
    </>
  );
}

export default App;
