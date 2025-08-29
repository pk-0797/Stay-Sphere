import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaHeart } from "react-icons/fa";

export const UserHome = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem("id");
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    state: "",
    city: "",
  });

  // Filter properties based on search query
  const filteredProperties = properties.filter((property) => {
    return (
      (property.title || "")
        .toLowerCase()
        .includes(searchQuery.title.toLowerCase()) &&
      (property.stateId?.name || "")
        .toLowerCase()
        .includes(searchQuery.state.toLowerCase()) &&
      (property.cityId?.name || "")
        .toLowerCase()
        .includes(searchQuery.city.toLowerCase())
    );
  });

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }

    const fetchProperties = async () => {
      try {
        const res = await axios.get("/property/getallproperties");
        setProperties(res.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`/user/wishlist/${userId}`);
        setWishlist(res.data.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchProperties();
    if (userId) fetchWishlist();
  }, [userId, navigate]);

  const handleBookNow = (propertyId) => {
    navigate(`/user/booking/addbooking?propertyId=${propertyId}`);
  };

  const addToWishlist = async (property) => {
    try {
      const result = await Swal.fire({
        title: "Add to Wishlist?",
        text: `Do you want to add "${property.title}" to your wishlist?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Add it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const res = await axios.post("/user/wishlist/add", {
          userId,
          propertyId: property._id,
        });
        setWishlist(res.data.data);

        Swal.fire(
          "Added!",
          "The property was added to your wishlist.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      Swal.fire("Error", "Could not add property to wishlist", "error");
    }
  };

  // ✅ Helper: Check if property is already in wishlist
  const isInWishlist = (propertyId) => {
    return wishlist.some((item) => item._id === propertyId);
  };

  return (
    <>
      <div id="home-margin">
        <marquee behavior="" direction="ltr">
          <h1 id="phrase">"Cozy stays for every budget"</h1>
        </marquee>

        {/* Search Filters */}
        <div className="container mt-4 mb-4">
          <div className="d-flex flex-wrap gap-3 justify-content-between">
            <input
              type="text"
              className="form-control search-input"
              style={{ maxWidth: "350px" }}
              placeholder="Search by Title"
              value={searchQuery.title}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, title: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control search-input"
              style={{ maxWidth: "350px" }}
              placeholder="Search by State"
              value={searchQuery.state}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, state: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control search-input"
              style={{ maxWidth: "350px" }}
              placeholder="Search by City"
              value={searchQuery.city}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, city: e.target.value })
              }
            />
          </div>
        </div>

        {/* Property Cards */}
        <div className="home-card-container">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => {
              const alreadyInWishlist = isInWishlist(property._id);

              return (
                <div className="home-card position-relative" key={property._id}>
                  <div className="image-container position-relative">
                    <img
                      src={property.propertyURL || "/default-image.jpg"}
                      alt={property.title}
                    />
                    {alreadyInWishlist && (
                      <FaHeart
                        className="text-danger position-absolute"
                        style={{
                          top: "10px",
                          left: "10px",
                          fontSize: "22px",
                          background: "white",
                          borderRadius: "50%",
                          padding: "5px",
                        }}
                      />
                    )}
                  </div>

                  <span className="home-card-link">{property.title}</span>
                  <p className="home-card-details">
                    &#8377; {property.totalPrice}/-
                  </p>

                  <button
                    className="btn btn-color px-5 mb-2 w-100"
                    id="log-btn"
                    onClick={() => handleBookNow(property._id)}
                  >
                    Book Now
                  </button>

                  {!alreadyInWishlist && (
                    <button
                      className="btn btn-outline-primary px-5 mb-2 w-100"
                      onClick={() => addToWishlist(property)}
                    >
                      Add to Wishlist
                    </button>
                  )}

                  <button
                    className="btn btn-color px-5 mb-5 w-100 mt-2"
                    id="log-btn"
                    onClick={() =>
                      navigate(`/user/property/details/${property._id}`)
                    }
                  >
                    Explore Home
                  </button>
                </div>
              );
            })
          ) : (
            <p>Loading properties...</p>
          )}
        </div>
      </div>
    </>
  );
};
