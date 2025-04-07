import React from "react";
import { Link } from "react-router-dom";

export const CommonNavbar = () => {
  return (
    <div>
      <nav class="navbar navbar-expand-lg static-top" id="nav-br-remove">
        <div class="container">
          <div>
            <Link class="navbar-brand" to="/">
              <img src="/Image/logo.png" alt="..." height="50px" width="80px" />
            </Link>
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto">
              {/* <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="#">
                  List your property
                </Link>
              </li> */}
              <li class="nav-item">
                <a
                  class="nav-link active"
                  aria-current="page"
                  href="#home-footer"
                >
                  About us
                </a>
              </li>

              <li class="nav-item dropdown">
                <Link
                  class="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account <i class="fa-regular fa-circle-user">&nbsp;</i>
                </Link>
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <Link class="dropdown-item" to="/login" id="dlh">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link class="dropdown-item" to="/signup" id="dlh">
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
