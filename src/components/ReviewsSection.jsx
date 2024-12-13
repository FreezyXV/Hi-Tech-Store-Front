import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, addReview } from "../features/reviewsSlice";

const ReviewsSection = ({ productId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.data);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  const handleReviewSubmit = () => {
    dispatch(addReview({ ...newReview, productId }));
    setNewReview({ rating: 0, comment: "" });
  };

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id}>
          <strong>{review.rating} stars</strong>
          <p>{review.comment}</p>
        </div>
      ))}
      <div>
        <input
          type="number"
          max="5"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: e.target.value })
          }
        />
        <textarea
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
        />
        <button onClick={handleReviewSubmit}>Submit Review</button>
      </div>
    </div>
  );
};

export default ReviewsSection;
