// import React from "react";
// import { CommonNavbar } from "./CommonNavbar";

// export const AboutUs = () => {
//   return (
//     <>
//       <CommonNavbar />

//       <div
//         style={{
//           maxWidth: "1200px",
//           margin: "40px auto",
//           padding: "20px",
//           fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//           color: "#333",
//         }}
//       >
//         <h1
//           style={{
//             textAlign: "center",
//             marginBottom: "30px",
//             color: "#1e90ff",
//           }}
//         >
//           About Stay Sphere
//         </h1>

//         <div
//           style={{
//             borderRadius: "12px",
//             boxShadow: "0 4px 15px rgba(30, 144, 255, 0.2)",
//             padding: "25px",
//             backgroundColor: "#f9fbff",
//           }}
//         >
//           <img
//             src="/Image/logo.png"
//             alt="Stay Sphere"
//             style={{
//               display: "block",
//               margin: "0 auto 25px",
//               width: "auto",
//               height: "auto",
//               borderRadius: "10px",
//               objectFit: "cover",
//               maxHeight: "100px",
//             }}
//           />

//           <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
//             Welcome to <strong>Stay Sphere</strong> — your gateway to
//             comfortable and affordable stays worldwide. Whether you’re traveling
//             for work or leisure, we connect you to trusted hosts and cozy homes
//             that suit every budget.
//           </p>

//           <ul
//             style={{ paddingLeft: "20px", marginTop: "20px", fontSize: "1rem" }}
//           >
//             <li>
//               🏠 Diverse selection of properties from apartments to villas
//             </li>
//             <li>🔒 Verified hosts for your safety and peace of mind</li>
//             <li>⚡ Fast & secure booking experience</li>
//             <li>💬 Responsive customer support, anytime you need</li>
//           </ul>

//           <p style={{ marginTop: "25px", fontSize: "1rem" }}>
//             Join the Stay Sphere community today and find your perfect stay
//             wherever life takes you!
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

import React from "react";
import { CommonNavbar } from "./CommonNavbar";

export const AboutUs = () => {
  return (
    <>
      <CommonNavbar />

      <div
        style={{
          maxWidth: "1250px",
          margin: "40px auto",
          padding: "20px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#333",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#1e90ff",
          }}
        >
          About Stay Sphere
        </h1>

        <div
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(156, 99, 29, 0.5)", // light bisque shadow
            padding: "25px",
            backgroundColor: "#f9fbff",
          }}
        >
          <img
            src="/Image/logo.png"
            alt="Stay Sphere"
            style={{
              display: "block",
              margin: "0 auto 25px",
              width: "auto",
              height: "auto",
              borderRadius: "10px",
              objectFit: "cover",
              maxHeight: "100px",
            }}
          />

          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            Welcome to <strong>Stay Sphere</strong> — your gateway to
            comfortable and affordable stays worldwide. Whether you’re traveling
            for work or leisure, we connect you to trusted hosts and cozy homes
            that suit every budget.
          </p>

          <ul
            style={{ paddingLeft: "20px", marginTop: "20px", fontSize: "1rem" }}
          >
            <li>
              🏠 Diverse selection of properties from apartments to villas
            </li>
            <li>🔒 Verified hosts for your safety and peace of mind</li>
            <li>⚡ Fast & secure booking experience</li>
            <li>💬 Responsive customer support, anytime you need</li>
          </ul>

          <p style={{ marginTop: "25px", fontSize: "1rem" }}>
            Join the Stay Sphere community today and find your perfect stay
            wherever life takes you!
          </p>

          {/* Meet the Owner Section */}
          <hr style={{ margin: "50px 0 30px" }} />

          <div style={{ textAlign: "center", color: "#1e90ff" }}>
            <h2>Meet the Owner</h2>

            <img
              src="/Image/blue-circle-with-white-user_78370-4707.avif" // <-- Replace with your actual owner image path
              alt="Prahlad Kumar"
              className="rounded-circle mx-auto d-block"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                marginBottom: "20px",
              }}
            />

            <p
              style={{ fontSize: "1.5rem", fontWeight: "700", margin: "5px 0" }}
            >
              Prahlad Kumar
            </p>
            <p
              style={{
                fontSize: "1.1rem",
                fontStyle: "italic",
                margin: "0 0 25px",
              }}
            >
              Founder & Owner, Stay Sphere
            </p>
            <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "40px" }}>
              © 2025 Stay Sphere. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
