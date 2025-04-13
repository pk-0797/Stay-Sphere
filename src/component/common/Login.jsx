import React from 'react'
import { CommonNavbar } from './CommonNavbar'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Swal from 'sweetalert2'

export const Login = () => {

  const navigate = useNavigate();
  const{register,handleSubmit,formState:{errors}} = useForm();

  const submitHandler = async(data) => {
    try {
      const res = await axios.post("/user/login", data);
      console.log(res.data);

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
          }else if (res.data.data.role === "admin") {
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
  }
  
  const validationSchema  = {
    email : {
      required : {
        value:true,
        message:"Email is Required"
      },
      pattern :{
        value :/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message:"Invalid Email, Please Enter Valid Email ID."
      }
    },
    pass : {
      required : {
        value:true,
        message:"Password is Required"
      }
    }
  }
  
  return (
    <>
    <div>
      <CommonNavbar></CommonNavbar>
      <div className="d-flex vh-100 w-100">
        <div className="container ">
          <div className="row justify-content-center">
            <div className="col-md-6 offset-md-3">
              <h2 className="text-center text-dark m-2 ">Log in or sign up</h2>
              <div className="text-center mb-5 text-dark">
                Welcome to Stay Sphere{" "}
                <span
                  style={{
                    fontFamily: "Roboto",
                    fontWeight: "700",
                    fontSize: "1.2rem",
                  }}
                >
                  "Cozy stays for every budget"
                </span>
              </div>
              <div className="card my-5" >
                <form className="card-body cardbody-color p-lg-5" onSubmit={handleSubmit(submitHandler)}>
                  <div
                    className="text-center"
                    style={{ borderRadius: "5px", marginBottom: "10px" }}
                  >
                    <img
                      src="/Image/logo.png"
                      className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                      width="200px"
                      alt="profile"
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      aria-describedby="emailHelp"
                      placeholder="Enter Your Email"
                      {...register("email",validationSchema.email)}
                    />
                    <div style={{textAlign:"center",paddingBottom:"1px"}}>
                    <span style={{color:"red"}}>
                      {
                        errors.email?.message
                      }
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your Password"
                      {...register("password",validationSchema.pass)}
                    />
                    <div style={{textAlign:"center",paddingBottom:"1px"}}>
                    <span style={{color:"red"}}>
                      {
                        errors.password?.message
                      }
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-dark fw-bold" id="log-forget">
                      <div></div>
                      <Link to="/forgotpassword" className="text-dark fw-bold" id="log-lh">
                        {" "}
                        Forgot Password ?
                      </Link>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-color px-5 mb-5 w-100 "
                      id="log-btn"
                    >
                      Login
                    </button>
                  </div>
                  <div
                    id="emailHelp"
                    className="form-text text-center mb-5 text-dark"
                  >
                    Not Registered?{" "}
                    <Link
                      to="/signup"
                      className="text-dark fw-bold"
                      id="log-lh"
                    >
                      {" "}
                      Create an Account
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
