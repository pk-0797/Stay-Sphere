import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const UpdateOrCancelBooking = () => {
  const [bookings, setBookings] = useState([]);
  const hostId = localStorage.getItem("id");
  const [properties, setProperties] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    totalPrice: "",
  });

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

  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setFormData({
      checkIn: booking.checkIn.split("T")[0],
      checkOut: booking.checkOut.split("T")[0],
      totalPrice: booking.totalPrice,
    });
    new bootstrap.Modal(document.getElementById("editBookingModal")).show();
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateBooking = async () => {
    try {
      await axios.put(`/booking/update/${editingBooking._id}`, {
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        totalPrice: formData.totalPrice,
      });

      Swal.fire("Updated!", "Booking has been updated.", "success");
      document.getElementById("closeModalBtn").click();
      window.location.reload();
    } catch (err) {
      Swal.fire("Error", "Failed to update booking.", "error");
    }
  };

  return (
    <div className="container ">
      <h2 className="text-center mb-3 text-dark fw-bold">
        Guest Booking Requests
      </h2>

      {/* Desktop View (Table) */}
      <div className="shadow-sm p-3 mb-5 bg-white rounded d-none d-lg-block">
        <table className="table table-bordered table-hover text-center align-middle w-100">
          <thead className="table-dark text-uppercase">
            <tr>
              <th>#</th>
              <th>Guest Details</th> {/* ✅ merged guest details */}
              <th>Property Title</th>
              <th>Booking Id</th>
              <th>Stay Dates</th> {/* ✅ merged checkin + checkout */}
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id} className="table-light">
                <td className="fw-bold">{index + 1}</td>

                {/* ✅ merged guest details */}
                <td className="text-start">
                  <div>
                    <strong>{booking.guestId?.fullName || "Unknown"}</strong>
                  </div>
                  <div>{booking.guestId?.email || "Unknown"}</div>
                  <div>{booking.guestId?.phoneNo || "Unknown"}</div>
                </td>

                <td>
                  {properties.find((prop) => prop._id === booking.propertyId)
                    ?.title || "N/A"}
                </td>
                <td>{booking._id}</td>

                {/* ✅ merged stay dates */}
                <td>
                  {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </td>

                <td className="p-3 fw-bold text-success">
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
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    {booking.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleConfirm(booking._id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => openEditModal(booking)}
                        >
                          Edit
                        </button>
                      </>
                    )}

                    {booking.status === "Confirmed" && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => openEditModal(booking)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="d-block d-lg-none">
        {bookings.map((booking, index) => (
          <div key={booking._id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">
                {properties.find((prop) => prop._id === booking.propertyId)
                  ?.title || "N/A"}
              </h5>
              <br />
              <p>
                <b>Booking Id:</b> {booking._id}
              </p>
              <p>
                <b>Guest:</b> {booking.guestId?.fullName || "Unknown"}
              </p>
              <p>
                <b>Email:</b> {booking.guestId?.email || "Unknown"}
              </p>
              <p>
                <b>Phone:</b> {booking.guestId?.phoneNo || "Unknown"}
              </p>
              <p>
                <b>Check-in-date:</b>{" "}
                {new Date(booking.checkIn).toLocaleDateString()}
              </p>
              <p>
                <b>Check-out-date:</b>{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>

              <p className="fw-bold">
                <span className="text-dark">
                  <b>Total Price:</b>
                </span>{" "}
                <span className="text-success">
                  ₹{booking.totalPrice || "N/A"}/-
                </span>
              </p>
              <span
                className={`badge mb-2 ${
                  booking.status === "Pending"
                    ? "bg-warning text-dark"
                    : booking.status === "Confirmed"
                    ? "bg-success text-white"
                    : "bg-danger text-white"
                }`}
              >
                Status : {booking.status}
              </span>

              <div className="d-flex flex-wrap gap-2 mt-2">
                {booking.status === "Pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleConfirm(booking._id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(booking._id)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => openEditModal(booking)}
                    >
                      Edit
                    </button>
                  </>
                )}

                {booking.status === "Confirmed" && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => openEditModal(booking)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <div
        className="modal fade"
        id="editBookingModal"
        tabIndex="-1"
        aria-labelledby="editBookingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title" id="editBookingModalLabel">
                Edit Booking
              </h5>
              <button
                id="closeModalBtn"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Check-In Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Check-Out Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleFormChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              {editingBooking?.status === "Confirmed" && (
                <button
                  className="btn btn-danger w-100 me-2"
                  onClick={() => handleCancel(editingBooking._id)}
                >
                  Cancel Booking
                </button>
              )}
              <button
                onClick={handleUpdateBooking}
                className="btn btn-primary w-100"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
