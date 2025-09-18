import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { transportAPI } from '../api/axios'; // Corrected path
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../auth/AuthContext'; // Corrected path
import ReviewForm from './ReviewForm'; // Import ReviewForm





const TransportReviews = () => {
  const { carId } = useParams(); // Using carId as the transport ID from the parent route
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [carId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await transportAPI.getTransportReviews(carId);
      const fetchedReviews = res?.data?.data?.data || res?.data?.data || res?.data || [];
      setReviews(fetchedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to fetch reviews.");
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews(); // Re-fetch reviews to show the new one
  };

  if (loading) return <p className="text-center mt-4">Loading reviews...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;

  return (
    <div className="transport-reviews-section mt-5">
      <ToastContainer />
      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review this transport!</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{review.user?.FirstName || 'Anonymous'} {review.user?.LastName || ''}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Rating: {review.rating}/5</h6>
                <p className="card-text">{review.review}</p>
                <p className="card-text"><small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small></p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Review Submission Form */}
      <ReviewForm itemType="transport" itemId={carId} onReviewSubmitted={handleReviewSubmitted} />
    </div>
  );
};

export default TransportReviews;
