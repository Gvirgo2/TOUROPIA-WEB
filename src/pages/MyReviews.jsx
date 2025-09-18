import React, { useEffect, useState } from 'react';
import { reviewAPI } from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const MyReviews = () => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyReviews = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await reviewAPI.getCurrentUserReviews();
        const fetchedReviews = res?.data?.data || [];
        setReviews(Array.isArray(fetchedReviews) ? fetchedReviews : []);
      } catch (err) {
        console.error("Error fetching my reviews:", err);
        toast.error(err.response?.data?.message || 'Failed to fetch your reviews.');
        setError("Failed to fetch your reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyReviews();
  }, [isAuthenticated, user]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    try {
      await reviewAPI.deleteReview(reviewId);
      toast.success("Review deleted successfully!");
      setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  if (loading) return <div className="container py-5 text-center"><p>Loading your reviews...</p></div>;
  if (error) return (
    <div className="container py-5 text-center">
      <p className="text-danger fs-5">Error: {error}</p>
      <Link to="/" className="btn btn-primary mt-3 btn-lg rounded-pill">Go Home</Link>
    </div>
  );

  if (reviews.length === 0) return (
    <div className="container py-5 text-center" style={{ minHeight: "calc(100vh - 200px)" }}>
      <h2 className="mb-3 fw-bold text-primary">No Reviews Yet</h2>
      <p className="fs-5 text-muted">You haven't submitted any reviews. Share your experiences with us!</p>
      <Link to="/tours" className="btn btn-primary mt-3 btn-lg rounded-pill">Explore Tours</Link>
    </div>
  );

  return (
    <div className="container py-5" style={{ minHeight: "100vh" }}>
      <h2 className="fw-bold mb-5 text-center text-primary d-flex align-items-center justify-content-center">
        <i className="bi bi-chat-left-text me-3"></i> My Reviews
      </h2>
      <div className="row g-4 justify-content-center">
        {reviews.map((review) => (
          <div key={review._id} className="col-md-6 col-lg-4">
            <div className="card shadow-lg h-100 border-0 rounded-3 overflow-hidden">
              <div className="card-body p-4">
                <h5 className="card-title text-primary fw-bold mb-3">{review.title} <span className="text-muted fs-6">(ID: {review._id.substring(0, 8)}...)</span></h5>
                <p className="card-text mb-1"><strong>Type:</strong> <span className="text-dark">{review.itemType}</span></p>
                <p className="card-text mb-1"><strong>Rating:</strong> <span className="text-warning">{'⭐'.repeat(review.rating)} ({review.rating}/5)</span></p>
                <p className="card-text mb-1"><strong>Comment:</strong> <span className="text-muted">{review.comment}</span></p>
                <p className="card-text mb-1"><strong>Date of Experience:</strong> <span className="text-dark">{new Date(review.dateOfExperience).toLocaleDateString()}</span></p>
                <p className="card-text mb-3"><strong>Status:</strong> <span className={`badge rounded-pill ms-2 ${review.status === 'pending' ? 'bg-warning text-dark' : review.status === 'approved' ? 'bg-success' : 'bg-danger'}`}>{review.status}</span></p>
                <div className="d-flex mt-3">
                  {/* Add an update link later if needed */}
                  <button 
                    className="btn btn-danger btn-sm d-flex align-items-center rounded-pill px-3 py-2" 
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReviews;
