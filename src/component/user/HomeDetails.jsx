import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export const HomeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [rating, setRating] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Property Details
  useEffect(() => {
    axios
      .get(`/property/gettotalprice/${id}`)
      .then((response) => {
        setProperty(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching property details:", error);
        setLoading(false);
      });

    fetchRatings();
  }, [id]);

  // Fetch All Ratings
  const fetchRatings = async () => {
    try {
      const res = await axios.get("/review/getallreviews");
      setRating(res.data.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading property details...</div>;
  }

  // Calculate Average Rating
  const propertyRatings = rating.filter(
    (r) => String(r.propertyId?._id) === String(property._id)
  );

  const averageRating =
    propertyRatings.length > 0
      ? (
          propertyRatings.reduce((sum, r) => sum + r.rating, 0) /
          propertyRatings.length
        ).toFixed(1)
      : "No Rating";

  const handleBookNow = () => {
    navigate(`/user/booking/addbooking?propertyId=${property._id}`);
  };

  return (
    <div className="prop-layout">
      {/* Left Column: Image */}
      <div className="prop-image">
        <img src={property.propertyURL || "/default.jpg"} alt="Property" />
      </div>

      {/* Right Column: Details */}
      <div className="prop-details">
        <h3 className="prop-title">{property.title || "No Name"}</h3>
        <p className="prop-location">
          {property.address || "Address Loading..."}
        </p>

        <ul className="prop-info">
          <li>
            <strong>Property Type:</strong> {property.propertyType}
          </li>
          <li>
            <strong>Room Type:</strong> {property.roomType}
          </li>
          <li>
            <strong>Amenities:</strong>{" "}
            {property.amenities?.join(", ") || "N/A"}
          </li>
          <li>
            <strong>Price:</strong>{" "}
            <span className="text-success">
              ₹{property.totalPrice || "N/A"}/-
            </span>
          </li>

          <li>
            <strong>Ratings:</strong> {averageRating} ⭐ (
            {propertyRatings.length} reviews)
          </li>
        </ul>

        <button onClick={handleBookNow} className="btn btn-primary">
          Book Now
        </button>
      </div>
    </div>
  );
};
