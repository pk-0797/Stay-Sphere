import React from "react";
import { CommonNavbar } from "./CommonNavbar";

export const AboutUs = () => {
  return (
    <>
      <CommonNavbar />

      <div className="container my-5 px-3">
        <h1 className="text-center mb-4 text-primary fw-bold">
          About Stay Sphere
        </h1>

        <div
          className="rounded p-4 shadow-sm"
          style={{ backgroundColor: "#f9fbff" }}
        >
          {/* Logo */}
          <div className="text-center mb-4">
            <img
              src="/Image/logo.png"
              alt="Stay Sphere"
              className="img-fluid"
              style={{
                maxHeight: "100px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Intro */}
          <p className="fs-5 text-muted text-center">
            Welcome to <strong>Stay Sphere</strong> — your gateway to
            comfortable and affordable stays worldwide. Whether you’re traveling
            for work or leisure, we connect you to trusted hosts and cozy homes
            that suit every budget.
          </p>

          {/* Key Points */}
          <div >
            <div className="col-12 col-md-6">
              <ul className="list-unstyled fs-6">
                <li className="mb-2">🏠 Diverse selection of properties</li>
                <li className="mb-2">🔒 Verified hosts for peace of mind</li>
                <li className="mb-2">⚡ Fast & secure booking</li>
                <li className="mb-2">💬 24/7 responsive support</li>
              </ul>
            </div>
          </div>

          {/* Meet Owner */}
          <hr className="" />
          <div className="text-center">
            <h2 className="text-primary mb-4">Meet the Owner</h2>

            <img
              src="/Image/blue-circle-with-white-user_78370-4707.avif"
              alt="Prahlad Kumar"
              className="rounded-circle img-fluid mb-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />

            <h3 className="fw-bold">Prahlad Kumar</h3>
            <p className="fst-italic">Founder & Owner, Stay Sphere</p>
          </div>

          {/* Footer Note */}
          <p
            className="text-center text-muted mt-5"
            style={{ fontSize: "0.9rem" }}
          >
            © 2025 Stay Sphere. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};
