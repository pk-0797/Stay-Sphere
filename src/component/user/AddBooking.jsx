import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const AddBooking = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const propertyId = new URLSearchParams(location.search).get("propertyId");

  const [propertyDetails, setPropertyDetails] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [remainingRooms, setRemainingRooms] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/property/gettotalprice/${propertyId}`);
        if (res.status === 200) {
          setPropertyDetails(res.data);
          setValue("totalPrice", 0);
        }
      } catch (err) {
        console.error("Error fetching property:", err);
      }
    };
    if (propertyId) fetchProperty();
  }, [propertyId, setValue]);

  const calculatePriceAndValidate = async (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (outDate <= inDate) {
      Swal.fire({
        icon: "error",
        title: "Invalid Dates",
        text: "Check-Out must be after Check-In!",
      });
      setTotalPrice(0);
      setValue("totalPrice", 0);
      setRemainingRooms(null);
      return;
    }

    try {
      const res = await axios.post("/booking/check-availability", {
        propertyId,
        checkIn,
        checkOut,
      });
      const { available, overlappingCount } = res.data;
      const isHotel = propertyDetails.propertyType?.toLowerCase() === "hotel";
      const rooms = propertyDetails.availableRooms || 0;

      if (isHotel) {
        const remaining = rooms - overlappingCount;
        setRemainingRooms(remaining);

        if (remaining <= 0) {
          Swal.fire({
            icon: "warning",
            title: "Fully Booked",
            text: `All ${rooms} rooms are booked for these dates.`,
          });
          setTotalPrice(0);
          setValue("totalPrice", 0);
          return;
        }
      } else {
        setRemainingRooms(null);
        if (!available) {
          Swal.fire({
            icon: "warning",
            title: "Unavailable",
            text: "This property is booked for the selected dates.",
          });
          setTotalPrice(0);
          setValue("totalPrice", 0);
          return;
        }
      }

      const days = (outDate - inDate) / (1000 * 3600 * 24);
      const price = days * (propertyDetails.totalPrice || 0);
      setTotalPrice(price);
      setValue("totalPrice", price);
    } catch (err) {
      console.error("Error validating dates:", err);
      setRemainingRooms(null);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not check availability.",
      });
    }
  };

  const onSubmit = async (data) => {
    if (loading) return;
    await calculatePriceAndValidate(data.checkIn, data.checkOut);
    if (totalPrice <= 0) return;

    setLoading(true);
    try {
      await axios.post("/booking/addbooking/", {
        ...data,
        totalPrice,
        guestId: localStorage.getItem("id"),
        propertyId,
        status: "Pending",
      });
      Swal.fire({
        icon: "success",
        title: "Booked!",
        text: "Your booking request has been sent. Please check your email and notifications for the latest updates.",
      }).then(() => {
        navigate("/user/home");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Booking failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isHotel = propertyDetails.propertyType?.toLowerCase() === "hotel";

  return (
    <div className="container mt-4 mx-auto max-w-md">
      <div
        className={`alert ${isHotel ? "alert-info" : "alert-warning"}`}
        role="alert"
      >
        {isHotel
          ? "Note: Booking a hotel reserves a single room for your selected dates."
          : "Note: Booking an apartment, villa, or house reserves the entire property."}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 ">
        <div className="mb-3">
          <label htmlFor="checkIn" className="form-label">
            Check-In Date
          </label>
          <input
            type="date"
            id="checkIn"
            className="form-control"
            {...register("checkIn", { required: true })}
            onChange={(e) =>
              calculatePriceAndValidate(
                e.target.value,
                document.getElementById("checkOut").value
              )
            }
          />
          {errors.checkIn && <small className="text-danger">Required</small>}
        </div>

        <div className="mb-3">
          <label htmlFor="checkOut" className="form-label">
            Check-Out Date
          </label>
          <input
            type="date"
            id="checkOut"
            className="form-control"
            {...register("checkOut", { required: true })}
            onChange={(e) =>
              calculatePriceAndValidate(
                document.getElementById("checkIn").value,
                e.target.value
              )
            }
          />
          {errors.checkOut && <small className="text-danger">Required</small>}
        </div>

        {isHotel && remainingRooms !== null && (
          <div className="alert alert-secondary">
            {remainingRooms > 0
              ? `${remainingRooms} room(s) available for the selected dates.`
              : "No rooms available for the selected dates."}
          </div>
        )}

        <div className="mb-4">
          <label className="form-label">Total Price</label>
          <p className="form-control-plaintext fw-bold text-success">
            ₹{totalPrice}/-
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};
