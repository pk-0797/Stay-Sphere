import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const MessageComponent = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState({});
  const [hosts, setHosts] = useState({}); // Store host details
  const userId = localStorage.getItem("id");

  // Fetch all bookings for the logged-in user
  const getAllMyBookings = async () => {
    try {
      const res = await axios.get(`/booking/getbookingsbyuserid/${userId}`);
      const sortedBookings = res.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBookings(sortedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Fetch property details
  const getPropertyByBookingId = async (bookingId) => {
    try {
      const res = await axios.get(`/booking/getpropertyby/${bookingId}`);
      setProperties((prev) => ({ ...prev, [bookingId]: res.data.data }));
      getHostByPropertyId(res.data.data._id); // Fetch host details
    } catch (err) {
      console.error("Error fetching property:", err);
    }
  };

  // Fetch host details using propertyId
  const getHostByPropertyId = async (propertyId) => {
    try {
      const res = await axios.get(`/booking/gethostbypropertyid/${propertyId}`);
      setHosts((prev) => ({ ...prev, [propertyId]: res.data.data }));
    } catch (err) {
      console.error("Error fetching host:", err);
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
      <h2 className="text-center mb-3 text-primary font-weight-bold">
        Booking Messages
      </h2>
      <div className="table-responsive shadow-sm p-4 mb-5 bg-white rounded">
        <table className="table table-bordered table-hover text-center">
          <thead className="bg-dark table-dark text-white">
            <tr>
              <th className="p-3">No.</th>
              <th className="p-3">Booking ID</th>
              <th className="p-3">Property Title</th>
              <th className="p-3">Host Name</th>
              <th className="p-3">Host Email</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={index} className="align-middle">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{booking._id}</td>{" "}
                  {/* MongoDB Booking ID */}
                  <td className="p-3">
                    {properties[booking._id]?.title || "Loading..."}
                  </td>
                  <td className="p-3">
                    {hosts[properties[booking._id]?._id]?.fullName ||
                      "Loading..."}
                  </td>
                  <td className="p-3">
                    {hosts[properties[booking._id]?._id]?.email || "Loading..."}
                  </td>
                  <td className="p-3">
                    {hosts[properties[booking._id]?._id]?.["_id"] ? (
                      <Link
                        to={`/user/contact-host/${booking._id}/${
                          hosts[properties[booking._id]?._id]["_id"]
                        }`}
                      >
                        <button className="btn btn-outline-primary btn-sm px-4 py-2">
                          Contact Host
                        </button>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="btn btn-secondary btn-sm px-4 py-2"
                      >
                        Host Not Available
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-muted p-4">
                  No messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
