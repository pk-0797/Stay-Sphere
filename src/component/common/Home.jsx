import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CommonNavbar } from "./CommonNavbar";

export const Home = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const userId = localStorage.getItem("id");
  const [searchQuery, setSearchQuery] = useState({
    title: "",
    state: "",
    city: "",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/property/getallproperties");
        setProperties(res.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [userId, navigate]);

  // Filter properties based on the search query (title, state, city)
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

  return (
    <>
      <div>
        <CommonNavbar />
        <div id="home-margin">
          <marquee behavior="" direction="ltr">
            <h1 id="phrase">"Cozy stays for every budget"</h1>
          </marquee>

          {/* Search Filters */}
          <div className="container mt-4 mb-4">
            <div className="d-flex flex-wrap gap-5 justify-content-between">
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: "350px" }}
                placeholder="Search by Title"
                value={searchQuery.title}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, title: e.target.value })
                }
              />
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: "350px" }}
                placeholder="Search by State"
                value={searchQuery.state}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, state: e.target.value })
                }
              />
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: "350px" }}
                placeholder="Search by City"
                value={searchQuery.city}
                onChange={(e) =>
                  setSearchQuery({ ...searchQuery, city: e.target.value })
                }
              />
            </div>
          </div>

          <div className="home-card-container">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <div className="home-card" key={property._id}>
                  <img
                    src={property.propertyURL || "/default-image.jpg"}
                    alt={property.title}
                  />
                  <span className="home-card-link">{property.title}</span>
                  <p className="home-card-details">
                    &#8377; {property.totalPrice}/-
                  </p>

                  <button
                    className="btn btn-color px-5 mb-5 w-100 "
                    id="log-btn"
                    onClick={() =>
                      navigate(`/property/details/${property._id}`)
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
    </>
  );
};
