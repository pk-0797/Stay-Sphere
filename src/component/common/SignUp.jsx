// import React from "react";
// import { CommonNavbar } from "./CommonNavbar";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm, useWatch } from "react-hook-form";
// import axios from "axios";
// import { Slide, toast, ToastContainer } from "react-toastify";
// import Swal from "sweetalert2";

// export const SignUp = () => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm();
//   const password = useWatch({ control, name: "password", defaultValue: "" });
//   const navigate = useNavigate();

//   const submitHandler = async (data) => {
//     try {
//       // Set roleId based on selected role
//       if (data.role === "user") {
//         data.roleId = "67c2b1f49c90d5af07bafacf"; // Role ID for User
//       } else if (data.role === "host") {
//         data.roleId = "67c2b1eb9c90d5af07bafacd"; // Role ID for Host
//       }

//       const res = await axios.post("/user", data);

//       if (res.status === 201) {
//         Swal.fire({
//           icon: "success",
//           title: "Sign Up Success!",
//           timer: 1300,
//           showConfirmButton: false,
//         });

//         setTimeout(() => {
//           navigate("/login");
//         }, 1300);
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Sign Up Failed!",
//       });
//     }
//   };

//   const validationSchema = {
//     fullName: {
//       required: {
//         value: true,
//         message: "Your Name is required.",
//       },
//     },
//     email: {
//       required: {
//         value: true,
//         message: "Email is required.",
//       },
//       pattern: {
//         value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//         message: "Please enter Valid Email.",
//       },
//     },
//     password: {
//       required: {
//         value: true,
//         message: "Password is required.",
//       },
//       pattern: {
//         // value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//         // message:"Password must contain"
//       },
//     },
//     confirmPassword: {
//       required: {
//         value: true,
//         message: "Password is required.",
//       },
//       validate: (value) => value === password || "Password do not match!!",
//     },

//     phoneNo: {
//       required: {
//         value: true,
//         message: "Phone Number is required.",
//       },
//       pattern: {
//         value: /^[6-9][0-9]{9}$/,
//         message: "Invalid Phone Number.",
//       },
//     },
//     role: {
//       required: {
//         value: true,
//         message: "Role selection is required.",
//       },
//     },
//   };

//   return (
//     <>
//       <CommonNavbar />
//       <ToastContainer
//         position="top-center"
//         autoClose={1500}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick={false}
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//         transition={Slide}
//       />
//       <div>
//         <div className="form-bg">
//           <div className="container">
//             <div className="row">
//               <div className="col-md-offset-3 col-md-6 col-sm-offset-2 col-sm-8">
//                 <div className="form-container sign-form">
//                   <h3 className="title">Registration</h3>
//                   <form
//                     className="form-horizontal"
//                     onSubmit={handleSubmit(submitHandler)}
//                   >
//                     <div className="form-group">
//                       <div>
//                         <label htmlFor="name">
//                           Full Name*{" "}
//                           <span style={{ color: "red" }}>
//                             {errors.fullName?.message}
//                           </span>
//                         </label>
//                         <input
//                           id="name"
//                           className="form-control"
//                           type="text"
//                           {...register("fullName", validationSchema.fullName)}
//                         />
//                       </div>
//                     </div>
//                     <div className="form-group">
//                       <div>
//                         <label htmlFor="email">
//                           Email ID*{" "}
//                           {errors.email && (
//                             <span style={{ color: "red", fontSize: "14px" }}>
//                               {errors.email.message}
//                             </span>
//                           )}
//                         </label>
//                         <input
//                           id="email"
//                           className="form-control"
//                           type="text"
//                           {...register("email", validationSchema.email)}
//                         />
//                       </div>
//                     </div>
//                     <div className="form-group">
//                       <label htmlFor="pass">
//                         Password*{" "}
//                         <span style={{ color: "red" }}>
//                           {errors.password?.message}
//                         </span>
//                       </label>
//                       <input
//                         id="pass"
//                         className="form-control"
//                         type="password"
//                         {...register("password", validationSchema.password)}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label htmlFor="con-pass">
//                         Confirm Password*{" "}
//                         <span style={{ color: "red" }}>
//                           {errors.confirmPassword?.message}
//                         </span>
//                       </label>
//                       <input
//                         id="con-pass"
//                         className="form-control"
//                         type="password"
//                         {...register(
//                           "confirmPassword",
//                           validationSchema.confirmPassword
//                         )}
//                       />
//                     </div>
//                     <h4 className="sub-title">Personal Information</h4>
//                     <div className="form-group phone-no">
//                       <label htmlFor="ph">
//                         Phone No*{" "}
//                         <span style={{ color: "red" }}>
//                           {errors.phoneNo?.message}
//                         </span>
//                       </label>
//                       <input
//                         id="ph"
//                         className="form-control"
//                         type="number"
//                         {...register("phoneNo", validationSchema.phoneNo)}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label htmlFor="role">
//                         Register as{" "}
//                         <span style={{ color: "red" }}>
//                           {errors.role?.message}
//                         </span>
//                       </label>
//                       <select
//                         id="role"
//                         className="form-control"
//                         {...register("role", validationSchema.role)}
//                       >
//                         <option value="">Select Role</option>
//                         <option value="user">GUEST</option>
//                         <option value="host">HOST</option>
//                       </select>
//                     </div>

//                     <button className="btn signin">Create Account</button>
//                     <span className="user-login">
//                       <span style={{ opacity: "0.6" }}>
//                         Already Have an Account? Click Here to&nbsp;
//                       </span>
//                       <Link to="/login" style={{ opacity: "1" }}>
//                         Login
//                       </Link>
//                     </span>
//                   </form>
//                   <div className="social-links">
//                     <span>Or Connect With</span>
//                     <Link to="#">
//                       <img
//                         src="/Image/Facebook-Color.png"
//                         alt="Facebook"
//                         height="25px"
//                         width="25px"
//                       />
//                       Facebook
//                     </Link>
//                     <Link to="#">
//                       <img
//                         src="/Image/Google-Color.png"
//                         alt="Google"
//                         height="25px"
//                         width="25px"
//                       />
//                       Google
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };


import React from "react";
import { CommonNavbar } from "./CommonNavbar";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const password = useWatch({ control, name: "password", defaultValue: "" });
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      // Set roleId based on selected role
      if (data.role === "user") {
        data.roleId = "67c2b1f49c90d5af07bafacf"; // Role ID for User
      } else if (data.role === "host") {
        data.roleId = "67c2b1eb9c90d5af07bafacd"; // Role ID for Host
      }

      const res = await axios.post("/user", data);

      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Sign Up Success!",
          timer: 1300,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/login");
        }, 1300);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Sign Up Failed!",
      });
    }
  };

  const validationSchema = {
    fullName: {
      required: {
        value: true,
        message: "Your Name is required.",
      },
    },
    email: {
      required: {
        value: true,
        message: "Email is required.",
      },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Please enter Valid Email.",
      },
    },
    password: {
      required: {
        value: true,
        message: "Password is required.",
      },
    },
    confirmPassword: {
      required: {
        value: true,
        message: "Password confirmation is required.",
      },
      validate: (value) => value === password || "Password do not match!!",
    },

    phoneNo: {
      required: {
        value: true,
        message: "Phone Number is required.",
      },
      pattern: {
        value: /^[6-9][0-9]{9}$/,
        message: "Invalid Phone Number.",
      },
    },
    role: {
      required: {
        value: true,
        message: "Role selection is required.",
      },
    },
  };

  return (
    <>
      <CommonNavbar />
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
      <div className="form-bg py-4" style={{ minHeight: "80vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-7 col-lg-6">
              <div className="form-container sign-form p-4 shadow rounded bg-white">
                <h3 className="title text-center mb-4">Registration</h3>
                <form className="form-horizontal" onSubmit={handleSubmit(submitHandler)}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name*{" "}
                      <span className="text-danger">{errors.fullName?.message}</span>
                    </label>
                    <input
                      id="name"
                      className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                      type="text"
                      {...register("fullName", validationSchema.fullName)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email ID*{" "}
                      <span className="text-danger">{errors.email?.message}</span>
                    </label>
                    <input
                      id="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      type="email"
                      {...register("email", validationSchema.email)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="pass" className="form-label">
                      Password*{" "}
                      <span className="text-danger">{errors.password?.message}</span>
                    </label>
                    <input
                      id="pass"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      type="password"
                      {...register("password", validationSchema.password)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="con-pass" className="form-label">
                      Confirm Password*{" "}
                      <span className="text-danger">{errors.confirmPassword?.message}</span>
                    </label>
                    <input
                      id="con-pass"
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      type="password"
                      {...register("confirmPassword", validationSchema.confirmPassword)}
                    />
                  </div>

                  <h4 className="sub-title mt-4 mb-3">Personal Information</h4>

                  <div className="mb-3">
                    <label htmlFor="ph" className="form-label">
                      Phone No*{" "}
                      <span className="text-danger">{errors.phoneNo?.message}</span>
                    </label>
                    <input
                      id="ph"
                      className={`form-control ${errors.phoneNo ? "is-invalid" : ""}`}
                      type="tel"
                      {...register("phoneNo", validationSchema.phoneNo)}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="role" className="form-label">
                      Register as{" "}
                      <span className="text-danger">{errors.role?.message}</span>
                    </label>
                    <select
                      id="role"
                      className={`form-select ${errors.role ? "is-invalid" : ""}`}
                      {...register("role", validationSchema.role)}
                    >
                      <option value="">Select Role</option>
                      <option value="user">GUEST</option>
                      <option value="host">HOST</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Create Account
                  </button>

                  <div className="text-center">
                    <span style={{ opacity: "0.7" }}>
                      Already Have an Account? Click Here to&nbsp;
                    </span>
                    <Link to="/login" style={{ opacity: "1" }}>
                      Login
                    </Link>
                  </div>
                </form>

                <div className="social-links text-center mt-4">
                  <span>Or Connect With</span>
                  <div className="d-flex justify-content-center gap-3 mt-2">
                    <Link to="#" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
                      <img
                        src="/Image/Facebook-Color.png"
                        alt="Facebook"
                        height="25"
                        width="25"
                      />
                      Facebook
                    </Link>
                    <Link to="#" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
                      <img
                        src="/Image/Google-Color.png"
                        alt="Google"
                        height="25"
                        width="25"
                      />
                      Google
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
