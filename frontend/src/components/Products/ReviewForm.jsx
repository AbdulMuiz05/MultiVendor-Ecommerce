import React, { useState } from "react";
import RatingStars from "./RatingStars";

const ReviewForm = ({ onSubmit, loading = false }) => {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) return;

    onSubmit?.({
      rating,
      message: message.trim(),
    });

    setMessage("");
    setRating(5);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card"
    >
      <h3 className="font-poppins text-xl font-bold text-secondary">
        Write a Review
      </h3>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-gray-700">
          Your Rating
        </p>

        <RatingStars rating={rating} />
      </div>

      <div className="mt-5">
        <label
          htmlFor="review-message"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Your Review
        </label>

        <textarea
          id="review-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Share your experience with this product..."
          rows={5}
          className="input-field resize-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="btn-primary mt-5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;