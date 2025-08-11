// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { CommonNavbar } from "./CommonNavbar";

// export const Home = () => {
//   const navigate = useNavigate();
//   const [properties, setProperties] = useState([]);
//   const userId = localStorage.getItem("id");
//   const [searchQuery, setSearchQuery] = useState({
//     title: "",
//     state: "",
//     city: "",
//   });

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const res = await axios.get("/property/getallproperties");
//         setProperties(res.data.data);
//       } catch (error) {
//         console.error("Error fetching properties:", error);
//       }
//     };

//     fetchProperties();
//   }, [userId, navigate]);

//   // Filter properties based on the search query (title, state, city)
//   const filteredProperties = properties.filter((property) => {
//     return (
//       (property.title || "")
//         .toLowerCase()
//         .includes(searchQuery.title.toLowerCase()) &&
//       (property.stateId?.name || "")
//         .toLowerCase()
//         .includes(searchQuery.state.toLowerCase()) &&
//       (property.cityId?.name || "")
//         .toLowerCase()
//         .includes(searchQuery.city.toLowerCase())
//     );
//   });

//   return (
//     <>
//       <div>
//         <CommonNavbar />
//         <div id="home-margin">
//           <marquee behavior="" direction="ltr">
//             <h1 id="phrase">"Cozy stays for every budget"</h1>
//           </marquee>

//           {/* Search Filters */}
//           <div className="container mt-4 mb-4">
//             <div className="d-flex flex-wrap gap-5 justify-content-between">
//               <input
//                 type="text"
//                 className="form-control"
//                 style={{ maxWidth: "350px" }}
//                 placeholder="Search by Title"
//                 value={searchQuery.title}
//                 onChange={(e) =>
//                   setSearchQuery({ ...searchQuery, title: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 className="form-control"
//                 style={{ maxWidth: "350px" }}
//                 placeholder="Search by State"
//                 value={searchQuery.state}
//                 onChange={(e) =>
//                   setSearchQuery({ ...searchQuery, state: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 className="form-control"
//                 style={{ maxWidth: "350px" }}
//                 placeholder="Search by City"
//                 value={searchQuery.city}
//                 onChange={(e) =>
//                   setSearchQuery({ ...searchQuery, city: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div className="home-card-container">
//             {filteredProperties.length > 0 ? (
//               filteredProperties.map((property) => (
//                 <div className="home-card" key={property._id}>
//                   <img
//                     src={property.propertyURL || "/default-image.jpg"}
//                     alt={property.title}
//                   />
//                   <span className="home-card-link">{property.title}</span>
//                   <p className="home-card-details">
//                     &#8377; {property.totalPrice}/-
//                   </p>

//                   <button
//                     className="btn btn-color px-5 mb-5 w-100 "
//                     id="log-btn"
//                     onClick={() =>
//                       navigate(`/property/details/${property._id}`)
//                     }
//                   >
//                     Explore Home
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p>Loading properties...</p>
//             )}
//           </div>
//         </div>

//         <div id="home-footer">
//           <div class="footer-up">
//             <div class="footer-detail-name">
//               <ul>
//                 <p>Company</p>
//                 <li class="footer-a">
//                   <a href="">Abouts</a>
//                 </li>
//                 <li class="footer-a">
//                   <a href="">Company details</a>
//                 </li>
//                 <li class="footer-a">
//                   <a href="">For the Record</a>
//                 </li>
//               </ul>
//             </div>

//             <div class="footer-detail-name">
//               <ul>
//                 <p>Communities</p>
//                 <li class="footer-a">
//                   <a href="">Careers</a>
//                 </li>
//                 <li class="footer-a">
//                   <a href="">Advertising</a>
//                 </li>
//                 <li class="footer-a">
//                   <a href="">Investors</a>
//                 </li>
//                 <li class="footer-a">
//                   <a href=""></a>
//                 </li>
//               </ul>
//             </div>

//             <div class="footer-detail-name">
//               <ul>
//                 <p>Useful links</p>
//                 <li class="footer-a">
//                   <a href="">Support</a>
//                 </li>
//                 <li class="footer-a">
//                   <a href="">Contact Customer Service</a>
//                 </li>
//                 <li class="footer-a">
//                   <a href="">FAQs</a>
//                 </li>
//               </ul>
//             </div>

//             <div class="footer-detail-name">
//               <ul>
//                 <p>Partners</p>
//                 <li class="footer-a">
//                   <a href="">List your property</a>
//                 </li>
//                 <li class="footer-a">
//                   <a href="">Partner help</a>
//                 </li>
//                 <li class="footer-a">
//                   <a href="">Become an affiliate</a>
//                 </li>
//               </ul>
//             </div>

//             <div class="f-icon">
//               <p>
//                 <img src="/Image/Instagram-Color.png" alt="..." />
//                 <img src="/Image/Facebook-Color.png" alt="..." />
//                 <img src="/Image/Twitter-Color.png" alt="..." />
//                 <img src="/Image/whatsapp-Color.png" alt="..." />
//               </p>
//             </div>
//           </div>

//           <div class="footer-line">
//             <div class="line"></div>
//           </div>

//           <div class="footer-bottom">
//             <p class="a-left">
//               <span>
//                 <a href="">Leagal</a>
//               </span>
//               <span>
//                 <a href="">Safety & Privacy Center</a>
//               </span>
//               <span>
//                 <a href="">Privacy Policy</a>
//               </span>
//               <span>
//                 <a href="">Cookies</a>
//               </span>
//               <span>
//                 <a href="">About Ads</a>
//               </span>
//               <span>
//                 <a href="">Acessibility</a>
//               </span>
//             </p>
//             <p class="c-right">
//               <span>&copy; 2025 Stay Sphere, Inc.</span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

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
      <CommonNavbar />
      <div id="home-margin" className="container py-3">
        <marquee behavior="" direction="ltr">
          <h1 id="phrase" className="text-center mb-4">
            "Cozy stays for every budget"
          </h1>
        </marquee>

        {/* Search Filters */}
        <div className="container mt-4 mb-4">
          <div className="d-flex flex-column flex-md-row flex-wrap gap-3 justify-content-between">
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

        {/* Properties Grid */}
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div className="col" key={property._id}>
                <div className="card h-100">
                  <img
                    src={property.propertyURL || "/default-image.jpg"}
                    className="card-img-top img-fluid"
                    alt={property.title}
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{property.title}</h5>
                    <p className="card-text">&#8377; {property.totalPrice}/-</p>
                    <button
                      className="btn btn-primary mt-auto"
                      onClick={() =>
                        navigate(`/property/details/${property._id}`)
                      }
                    >
                      Explore Home
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Loading properties...</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-light text-dark mt-5 pt-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-6 col-md-2">
              <h6>Company</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    Company details
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    For the Record
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-2">
              <h6>Communities</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    Advertising
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    Investors
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-2">
              <h6>Useful links</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    Contact Customer Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-2">
              <h6>Partners</h6>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    List your property
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    Partner help
                  </a>
                </li>
                <li>
                  <a href="#" className="text-decoration-none text-dark">
                    Become an affiliate
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-4 d-flex justify-content-center align-items-center gap-3">
              <a href="#" aria-label="Instagram">
                <img src="/Image/Instagram-Color.png" alt="Instagram" height="30" />
              </a>
              <a href="#" aria-label="Facebook">
                <img src="/Image/Facebook-Color.png" alt="Facebook" height="30" />
              </a>
              <a href="#" aria-label="Twitter">
                <img src="/Image/Twitter-Color.png" alt="Twitter" height="30" />
              </a>
              <a href="#" aria-label="WhatsApp">
                <img src="/Image/whatsapp-Color.png" alt="WhatsApp" height="30" />
              </a>
            </div>
          </div>

          <hr />

          <div className="d-flex flex-column flex-md-row justify-content-between pb-3">
            <div>
              <a href="#" className="me-3 text-decoration-none text-dark">
                Legal
              </a>
              <a href="#" className="me-3 text-decoration-none text-dark">
                Safety & Privacy Center
              </a>
              <a href="#" className="me-3 text-decoration-none text-dark">
                Privacy Policy
              </a>
              <a href="#" className="me-3 text-decoration-none text-dark">
                Cookies
              </a>
              <a href="#" className="me-3 text-decoration-none text-dark">
                About Ads
              </a>
              <a href="#" className="text-decoration-none text-dark">
                Accessibility
              </a>
            </div>
            <div>
              <small>&copy; 2025 Stay Sphere, Inc.</small>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
