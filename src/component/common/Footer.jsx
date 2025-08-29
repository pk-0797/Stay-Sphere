import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  return (
    // Show only on small devices (hide from md and up)
    <footer className="bg-dark text-light mt-5 pt-4 pb-4 d-block d-md-none">
      <div className="container">
        {/* Brand / Logo */}
        <div className="col-12 text-center">
          <h4 className="fw-bold">Stay Sphere</h4>
          <p className="small">
            Cozy stays for every budget. Explore affordable and premium homes
            across India.
          </p>
        </div>

        <hr className="border-light my-3" />

        {/* Quick Links */}
        <div className="col-12 text-center">
          <h5 className="fw-semibold">Quick Links</h5>
          <ul className="list-unstyled">
            <li>
              <Link to="/" className="text-light text-decoration-none">
                Home
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="text-light text-decoration-none">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-light text-decoration-none">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <hr className="border-light my-3" />

        {/* Social Links */}
        <div className="col-12 text-center">
          <h5 className="fw-semibold">Follow Us</h5>
          <div className="d-flex justify-content-center gap-3 mt-2">
            <a href="#" className="text-light fs-5">
              <FaFacebook />
            </a>
            <a href="#" className="text-light fs-5">
              <FaInstagram />
            </a>
            <a href="#" className="text-light fs-5">
              <FaTwitter />
            </a>
            <a href="#" className="text-light fs-5">
              <FaLinkedin />
            </a>
          </div>
        </div>

        <hr className="border-light my-3" />
        <div class="credits text-secondary text-center mt-2 fs-8">
          Built by{" "}
          <Link to="https://www.linkedin.com/in/prahlad-kumar-024926351/" class="link-secondary text-decoration-none">
            Prahlad Kumar
          </Link>{" "}
          with <span class="text-primary">♥</span>
        </div>

        <hr className="border-light my-3" />
        <div className="text-center small">
          &copy; {new Date().getFullYear()} Stay Sphere. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
