import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export const AddProperty = () => {
  const [states, setstates] = useState([]);
  const [cities, setcities] = useState([]);
  const [areas, setareas] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const amenitiesList = [
    "Pool",
    "Gym",
    "Parking",
    "WiFi",
    "Garden",
    "Security",
  ];

  const handleAmenityChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedAmenities([...selectedAmenities, value]);
    } else {
      setSelectedAmenities(
        selectedAmenities.filter((amenity) => amenity !== value)
      );
    }
  };

  const getAllStates = async () => {
    const res = await axios.get("/state/getallstates");
    console.log(res.data);
    setstates(res.data.data);
  };

  const getCityByStateId = async (id) => {
    const res = await axios.get("city/getcitybystate/" + id);
    console.log("city response.", res.data);
    setcities(res.data.data);
  };

  const getAreaByCityId = async (id) => {
    const res = await axios.get("/area/getareabycity/" + id);
    console.log("areas response.", res.data);
    setareas(res.data.data);
  };

  useEffect(() => {
    getAllStates();
  }, []);

  const submitHandler = async (data) => {
    const userId = localStorage.getItem("id");
    data.userId = userId;
    console.log(data.image[0]);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("address", data.address);
    formData.append("propertyType", data.propertyType);
    formData.append("stateId", data.stateId);
    formData.append("cityId", data.cityId);
    formData.append("areaId", data.areaId);
    formData.append("pincode", data.pincode);
    formData.append("image", data.image[0]);
    formData.append("userId", data.userId);
    selectedAmenities.forEach((amenity) =>
      formData.append("amenities", amenity)
    );
    formData.append("totalPrice", data.totalPrice);
    formData.append("roomType", data.roomType);
    formData.append("availableRooms", data.availableRooms);

    try {
      const res = await axios.post("/property/addWithFile", formData);

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Property added Successfully!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add property.",
      });
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 ">
        <div className="max-w-md mx-auto card p-4 ">
          <div>
            <h2 className="text-xl text-primary font-weight-bold mb-4 text-center">
              Add a property
            </h2>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("title", { required: "Title is required." })}
                  placeholder="enter hotel, apartment or villa name"
                />
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.title?.message}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">Property type</label>
                <select
                  className="form-control"
                  id=""
                  {...register("propertyType", {
                    required: "Property type is required.",
                  })}
                >
                  <option value="">Select</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="hotel">Hotel</option>
                </select>
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.propertyType?.message}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">Room type</label>
                <select
                  className="form-control"
                  id=""
                  {...register("roomType", {
                    required: "Room type selection is required.",
                  })}
                >
                  <option value="">Select</option>
                  <option value="1BHK">1-BHK</option>
                  <option value="2BHK">2-BHK</option>
                  <option value="3BHK">3-BHK</option>
                </select>
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.roomType?.message}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label">Amenities Selection </label>
                <div>
                  {amenitiesList.map((amenity) => (
                    <span key={amenity} style={{ paddingRight: "8px" }}>
                      <input 
                        type="checkbox"
                        value={amenity}
                        onChange={handleAmenityChange}
                        id={amenity}
                        style={{ marginRight: "4px", appearance: "auto" }} 
                      />

                      <label htmlFor={amenity} style={{ paddingLeft: "8px" }}>
                        {" "}
                        {amenity}
                      </label>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("address", { required: "Address is required." })}
                  placeholder="enter full address"
                />
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.address?.message}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">Total Price (Per Day)</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("totalPrice", {
                    required: "Price is required.",
                  })}
                  placeholder="Enter total price as per day "
                />
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.totalPrice?.message}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">Available Rooms</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("availableRooms", {
                    required: "Room Number is required.",
                  })}
                  placeholder="Enter available room numbers "
                />
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.availableRooms?.message}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">State</label>
                <select
                  className="form-control"
                  id=""
                  {...register("stateId", { required: "State is required." })}
                  onChange={(event) => {
                    getCityByStateId(event.target.value);
                  }}
                >
                  <option value="">Select</option>
                  {states?.map((state) => {
                    return <option value={state._id}>{state.name}</option>;
                  })}
                </select>
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.stateId?.message}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">City</label>
                <select
                  className="form-control"
                  id=""
                  {...register("cityId", { required: "City is required." })}
                  onChange={(event) => {
                    getAreaByCityId(event.target.value);
                  }}
                >
                  <option value="">Select</option>
                  {cities?.map((city) => {
                    return <option value={city._id}>{city.name}</option>;
                  })}
                </select>
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.cityId?.message}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">Area</label>
                <select
                  className="form-control"
                  id=""
                  {...register("areaId", { required: "Area is required." })}
                >
                  <option value="">Select</option>
                  {areas?.map((area) => {
                    return <option value={area._id}>{area.name}</option>;
                  })}
                </select>
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.areaId?.message}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="enter 6 digits pincode"
                  {...register("pincode", { required: "Pincode is required." })}
                />
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.pincode?.message}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Images</label>
                <input
                  type="file"
                  className="form-control"
                  {...register("image", { required: "Image is required." })}
                />
                <p style={{ textAlign: "center", color: "red" }}>
                  {errors.image?.message}
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-color px-5 mb-5 w-100 "
                id="log-btn"
              >
                Add Property
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
