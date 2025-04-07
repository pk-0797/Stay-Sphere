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
                  Reset Password
                </h3>
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
                  <div style={{ textAlign: "center", paddingBottom: "1px" }}>
                    <span style={{ color: "red" }}>
                      {errors.password?.message}
                    </span>
                  </div>
                  <label htmlFor="floatingInput">Enter Your New Password</label>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary submit_btn my-4"
                >
                  Submit
                </button>
                <button className="btn btn-secondary submit_btn my-4 ms-3">
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
