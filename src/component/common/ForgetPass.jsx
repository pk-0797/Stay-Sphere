import React from "react";
import { CommonNavbar } from "./CommonNavbar";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

export const ForgetPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user/forgotpassword", {
        email: data.Email,
      });

      Swal.fire({
        title: "Success!",
        text: res.data.message || "Reset password link sent to your email.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Error!",
        text: "Failed to send reset email. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const validationSchema = {
    email: {
      required: {
        value: true,
        message: "Email is Required",
      },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Invalid Email, Please Enter Valid Email ID.",
      },
    },
  };

  return (
    <>
      <CommonNavbar />
      <section className="wrapper">
        <div className="card-form text-center">
          <div className="logo">
            <Link to="/login">
              <img
                decoding="async"
                src="/Image/logo.png"
                className="img-fluid"
                alt="logo"
              />
            </Link>
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <h3 className="text-dark fw-bolder fs-4 mb-3">Forgot Password?</h3>
            <div className="fw-normal text-muted mb-4">
              Provide the email address associated with your account to recover
              your password.
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                {...register("Email", validationSchema.email)}
              />
              {errors.Email && (
                <small className="text-danger">{errors.Email.message}</small>
              )}
              <label htmlFor="floatingInput">Enter Your Email Address</label>
            </div>

            <button type="submit" className="btn btn-primary submit_btn my-2">
              Submit
            </button>
            <button className="btn btn-secondary submit_btn my-2">
              <Link id="forget-to-login" to="/login">
                Back to Login
              </Link>
            </button>
          </form>
        </div>
      </section>
    </>
  );
};
