import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CommonNavbar } from "./CommonNavbar";

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching property details for ID:", id);
    axios
      .get(`/property/details/${id}`)
      .then((response) => {
        console.log("Property data:", response.data);
        setProperty(response.data);
      })
      .catch((error) => {
        console.error("Error fetching property:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>Loading property details...</p>;
  }

  if (!property) {
    return <p>Property not found.</p>;
  }

  return (
    <>
      <CommonNavbar></CommonNavbar>
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
              <strong>Property Type:</strong> {property.propertyType || "N/A"}
            </li>
            <li>
              <strong>Room Type:</strong> {property.roomType || "N/A"}
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
          </ul>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Book Now
          </button>
        </div>
      </div>
    </>
  );
};
