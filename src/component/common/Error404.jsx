import React from "react";

export const Error404 = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <h1 className="text-warning fw-bold display-4 text-center">
        Error 404 - Page Not Found!
      </h1>
      <p className="text-muted fs-5 text-center mt-3">
        Oops! The page you’re looking for doesn’t exist.
      </p>
    </div>
  );
};
