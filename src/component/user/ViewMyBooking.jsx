import axios from "axios";
import React, { useEffect, useState } from "react";

export const ViewMyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState({});
  const userId = localStorage.getItem("id");

  const getAllMyBookings = async () => {
    try {
      const res = await axios.get(`/booking/getbookingsbyuserid/${userId}`);

      const sortedBookings = [...res.data.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Newest first
      );

      setBookings(sortedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const getPropertyByBookingId = async (bookingId) => {
    try {
      const res = await axios.get(`/booking/getpropertyby/${bookingId}`);
      setProperties((prev) => ({ ...prev, [bookingId]: res.data.data }));
    } catch (err) {
      console.error("Error fetching property:", err);
    }
  };

  useEffect(() => {
    getAllMyBookings();
  }, []);

  useEffect(() => {
    bookings.forEach((booking) => {
      if (!properties[booking._id]) {
        getPropertyByBookingId(booking._id);
      }
    });
  }, [bookings]);

  return (
    <div className="container">
      <h2 className="text-center mb-3 text-dark fw-bold">My Bookings</h2>

      {/* ✅ Desktop: Table */}
      <div className="table-responsive shadow-sm p-4 mb-5 bg-white rounded d-none d-md-block">
        <table className="table table-bordered table-hover text-center">
          <thead className="bg-dark table-info text-white">
            <tr>
              <th className="p-3">No.</th>
              <th className="p-3">Property Title</th>
              <th className="p-3">Property Address</th>
              <th className="p-3">Property Type</th>
              <th className="p-3">Booking Date</th>
              <th className="p-3">Booking Time</th>
              <th className="p-3">Total Price</th>
              <th className="p-3">Booking Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={index} className="align-middle">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    {properties[booking._id]?.title || "Loading..."}
                  </td>
                  <td className="p-3">
                    {properties[booking._id]?.address || "Loading..."}
                  </td>
                  <td className="p-3">
                    {properties[booking._id]?.propertyType || "Loading..."}
                  </td>
                  <td className="p-3">
                    {new Date(booking.createdAt).toLocaleDateString("en-GB", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                  <td className="p-3">
                    {new Date(booking.createdAt).toLocaleTimeString("en-GB", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </td>
                  <td className="p-3 fw-bold text-success">
                    ₹{booking.totalPrice || "N/A"}/-
                  </td>
                  <td className="p-3">
                    <span
                      className={`badge ${
                        booking.status === "Pending"
                          ? "bg-warning text-dark"
                          : booking.status === "Confirmed"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-muted p-4">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile: Cards */}
      <div className="d-md-none">
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <div
              key={index}
              className="card shadow-sm mb-3 border-1 rounded-3"
            >
              <div className="card-body">
                <h5 className="card-title text-primary">
                  {properties[booking._id]?.title || "Loading..."}
                </h5><br />
                <p className="card-text mb-1">
                  <strong>Address:</strong>{" "}
                  {properties[booking._id]?.address || "Loading..."}
                </p>
                <p className="card-text mb-1">
                  <strong>Type:</strong>{" "}
                  {properties[booking._id]?.propertyType || "Loading..."}
                </p>
                <p className="card-text mb-1">
                  <strong>Date:</strong>{" "}
                  {new Date(booking.createdAt).toLocaleDateString("en-GB", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
                <p className="card-text mb-1">
                  <strong>Time:</strong>{" "}
                  {new Date(booking.createdAt).toLocaleTimeString("en-GB", {
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
                <p className="card-text mb-1 text-success fw-bold">
                  <strong className="text-dark">Price:</strong> ₹{booking.totalPrice || "N/A"}/-
                </p>
                <span
                  className={`badge ${
                    booking.status === "Pending"
                      ? "bg-warning text-dark"
                      : booking.status === "Confirmed"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted p-4">No bookings found</div>
        )}
      </div>
    </div>
  );
};
