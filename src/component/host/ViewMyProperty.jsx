import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

export const ViewMyProperty = () => {
  const navigate = useNavigate();

  const handleUpdatePrice = (property) => {
    navigate(`/host/updateproperty/${property._id}`, { state: { property } });
  };
  const [properties, setProperties] = useState([]);
  const [rating, setRating] = useState([]);

  useEffect(() => {
    getAllMyProperties();
    getAllRatings();
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

  const getAllRatings = async () => {
    try {
      const res = await axios.get("/review/getallreviews");
      setRating(res.data.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const deleteProperty = async (id) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/property/delete/${id}`);
          setProperties(properties.filter((property) => property._id !== id));

          MySwal.fire({
            title: "Deleted!",
            text: "Your property has been removed.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting property:", error);
          MySwal.fire({
            title: "Error!",
            text: "Failed to delete the property. Please try again.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="property-container">
      <h2 className="property-header text-uppercase">
        My Registered Properties
      </h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover property-table">
          <thead className="table-dark text-uppercase">
            <tr>
              <th>Image</th>
              <th>Property Name</th>
              <th>Address</th>
              <th>Type</th>
              <th>Amenities</th>
              <th>Available Rooms</th>
              <th>Total Price</th>
              <th>Ratings From Users</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {properties.length > 0 ? (
              properties.map((property) => {
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

                return (
                  <tr key={property._id} className="align-middle">
                    <td>
                      <img
                        className="property-image"
                        src={property?.propertyURL || "default.jpg"}
                        alt="Property"
                      />
                    </td>
                    <td>{property.title}</td>
                    <td>{property.address}</td>
                    <td>{property.propertyType}</td>
                    <td>{property.amenities?.join(", ") || "N/A"}</td>

                    <td>{property.availableRooms}</td>

                    <td className="text-success">
                      &#8377;{property.totalPrice}/-
                    </td>
                    <td>
                      {averageRating} ⭐ <br />({propertyRatings.length}{" "}
                      reviews)
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteProperty(property._id)}
                      >
                        Delete
                      </button>
                      <br />
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => handleUpdatePrice(property)}
                      >
                        Update
                      </button>
                    </td>
                    
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
