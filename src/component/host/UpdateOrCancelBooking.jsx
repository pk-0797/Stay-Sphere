// import axios from "axios";
// import React, { useEffect, useState } from "react";

// export const UpdateOrCancelBooking = () => {
//   const [bookings, setBookings] = useState([]);
//   const hostId = localStorage.getItem("id"); // Assuming host is logged in
//   const [properties, setProperties] = useState([]);

//   useEffect(() => {
//     getAllMyProperties();
//   }, []);

//   const getAllMyProperties = async () => {
//     try {
//       const res = await axios.get(
//         `/property/getpropertiesbyuserid/${localStorage.getItem("id")}`
//       );
//       setProperties(res.data.data);
//     } catch (error) {
//       console.error("Error fetching properties:", error);
//     }
//   };
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await axios.get(`/booking/host/${hostId}`);
//         // Sort bookings to show latest first
//         const sortedBookings = res.data.data.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setBookings(sortedBookings);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       }
//     };

//     fetchBookings();
//   }, [hostId]);

//   const handleConfirm = async (bookingId) => {
//     await axios.put(`/booking/confirm/${bookingId}`);
//     window.location.reload();
//   };

//   const handleCancel = async (bookingId) => {
//     await axios.put(`/booking/cancel/${bookingId}`);
//     window.location.reload();
//   };

//   return (
//     <div className="container mt-3">
//       <h2 className="text-center mb-3 text-primary">Guest Booking Requests</h2>

//       <div className="table-responsive shadow-sm p-3 mb-5 bg-white rounded">
//         <table className="table table-bordered table-hover text-center align-middle">
//           <thead className="table-dark text-uppercase">
//             <tr>
//               <th>#</th>
//               <th>Guest Name</th>
//               <th>Email Id</th>
//               <th>Phone No</th>
//               <th>Property Title</th>
//               <th>Check-in</th>
//               <th>Check-out</th>
//               <th>Total Price</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.map((booking, index) => (
//               <tr key={booking._id} className="table-light">
//                 <td className="fw-bold">{index + 1}</td>
//                 <td>{booking.guestId?.fullName || "Unknown"}</td>
//                 <td>{booking.guestId?.email || "Unknown"}</td>
//                 <td>{booking.guestId?.phoneNo || "Unknown"}</td>
//                 <td>
//                   {properties.find((prop) => prop._id === booking.propertyId)
//                     ?.title || "N/A"}
//                 </td>

//                 <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
//                 <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
//                 <td className="p-3 font-weight-bold text-success">
//                   &#8377;{booking.totalPrice || "N/A"}/-
//                 </td>
//                 <td>
//                   <span
//                     className={`badge   ${
//                       booking.status === "Pending"
//                         ? "bg-warning text-dark"
//                         : booking.status === "Confirmed"
//                         ? "bg-success text-white"
//                         : "bg-danger text-white"
//                     }`}
//                   >
//                     {booking.status}
//                   </span>
//                 </td>

//                 <td>
//                   {booking.status === "Pending" && (
//                     <div className="d-flex justify-content-center gap-2">
//                       <button
//                         className="btn btn-success btn-sm px-3"
//                         onClick={() => handleConfirm(booking._id)}
//                       >
//                         Confirm
//                       </button>
//                       <button
//                         className="btn btn-danger btn-sm px-3"
//                         onClick={() => handleCancel(booking._id)}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const UpdateOrCancelBooking = () => {
  const [bookings, setBookings] = useState([]);
  const hostId = localStorage.getItem("id"); // Assuming host is logged in
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getAllMyProperties();
  }, []);

  const getAllMyProperties = async () => {
    try {
      const res = await axios.get(
        `/property/getpropertiesbyuserid/${localStorage.getItem("id")}`
      );
      setProperties(res.data.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`/booking/host/${hostId}`);
        // Sort bookings to show latest first
        const sortedBookings = res.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [hostId]);

  const handleConfirm = async (bookingId) => {
    const result = await Swal.fire({
      title: "Confirm Booking?",
      text: "Are you sure you want to confirm this booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`/booking/confirm/${bookingId}`);
        Swal.fire("Confirmed!", "Booking has been confirmed.", "success");
        window.location.reload();
      } catch (error) {
        Swal.fire("Error", "Failed to confirm booking.", "error");
      }
    }
  };

  const handleCancel = async (bookingId) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`/booking/cancel/${bookingId}`);
        Swal.fire("Cancelled!", "Booking has been cancelled.", "success");
        window.location.reload();
      } catch (error) {
        Swal.fire("Error", "Failed to cancel booking.", "error");
      }
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="text-center mb-3 text-primary">Guest Booking Requests</h2>

      <div className="table-responsive shadow-sm p-3 mb-5 bg-white rounded">
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-dark text-uppercase">
            <tr>
              <th>#</th>
              <th>Guest Name</th>
              <th>Email Id</th>
              <th>Phone No</th>
              <th>Property Title</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id} className="table-light">
                <td className="fw-bold">{index + 1}</td>
                <td>{booking.guestId?.fullName || "Unknown"}</td>
                <td>{booking.guestId?.email || "Unknown"}</td>
                <td>{booking.guestId?.phoneNo || "Unknown"}</td>
                <td>
                  {properties.find((prop) => prop._id === booking.propertyId)
                    ?.title || "N/A"}
                </td>
                <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                <td className="p-3 font-weight-bold text-success">
                  ₹{booking.totalPrice || "N/A"}/-
                </td>
                <td>
                  <span
                    className={`badge ${
                      booking.status === "Pending"
                        ? "bg-warning text-dark"
                        : booking.status === "Confirmed"
                        ? "bg-success text-white"
                        : "bg-danger text-white"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td>
                  {booking.status === "Pending" && (
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-success btn-sm px-3"
                        onClick={() => handleConfirm(booking._id)}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-danger btn-sm px-3"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
