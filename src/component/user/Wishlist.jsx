import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    try {
      const res = await axios.post("/user/wishlist/remove", {
        userId,
        propertyId,
      });
      setWishlist(res.data.data); // ✅ Update UI with latest data
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleBookNow = (propertyId) => {
    navigate(`/user/booking/addbooking?propertyId=${propertyId}`);
  };

  return (
    <div id="home-margin">
      <h2 className="text-center mt-2 mb-3 text-primary font-weight-bold">
        My Wishlist
      </h2>

      {wishlist.length > 0 ? (
        <div className="home-card-container">
          {wishlist.map((property) => (
            <div className="home-card position-relative" key={property._id}>
              <div className="image-container">
                <img
                  src={property.propertyURL || "/default-image.jpg"}
                  alt={property.title}
                  height="220px"
                  width="223px"
                />

                {/* Wishlist Icon - Bottom Right of Image */}
                <span
                  className="wishlist-icon wishlist-active"
                  onClick={() => removeFromWishlist(property._id)}
                  title="Remove from Wishlist"
                >
                  ❤️
                </span>
              </div>

              <span className="home-card-link">{property.title}</span>
              <p className="home-card-details">
                &#8377; {property.totalPrice}/-
              </p>

              <button
                className="btn btn-color px-5 mb-3 w-100"
                id="log-btn"
                onClick={() => handleBookNow(property._id)}
              >
                Book Now
              </button>
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
