import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

export const ViewMyProperty = () => {
  const navigate = useNavigate();
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
          setProperties(properties.filter((p) => p._id !== id));

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

  const handleUpdatePrice = (property) => {
    navigate(`/host/updateproperty/${property._id}`, { state: { property } });
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4 text-uppercase fw-bold">
        My Registered Properties
      </h2>

      {/* MOBILE VIEW → Cards */}
      <div className="d-block d-md-none">
        {properties.length === 0 ? (
          <p className="text-center text-muted">No properties found</p>
        ) : (
          <div className="row">
            {properties.map((property) => {
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
                <div key={property._id} className="col-12 mb-4">
                  <div className="card shadow-sm border-1 h-100">
                    <img
                      src={property?.propertyURL || "/default.jpg"}
                      alt={property.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{property.title}</h5>
                      <p className="text-muted">{property.address}</p>
                      <ul className="list-unstyled small flex-grow-1">
                        <li>
                          <strong>Type:</strong> {property.propertyType}
                        </li>
                        <li>
                          <strong>Amenities:</strong>{" "}
                          {property.amenities?.join(", ") || "N/A"}
                        </li>
                        <li>
                          <strong>Available Rooms:</strong>{" "}
                          {property.availableRooms}
                        </li>
                        <li>
                          <strong>Price:</strong>{" "}
                          <span className="text-success fw-bold">
                            ₹{property.totalPrice}/-
                          </span>
                        </li>
                        <li>
                          <strong>Rating:</strong> {averageRating} ⭐ (
                          {propertyRatings.length} reviews)
                        </li>
                      </ul>

                      <div className="d-flex flex-column gap-2 mt-3">
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteProperty(property._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUpdatePrice(property)}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DESKTOP VIEW → Table */}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark text-uppercase text-center">
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

            <tbody className="text-center">
              {properties.length > 0 ? (
                properties.map((property) => {
                  const propertyRatings = rating.filter(
                    (r) => String(r.propertyId?._id) === String(property._id)
                  );
                  const averageRating =
                    propertyRatings.length > 0
                      ? (
                          propertyRatings.reduce(
                            (sum, r) => sum + r.rating,
                            0
                          ) / propertyRatings.length
                        ).toFixed(1)
                      : "No Rating";

                  return (
                    <tr key={property._id} className="align-middle">
                      <td>
                        <img
                          src={property?.propertyURL || "default.jpg"}
                          alt="Property"
                          style={{
                            width: "100px",
                            height: "70px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{property.title}</td>
                      <td>{property.address}</td>
                      <td>{property.propertyType}</td>
                      <td>{property.amenities?.join(", ") || "N/A"}</td>
                      <td>{property.availableRooms}</td>
                      <td className="text-success">₹{property.totalPrice}/-</td>
                      <td>
                        {averageRating} ⭐ <br />({propertyRatings.length}{" "}
                        reviews)
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm mb-2"
                          onClick={() => deleteProperty(property._id)}
                        >
                          Delete
                        </button>
                        <br />
                        <button
                          className="btn btn-primary btn-sm"
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
    </div>
  );
};
