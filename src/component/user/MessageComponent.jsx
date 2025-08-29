import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const MessageComponent = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState({});
  const [hosts, setHosts] = useState({});
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
      getHostByPropertyId(res.data.data._id);
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
    <div className="container">
      <h3 className="text-center text-dark fw-bold mb-4">Booking Messages</h3>

      {bookings.length === 0 && (
        <div className="alert alert-info text-center shadow-sm">
          No messages found. Once you book a property, you’ll see host details here.
        </div>
      )}

      {/* ✅ Table for Desktop */}
      <div className="table-responsive d-none d-md-block shadow-sm p-3 bg-white rounded">
        <table className="table table-bordered table-hover text-center mb-0">
          <thead className="table-dark">
            <tr>
              <th>No.</th>
              <th>Booking ID</th>
              <th>Property Title</th>
              <th>Host Name</th>
              <th>Host Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => {
                const property = properties[booking._id];
                const host = hosts[property?._id];

                return (
                  <tr key={index} className="align-middle">
                    <td>{index + 1}</td>
                    <td>{booking._id}</td>
                    <td>{property?.title || "Loading..."}</td>
                    <td>{host?.fullName || "Loading..."}</td>
                    <td>{host?.email || "Loading..."}</td>
                    <td>
                      {host?._id ? (
                        <Link to={`/user/contact-host/${booking._id}/${host._id}`}>
                          <button className="btn btn-outline-primary btn-sm px-3">
                            Contact Host
                          </button>
                        </Link>
                      ) : (
                        <button disabled className="btn btn-secondary btn-sm px-3">
                          Host Not Available
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
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

      {/* ✅ Cards for Mobile */}
      <div className="d-md-none">
        <div className="row">
          {bookings.map((booking, index) => {
            const property = properties[booking._id];
            const host = hosts[property?._id];

            return (
              <div key={index} className="col-12 mb-3">
                <div className="card shadow-sm border-1">
                  <div className="card-body">
                    <h5 className="card-title">{property?.title || "Loading..."}</h5>
                    <p className="mb-1">
                      <strong>Booking ID:</strong> {booking._id}
                    </p>
                    <p className="mb-1">
                      <strong>Host:</strong>{" "}
                      {host?.fullName || <span className="text-muted">Loading...</span>}
                    </p>
                    <p className="mb-2">
                      <strong>Email:</strong>{" "}
                      {host?.email || <span className="text-muted">Loading...</span>}
                    </p>
                    {host?._id ? (
                      <Link to={`/user/contact-host/${booking._id}/${host._id}`}>
                        <button className="btn btn-outline-primary w-100">
                          Contact Host
                        </button>
                      </Link>
                    ) : (
                      <button disabled className="btn btn-secondary w-100">
                        Host Not Available
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
