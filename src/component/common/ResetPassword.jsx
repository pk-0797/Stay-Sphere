import React from "react";
import { CommonNavbar } from "./CommonNavbar";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

export const ResetPassword = () => {
  const token = useParams().token;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const obj = { token: token, password: data.password };
      const res = await axios.post("/user/resetpassword", obj);

      Swal.fire({
        title: "Success!",
        text: res.data.message || "Your password has been reset successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/login"; // Redirect to login page
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Error!",
        text: "Failed to reset password. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const validationSchema = {
    password: {
      required: {
        value: true,
        message: "Password is Required",
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
            <h3 className="text-dark fw-bolder fs-4 mb-3">Reset Password</h3>
            <div className="fw-normal text-muted mb-4">
              Enter your new password below.
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingInput"
                placeholder="New Password"
                {...register("password", validationSchema.password)}
              />
              <label htmlFor="floatingInput">Enter Your New Password</label>
              {errors.password && (
                <small className="text-danger">{errors.password.message}</small>
              )}
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
