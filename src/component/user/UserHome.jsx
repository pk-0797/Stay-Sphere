import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



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

  const toggleWishlist = async (property) => {
    try {
      let updatedWishlist;
      if (wishlist.some((item) => item._id === property._id)) {
        const res = await axios.post("/user/wishlist/remove", {
          userId,
          propertyId: property._id,
        });
        updatedWishlist = res.data.data;
      } else {
        const res = await axios.post("/user/wishlist/add", {
          userId,
          propertyId: property._id,
        });
        updatedWishlist = res.data.data;
      }
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
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
            filteredProperties.map((property) => (
              <div className="home-card position-relative" key={property._id}>
                <div className="image-container">
                  <img
                    src={property.propertyURL || "/default-image.jpg"}
                    alt={property.title}
                  />

                  {/* Wishlist Icon - Bottom Right of Image */}
                  <span
                    className={`wishlist-icon ${
                      wishlist.some((item) => item._id === property._id)
                        ? "wishlist-active"
                        : ""
                    }`}
                    onClick={() => toggleWishlist(property)}
                  >
                    &#10084;
                  </span>
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
            ))
          ) : (
            <p>Loading properties...</p>
          )}
        </div>
      </div>
      
    </>
  );
};
