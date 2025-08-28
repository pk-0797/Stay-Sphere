import React from 'react'
import { CommonNavbar } from './CommonNavbar'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Swal from 'sweetalert2'

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/login", data);
      if (res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Login Success !!",
          icon: "success",
          timer: 1300,
          showConfirmButton: false
        });

        localStorage.setItem("id", res.data.data._id);
        localStorage.setItem("role", res.data.data.role);

        setTimeout(() => {
          if (res.data.data.role === "user") {
            navigate('/user/home');
          } else if (res.data.data.role === "host") {
            navigate('/host/home');
          } else if (res.data.data.role === "admin") {
            navigate('/admin/dashboard');
          }
        }, 1000);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Login failed or Invalid Credentials.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const validationSchema = {
    email: {
      required: { value: true, message: "Email is Required" },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Invalid Email, Please Enter Valid Email ID."
      }
    },
    pass: {
      required: { value: true, message: "Password is Required" }
    }
  };

  return (
    <>
      <CommonNavbar />
      <div className="login-wrapper d-flex align-items-center justify-content-center ">
        <div className="container">
          <div className="row justify-content-center">
            {/* Responsive column (full width on mobile, 6 on tablet, 4 on desktop) */}
            <div className="col-12 col-sm-10 col-md-8 col-lg-6">
              <h2 className="text-center text-dark m-2">Log in or Sign up</h2>
              <div className="text-center mb-4 text-dark">
                Welcome to Stay Sphere{" "}
                <span
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                  }}
                >
                  "Cozy stays for every budget"
                </span>
              </div>
              <div className="card shadow-sm border-2 bg-light rounded-4">
                <form
                  className="card-body p-4 p-lg-5 "
                  onSubmit={handleSubmit(submitHandler)}
                >
                  {/* Logo */}
                  <div className="text-center mb-3">
                    <img
                      src="/Image/logo.png"
                      className="img-fluid profile-image-pic img-thumbnail rounded-circle"
                      alt="profile"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Email"
                      {...register("email", validationSchema.email)}
                    />
                    <div className="text-center">
                      <span className="error-text">{errors.email?.message}</span>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your Password"
                      {...register("password", validationSchema.pass)}
                    />
                    <div className="text-center">
                      <span className="error-text">{errors.password?.message}</span>
                    </div>
                  </div>

                  {/* Forgot + Login Button */}
                  <div className="text-center mb-3">
                    <Link to="/forgotpassword" className="text-dark fw-bold" id="log-lh">
                      Forgot Password?
                    </Link>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-color w-100 mb-3"
                    id="log-btn"
                  >
                    Login
                  </button>

                  {/* Register */}
                  <div className="form-text text-center text-dark">
                    Not Registered?{" "}
                    <Link to="/signup" className="text-dark fw-bold" id="log-lh">
                      Create an Account
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
