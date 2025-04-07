import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Review = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState({});
  const userId = localStorage.getItem("id");

  const getAllMyBookings = async () => {
    try {
      const res = await axios.get(`/booking/getbookingsbyuserid/${userId}`);

      const sortedBookings = [...res.data.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Newest first
      );

      console.log("Sorted Bookings:", sortedBookings); // Debugging log
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
    <div className="container mt-3">
      <div className="table-responsive shadow-sm p-4 mb-5 bg-white rounded">
        <table className="table table-bordered table-hover text-center">
          <thead className="bg-dark  table-info text-white ">
            <tr>
              <th className="p-3">No.</th>
              <th className="p-3">Property Title</th>
              <th className="p-3">Property Address</th>
              <th className="p-3">Total Price</th>
              <th className="p-3">Review</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={index} className="align-middle">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    {properties[booking._id]?.title || (
                      <span className="text-secondary">Loading...</span>
                    )}
                  </td>
                  <td className="p-3">
                    {properties[booking._id]?.address || (
                      <span className="text-secondary">Loading...</span>
                    )}
                  </td>
                  <td className="p-3 font-weight-bold text-success">
                    &#8377;{booking.totalPrice || "N/A"}/-
                  </td>
                  <td className="p-3">
                    {booking.status === "Confirmed" ? (
                      <Link
                        to={`/user/bookingreview/reviewform/${
                          properties[booking._id]?._id
                        }/${booking._id}`}
                      >
                        <button className="btn btn-outline-primary btn-sm px-4 py-2">
                          Review
                        </button>
                      </Link>
                    ) : booking.status === "Cancelled" ? (
                      <span className="text-danger">Booking Cancelled</span>
                    ) : (
                      <span className="text-warning">Pending Confirmation</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-muted p-4">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
