import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const Navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/user/login", data);
      console.log(res.data);

      if (res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Login Success !!",
          icon: "success",
          timer: 1300,
          showConfirmButton: false,
        });

        localStorage.setItem("id", res.data.data._id);
        localStorage.setItem("role", res.data.data.role);

        setTimeout(() => {
          if (res.data.data.role === "admin") {
            Navigate("/admin/home");
          }
        }, 1000);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Login failed or Invalid Credentials.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container-alt">
        <div className="row-alt justify-content-center">
          <div className="col-12-alt text-center align-self-center py-5">
            <div className="section-alt pb-5 pt-5 text-center">
              <div className="card-3d-wrap-alt mx-auto">
                <div className="card-3d-wrapper-alt">
                  {/* Login Form */}
                  <div className="card-front-alt">
                    <div className="center-wrap-alt">
                      <div className="section-alt text-center">
                        <h4 className="mb-4 pb-3 h4-alt">Admin Log In</h4>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="form-group-alt">
                            <input
                              type="email"
                              className="form-style-alt"
                              placeholder="Your Email"
                              {...register("email", {
                                required: "Email is required",
                              })}
                            />
                            <i className="input-icon-alt bi bi-envelope"></i>
                            <span style={{ color: "white" }}>
                              {errors.email && (
                                <p className="error-text">
                                  {errors.email.message}
                                </p>
                              )}
                            </span>
                          </div>

                          <div className="form-group-alt mt-3">
                            <input
                              type="password"
                              className="form-style-alt"
                              placeholder="Your Password"
                              {...register("password", {
                                required: "Password is required",
                              })}
                            />
                            <i className="input-icon-alt bi bi-lock"></i>
                            <span style={{ color: "white" }}>
                              {errors.password && (
                                <p className="error-text">
                                  {errors.password.message}
                                </p>
                              )}
                            </span>
                          </div>

                          <button type="submit" className="btn-alt mt-4">
                            Submit
                          </button>
                        </form>
                        <p className="mt-3">
                          {/* <a href="#0" className="link-alt">
                            Forgot your password?
                          </a> */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
