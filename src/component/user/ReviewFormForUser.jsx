import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";

export const ReviewFormForUser = () => {
  const { propertyId, bookingId } = useParams();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const guestId = localStorage.getItem("id");

  useEffect(() => {
    if (!bookingId) return;
    const fetchReview = async () => {
      try {
        const res = await axios.get(`/review/getreview/${bookingId}`);
        if (res.data.review) {
          setExistingReview(res.data.review);
          setValue("rating", res.data.review.rating);
          setValue("reviewText", res.data.review.reviewText);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };
    fetchReview();
  }, [bookingId, setValue]);

  const submitHandler = async (data) => {
    setLoading(true);
    const reviewData = { ...data, propertyId, guestId, bookingId };

    try {
      const response = await axios.post("/review/createreview", reviewData);
      toast.success("Review Submitted Successfully!");
      setExistingReview(response.data.review);
    } catch (error) {
      toast.error("Error submitting review");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <ToastContainer
        position="top-center"
        autoClose={1500}
        theme="light"
        transition={Slide}
      />

      <div className="card p-4 shadow bg-light">
        {existingReview ? (
          <div className="text-center">
            <h2 className="text-success fw-bold">🎉 Your Submitted Review</h2>
            <div className="card bg-white border border-success p-3 mt-3">
              <h4 className="text-primary">
                ⭐ Rating: {existingReview.rating}
              </h4>
              <p className="text-dark">
                <strong>Review:</strong> {existingReview.reviewText}
              </p>
              <p className="text-success fw-bold mt-3">
                🙏 Thank you for your feedback!
              </p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-primary text-center fw-bold">
              Submit Your Review
            </h2>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="mb-3">
                <label className="form-label">Rating (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  {...register("rating", { required: true, min: 1, max: 5 })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Review</label>
                <textarea
                  className="form-control"
                  rows="3"
                  {...register("reviewText")}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
