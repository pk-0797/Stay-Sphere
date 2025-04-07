import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";

export const AddBooking = () => {
  const {
    register,
    handleSubmit,
    setValue, // Used to set default values
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get("propertyId"); 
  const [propertyPricePerDay, setPropertyPricePerDay] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch property details when component mounts
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(
          `/property/gettotalprice/${propertyId}`
        );
        if (response.status === 200) {
          const pricePerDay = response.data.totalPrice; // Assuming totalPrice is per day
          setPropertyPricePerDay(pricePerDay);
          setValue("totalPrice", 0); // Initially set price to 0
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId, setValue]);

  const calculateTotalPrice = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      toast.error("Check-Out date must be after Check-In date!");
      setTotalPrice(0);
      setValue("totalPrice", 0);
      return;
    }

    const nights = (checkOutDate - checkInDate) / (1000 * 3600 * 24);
    const total = nights * propertyPricePerDay;
    setTotalPrice(total);
    setValue("totalPrice", total);
  };

  const submitHandler = async (data) => {
    if (loading) return;

    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    if (checkOutDate <= checkInDate) {
      toast.error(
        "Invalid dates! Please select a valid Check-In and Check-Out date."
      );
      return;
    }

    // Ensure total price is calculated before submitting
    data.totalPrice = totalPrice;

    try {
      setLoading(true);
      const userId = localStorage.getItem("id");
      data.guestId = userId;
      data.propertyId = propertyId;
      data.status = "Pending";

      const res = await axios.post("/booking/addbooking/", data);
      if (res.status === 201) {
        toast.success("Booking request sent to host!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send booking request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-2 card p-4 mx-auto max-w-md">
      <h2 className="mb-4 text-center">Booking Details</h2>
      <ToastContainer position="top-center" autoClose={1500} />

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="mb-3 ">
          <label htmlFor="checkIn" className="form-label">
            Check-In Date
          </label>
          <input
            type="date"
            id="checkIn"
            className="form-control"
            {...register("checkIn", { required: "Check-In date is required." })}
            onChange={(e) => {
              const checkOut = document.getElementById("checkOut").value;
              calculateTotalPrice(e.target.value, checkOut);
            }}
          />
          <p style={{ textAlign: "center", color: "red" }}>
            {errors.checkIn?.message}
          </p>
        </div>

        <div className="mb-3">
          <label htmlFor="checkOut" className="form-label">
            Check-Out Date
          </label>
          <input
            type="date"
            id="checkOut"
            className="form-control"
            {...register("checkOut", {
              required: "Check-Out date is required.",
            })}
            onChange={(e) => {
              const checkIn = document.getElementById("checkIn").value;
              calculateTotalPrice(checkIn, e.target.value);
            }}
          />
          <p style={{ textAlign: "center", color: "red" }}>
            {errors.checkOut?.message}
          </p>
        </div>

        <div className="mb-3">
          <label htmlFor="totalPrice" className="form-label">
            Total Price (Per Day)
          </label>
          <input
            type="number"
            id="totalPrice"
            className="form-control"
            value={totalPrice}
            disabled
            {...register("totalPrice")}
          />
        </div>

        <button
          type="submit"
          className="btn btn-color px-5 mb-5 w-100"
          id="log-btn"
          disabled={loading} // Disable button if loading
        >
          {loading ? "Processing..." : "Add Booking"}
        </button>
      </form>
    </div>
  );
};
