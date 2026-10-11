import React from "react";
import { FiMessageCircle, FiUser } from "react-icons/fi";
import RatingStars from "./RatingStars";

const ProductReviews = ({ reviews = [] }) => {
  return (
    <section className="mt-14">
      <div className="mb-7">
        <h2 className="section-title">Customer Reviews</h2>
        <p className="mt-2 text-sm text-gray-500">
          See what customers are saying about this product.
        </p>
      </div>

      {!reviews.length ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
            <FiMessageCircle size={25} />
          </div>

          <h3 className="mt-4 font-poppins text-lg font-bold text-secondary">
            No reviews yet
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Be the first customer to review this product.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <article
              key={review._id || index}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FiUser size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-secondary">
                      {review.user?.name || "Customer"}
                    </h3>

                    <p className="text-xs text-gray-400">
                      Verified customer
                    </p>
                  </div>
                </div>

                <RatingStars rating={review.rating} size={15} />
              </div>

              {review.message && (
                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {review.message}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductReviews;