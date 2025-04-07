import React from "react";
import { CommonNavbar } from "./CommonNavbar";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2"; 

export const ForgetPass = () => {
  const token = useParams().token;
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
      <div>
        <CommonNavbar />
        <section className="wrapper">
          <div className="container">
            <div className="col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 text-center">
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
              <form
                className="rounded bg-white shadow p-5"
                onSubmit={handleSubmit(submitHandler)}
              >
                <h3 className="text-dark fw-bolder fs-4 mb-2">
                  Forgot Password?
                </h3>
                <div className="fw-normal text-muted mb-4">
                  Provide the email address associated with your account to
                  recover your password.
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    {...register("Email", validationSchema.email)}
                  />
                  <div style={{ textAlign: "center", paddingBottom: "1px" }}>
                    <span style={{ color: "red" }}>
                      {errors.Email?.message}
                    </span>
                  </div>
                  <label htmlFor="floatingInput">
                    Enter Your Email address
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary submit_btn my-4"
                >
                  Submit
                </button>
                <button
                  type=""
                  className="btn btn-secondary submit_btn my-4 ms-3"
                >
                  <Link id="forget-to-login" to="/login">
                    Back to Login
                  </Link>
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
