import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export const UpdatePropertyPrice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property || {};
  const [totalPrice, setTotalPrice] = useState(property.totalPrice || "");

  const handlePriceUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `/property/update-price/${property._id}`,
        { totalPrice }
      );

      if (response.status === 200) {
        toast.success("Price updated successfully!");

        setTimeout(() => {
          navigate("/host/myproperty");
        }, 2000);
      }
    } catch (error) {
      console.error(
        "Error updating price:",
        error.response?.data || error.message
      );
      toast.error("Failed to update price.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer autoClose={1500} />
      <h2 className="text-center">Update Property Price</h2>

      <form onSubmit={handlePriceUpdate}>
        <div className="mb-3">
          <label className="form-label">Total Price (Per Day)</label>
          <input
            type="number"
            className="form-control"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Update Price
        </button>
      </form>
    </div>
  );
};
