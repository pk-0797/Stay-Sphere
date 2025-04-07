import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserHome = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem("id");

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

    fetchProperties();

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`/user/wishlist/${userId}`);
        setWishlist(res.data.data); // ✅ Load wishlist from the database
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    if (userId) {
      fetchWishlist();
    }
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
      setWishlist(updatedWishlist); // ✅ Update with latest data from DB
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <div>
      <div id="home-margin">
        <h6 id="phrase" style={{ fontSize: "2rem" }}>
          "Cozy stays for every budget"
        </h6>

        <div className="home-card-container">
          {properties.length > 0 ? (
            properties.map((property) => (
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
                  className="btn btn-color px-5 mb-3 w-100"
                  id="log-btn"
                  onClick={() => handleBookNow(property._id)}
                >
                  Book Now
                </button>
                <button
                  className="btn btn-color px-5 mb-5 w-100 mt-2"
                  id="log-btn"
                  onClick={() => navigate(`/user/property/details/${property._id}`)}
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

      <div id="home-footer">
        <div class="footer-up">
          <div class="footer-detail-name">
            <ul>
              <p>Company</p>
              <li class="footer-a">
                <a href="">Abouts</a>
              </li>
              <li class="footer-a">
                <a href="">Company details</a>
              </li>
              <li class="footer-a">
                <a href="">For the Record</a>
              </li>
            </ul>
          </div>

          <div class="footer-detail-name">
            <ul>
              <p>Communities</p>
              <li class="footer-a">
                <a href="">Careers</a>
              </li>
              <li class="footer-a">
                <a href="">Advertising</a>
              </li>
              <li class="footer-a">
                <a href="">Investors</a>
              </li>
              <li class="footer-a">
                <a href=""></a>
              </li>
            </ul>
          </div>

          <div class="footer-detail-name">
            <ul>
              <p>Useful links</p>
              <li class="footer-a">
                <a href="">Support</a>
              </li>
              <li class="footer-a">
                <a href="">Contact Customer Service</a>
              </li>
              <li class="footer-a">
                <a href="">FAQs</a>
              </li>
            </ul>
          </div>

          <div class="footer-detail-name">
            <ul>
              <p>Partners</p>
              <li class="footer-a">
                <a href="">List your property</a>
              </li>
              <li class="footer-a">
                <a href="">Partner help</a>
              </li>
              <li class="footer-a">
                <a href="">Become an affiliate</a>
              </li>
            </ul>
          </div>

          <div class="f-icon">
            <p>
              <img src="/Image/Instagram-Color.png" alt="..." />
              <img src="/Image/Facebook-Color.png" alt="..." />
              <img src="/Image/Twitter-Color.png" alt="..." />
              <img src="/Image/whatsapp-Color.png" alt="..." />
            </p>
          </div>
        </div>

        <div class="footer-line">
          <div class="line"></div>
        </div>

        <div class="footer-bottom">
          <p class="a-left">
            <span>
              <a href="">Leagal</a>
            </span>
            <span>
              <a href="">Safety & Privacy Center</a>
            </span>
            <span>
              <a href="">Privacy Policy</a>
            </span>
            <span>
              <a href="">Cookies</a>
            </span>
            <span>
              <a href="">About Ads</a>
            </span>
            <span>
              <a href="">Acessibility</a>
            </span>
          </p>
          <p class="c-right">
            <span>&copy; 2025 Stay Sphere, Inc.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
