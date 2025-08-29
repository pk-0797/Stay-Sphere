import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem("id"); // ✅ Get userId from localStorage

  useEffect(() => {
    if (userId) {
      axios
        .get(`/user/wishlist/${userId}`)
        .then((response) => setWishlist(response.data.data))
        .catch((error) => console.error("Error fetching wishlist:", error));
    }
  }, [userId]); // ✅ Ensure useEffect only runs when userId is available

  const removeFromWishlist = async (propertyId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This property will be removed from your wishlist.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.post("/user/wishlist/remove", {
            userId,
            propertyId,
          });
          setWishlist(res.data.data); // ✅ Update UI with latest data

          Swal.fire("Removed!", "The property has been removed.", "success");
        } catch (error) {
          console.error("Error removing from wishlist:", error);
          Swal.fire("Error!", "Something went wrong. Try again.", "error");
        }
      }
    });
  };

  const handleBookNow = (propertyId) => {
    navigate(`/user/booking/addbooking?propertyId=${propertyId}`);
  };

  return (
    <div>
      <h2 className="text-center mt-2 mb-3 text-primary font-weight-bold">
        My Wishlist
      </h2>

      {wishlist.length > 0 ? (
        <div
          className="wishlist-container d-flex flex-column flex-md-row m-4 p-4 border-1"
          style={{ overflowX: "auto", gap: "1rem" }}
        >
          {wishlist.map((property) => (
            <div
              className="home-card position-relative flex-shrink-0"
              key={property._id}
              style={{ width: "280px" }}
            >
              <div className="image-container">
                <img
                  src={property.propertyURL || "/default-image.jpg"}
                  alt={property.title}
                  className="img-fluid rounded"
                  style={{ height: "200px", objectFit: "cover", width: "100%" }}
                />
              </div>

              <div className="p-2 text-center">
                <span className="home-card-link d-block fw-bold">
                  {property.title}
                </span>
                <p className="home-card-details mb-2">
                  &#8377; {property.totalPrice}/-
                </p>

                <button
                  className="btn btn-color w-100 mb-2"
                  id="log-btn"
                  onClick={() => handleBookNow(property._id)}
                >
                  Book Now
                </button>

                <button
                  className="btn btn-danger w-100 mb-2"
                  onClick={() => removeFromWishlist(property._id)}
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">
          Your wishlist is empty. Start adding properties!
        </p>
      )}
    </div>
  );
};
