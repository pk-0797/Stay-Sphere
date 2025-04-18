// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useLocation } from "react-router-dom";
// import Swal from "sweetalert2";

// export const AddBooking = () => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const propertyId = queryParams.get("propertyId");

//   const [propertyPricePerDay, setPropertyPricePerDay] = useState(0);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [propertyDetails, setPropertyDetails] = useState({}); // full property

//   useEffect(() => {
//     const fetchPropertyDetails = async () => {
//       try {
//         const res = await axios.get(`/property/gettotalprice/${propertyId}`);

//         if (res.status === 200) {
//           const property = res.data;
//           setPropertyPricePerDay(property.totalPrice);
//           setPropertyDetails(property);
//           setValue("totalPrice", 0);
//         }
//       } catch (err) {
//         console.error("Error fetching property details:", err);
//       }
//     };

//     if (propertyId) fetchPropertyDetails();
//   }, [propertyId, setValue]);

//   const checkAvailability = async (checkIn, checkOut) => {
//     if (!checkIn || !checkOut) return false;

//     try {
//       const res = await axios.post("/booking/check-availability", {
//         propertyId,
//         checkIn,
//         checkOut,
//       });

//       const { available, message, overlappingCount } = res.data;
//       const isHotel = propertyDetails.propertyType?.toLowerCase() === "hotel";
//       const availableRooms = propertyDetails.availableRooms || 0;

//       if (isHotel) {
//         if (overlappingCount >= availableRooms) {
//           await Swal.fire({
//             icon: "warning",
//             title: "Fully Booked",
//             text: `All ${availableRooms} room(s) are already booked for the selected dates.`,
//           });
//           setTotalPrice(0);
//           setValue("totalPrice", 0);
//           return false;
//         }
//       } else {
//         if (!available) {
//           await Swal.fire({
//             icon: "warning",
//             title: "Unavailable",
//             text: message || "This property is already booked for those dates.",
//           });
//           setTotalPrice(0);
//           setValue("totalPrice", 0);
//           return false;
//         }
//       }

//       return true;
//     } catch (err) {
//       console.error("Availability check failed:", err);
//       await Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to check availability. Please try again.",
//       });
//       return false;
//     }
//   };

//   const calculateTotalPrice = async (checkIn, checkOut) => {
//     if (!checkIn || !checkOut) return;

//     const checkInDate = new Date(checkIn);
//     const checkOutDate = new Date(checkOut);

//     if (checkOutDate <= checkInDate) {
//       await Swal.fire({
//         icon: "error",
//         title: "Invalid Date Selection",
//         text: "Check-Out date must be after Check-In date!",
//       });
//       setTotalPrice(0);
//       setValue("totalPrice", 0);
//       return;
//     }

//     const isAvailable = await checkAvailability(checkIn, checkOut);
//     if (!isAvailable) return;

//     const nights = (checkOutDate - checkInDate) / (1000 * 3600 * 24);
//     const total = nights * propertyPricePerDay;
//     setTotalPrice(total);
//     setValue("totalPrice", total);
//   };

//   const submitHandler = async (data) => {
//     if (loading) return;

//     const checkInDate = new Date(data.checkIn);
//     const checkOutDate = new Date(data.checkOut);

//     if (checkOutDate <= checkInDate) {
//       await Swal.fire({
//         icon: "error",
//         title: "Invalid Date Selection",
//         text: "Check-Out date must be after Check-In date!",
//       });
//       return;
//     }

//     const available = await checkAvailability(data.checkIn, data.checkOut);
//     if (!available) return;

//     try {
//       setLoading(true);
//       data.totalPrice = totalPrice;
//       data.guestId = localStorage.getItem("id");
//       data.propertyId = propertyId;
//       data.status = "Pending";

//       const res = await axios.post("/booking/addbooking/", data);
//       if (res.status === 201) {
//         await Swal.fire({
//           icon: "success",
//           title: "Booking Sent",
//           text: "Your booking request has been sent to the host.",
//         });
//       }
//     } catch (error) {
//       await Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text:
//           error.response?.data?.message || "Failed to send booking request.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-2 card p-4 mx-auto max-w-md">
//       <h2 className="mb-4 text-center">Booking Details</h2>

//       <form onSubmit={handleSubmit(submitHandler)}>
//         <div className="mb-3">
//           <label htmlFor="checkIn" className="form-label">
//             Check-In Date
//           </label>
//           <input
//             type="date"
//             id="checkIn"
//             className="form-control"
//             {...register("checkIn", { required: "Check-In date is required." })}
//             onChange={async (e) => {
//               const checkOut = document.getElementById("checkOut").value;
//               await calculateTotalPrice(e.target.value, checkOut);
//             }}
//           />
//           <p className="text-danger text-center">{errors.checkIn?.message}</p>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="checkOut" className="form-label">
//             Check-Out Date
//           </label>
//           <input
//             type="date"
//             id="checkOut"
//             className="form-control"
//             {...register("checkOut", {
//               required: "Check-Out date is required.",
//             })}
//             onChange={async (e) => {
//               const checkIn = document.getElementById("checkIn").value;
//               await calculateTotalPrice(checkIn, e.target.value);
//             }}
//           />
//           <p className="text-danger text-center">{errors.checkOut?.message}</p>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="totalPrice" className="form-label">
//             Total Price
//           </label>
//           <input
//             type="number"
//             id="totalPrice"
//             className="form-control"
//             value={totalPrice}
//             disabled
//             {...register("totalPrice")}
//           />
//         </div>

//         <button
//           type="submit"
//           className="btn btn-color px-5 mb-5 w-100"
//           id="log-btn"
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Add Booking"}
//         </button>
//       </form>
//     </div>
//   );
// };


// Hotel 

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useLocation, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// export const AddBooking = () => {
//   const { register, handleSubmit, setValue, formState: { errors } } = useForm();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const propertyId = new URLSearchParams(location.search).get("propertyId");

//   const [propertyDetails, setPropertyDetails] = useState({});
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Fetch property details to get type and availability
//     const fetchProperty = async () => {
//       try {
//         const res = await axios.get(`/property/gettotalprice/${propertyId}`);
//         if (res.status === 200) {
//           setPropertyDetails(res.data);
//           setValue("totalPrice", 0);
//         }
//       } catch (err) {
//         console.error("Error fetching property:", err);
//       }
//     };
//     if (propertyId) fetchProperty();
//   }, [propertyId, setValue]);

//   // Check availability and calculate price based on dates
//   const calculatePriceAndValidate = async (checkIn, checkOut) => {
//     if (!checkIn || !checkOut) return;
//     const inDate = new Date(checkIn);
//     const outDate = new Date(checkOut);
//     if (outDate <= inDate) {
//       Swal.fire({ icon: "error", title: "Invalid Dates", text: "Check-Out must be after Check-In!" });
//       setTotalPrice(0);
//       setValue("totalPrice", 0);
//       return;
//     }

//     try {
//       const res = await axios.post("/booking/check-availability", { propertyId, checkIn, checkOut });
//       const { available, overlappingCount } = res.data;
//       const isHotel = propertyDetails.propertyType?.toLowerCase() === "hotel";
//       const rooms = propertyDetails.availableRooms || 0;

//       if (isHotel && overlappingCount >= rooms) {
//         Swal.fire({ icon: "warning", title: "Fully Booked", text: `All ${rooms} rooms are booked for these dates.` });
//         setTotalPrice(0);
//         setValue("totalPrice", 0);
//         return;
//       }
//       if (!isHotel && !available) {
//         Swal.fire({ icon: "warning", title: "Unavailable", text: "This property is booked for the selected dates." });
//         setTotalPrice(0);
//         setValue("totalPrice", 0);
//         return;
//       }

//       // Calculate price
//       const days = (outDate - inDate) / (1000 * 3600 * 24);
//       const price = days * (propertyDetails.totalPrice || 0);
//       setTotalPrice(price);
//       setValue("totalPrice", price);
//     } catch (err) {
//       console.error("Error validating dates:", err);
//       Swal.fire({ icon: "error", title: "Error", text: "Could not check availability." });
//     }
//   };

//   const onSubmit = async (data) => {
//     if (loading) return;
//     await calculatePriceAndValidate(data.checkIn, data.checkOut);
//     if (totalPrice <= 0) return;

//     setLoading(true);
//     try {
//       await axios.post("/booking/addbooking/", {
//         ...data,
//         totalPrice,
//         guestId: localStorage.getItem("id"),
//         propertyId,
//         status: "Pending"
//       });
//       Swal.fire({
//         icon: "success",
//         title: "Booked!",
//         text: "Your booking request has been sent. Please check your email and notifications for the latest updates."
//       }).then(() => {
//         navigate('/user/home');
//       });
//     } catch (err) {
//       Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Booking failed." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isHotel = propertyDetails.propertyType?.toLowerCase() === "hotel";

//   return (
//     <div className="container mt-4 mx-auto max-w-md">
//       {/* Note about allocation */}
//       <div className={`alert ${isHotel ? 'alert-info' : 'alert-warning'}`} role="alert">
//         {isHotel
//           ? 'Note: Booking a hotel reserves a single room for your selected dates.'
//           : 'Note: Booking an apartment, villa, or house reserves the entire property.'
//         }
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow">
//         <div className="mb-3">
//           <label htmlFor="checkIn" className="form-label">Check-In Date</label>
//           <input
//             type="date"
//             id="checkIn"
//             className="form-control"
//             {...register('checkIn', { required: true })}
//             onChange={e => calculatePriceAndValidate(e.target.value, document.getElementById('checkOut').value)}
//           />
//           {errors.checkIn && <small className="text-danger">Required</small>}
//         </div>

//         <div className="mb-3">
//           <label htmlFor="checkOut" className="form-label">Check-Out Date</label>
//           <input
//             type="date"
//             id="checkOut"
//             className="form-control"
//             {...register('checkOut', { required: true })}
//             onChange={e => calculatePriceAndValidate(document.getElementById('checkIn').value, e.target.value)}
//           />
//           {errors.checkOut && <small className="text-danger">Required</small>}
//         </div>

//         <div className="mb-4">
//           <label className="form-label">Total Price</label>
//           <p className="form-control-plaintext fw-bold text-success">₹{totalPrice}</p>
//         </div>

//         <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//           {loading ? 'Processing...' : 'Confirm Booking'}
//         </button>
//       </form>
//     </div>
//   );
// };


// Available Rooms
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const AddBooking = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
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
        text: "Check-Out must be after Check-In!"
      });
      setTotalPrice(0);
      setValue("totalPrice", 0);
      setRemainingRooms(null);
      return;
    }

    try {
      const res = await axios.post("/booking/check-availability", { propertyId, checkIn, checkOut });
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
            text: `All ${rooms} rooms are booked for these dates.`
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
            text: "This property is booked for the selected dates."
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
        text: "Could not check availability."
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
        status: "Pending"
      });
      Swal.fire({
        icon: "success",
        title: "Booked!",
        text: "Your booking request has been sent. Please check your email and notifications for the latest updates."
      }).then(() => {
        navigate('/user/home');
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Booking failed."
      });
    } finally {
      setLoading(false);
    }
  };

  const isHotel = propertyDetails.propertyType?.toLowerCase() === "hotel";

  return (
    <div className="container mt-4 mx-auto max-w-md">
      <div className={`alert ${isHotel ? 'alert-info' : 'alert-warning'}`} role="alert">
        {isHotel
          ? 'Note: Booking a hotel reserves a single room for your selected dates.'
          : 'Note: Booking an apartment, villa, or house reserves the entire property.'
        }
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow">
        <div className="mb-3">
          <label htmlFor="checkIn" className="form-label">Check-In Date</label>
          <input
            type="date"
            id="checkIn"
            className="form-control"
            {...register('checkIn', { required: true })}
            onChange={e => calculatePriceAndValidate(e.target.value, document.getElementById('checkOut').value)}
          />
          {errors.checkIn && <small className="text-danger">Required</small>}
        </div>

        <div className="mb-3">
          <label htmlFor="checkOut" className="form-label">Check-Out Date</label>
          <input
            type="date"
            id="checkOut"
            className="form-control"
            {...register('checkOut', { required: true })}
            onChange={e => calculatePriceAndValidate(document.getElementById('checkIn').value, e.target.value)}
          />
          {errors.checkOut && <small className="text-danger">Required</small>}
        </div>

        {isHotel && remainingRooms !== null && (
          <div className="alert alert-secondary">
            {remainingRooms > 0
              ? `${remainingRooms} room(s) available for the selected dates.`
              : 'No rooms available for the selected dates.'}
          </div>
        )}

        <div className="mb-4">
          <label className="form-label">Total Price</label>
          <p className="form-control-plaintext fw-bold text-success">₹{totalPrice}/-</p>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};
