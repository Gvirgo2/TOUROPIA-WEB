import React, { useEffect, useState } from 'react';
import { reviewAPI } from '../../api/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'; // Import useAuth to check for admin role

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get user from AuthContext

  const fetchPendingReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewAPI.getPendingReviews();
      const fetchedReviews = res?.data?.data || [];
      setReviews(Array.isArray(fetchedReviews) ? fetchedReviews : []);
    } catch (err) {
      console.error("Error fetching pending reviews:", err);
      toast.error(err.response?.data?.message || 'Failed to fetch pending reviews.');
      setError("Failed to fetch pending reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPendingReviews();
    }
  }, [user]);

  const handleApproveReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to approve this review?")) {
      return;
    }
    try {
      await reviewAPI.approveReview(reviewId);
      toast.success("Review approved successfully!");
      fetchPendingReviews(); // Refresh the list of pending reviews
    } catch (err) {
      console.error("Error approving review:", err);
      toast.error(err.response?.data?.message || 'Failed to approve review.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    try {
      await reviewAPI.deleteReview(reviewId);
      toast.success("Review deleted successfully!");
      fetchPendingReviews(); // Refresh the list of pending reviews
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  if (loading) return <div className="container py-5 text-center"><p>Loading pending reviews...</p></div>;
  if (error) return (
    <div className="container py-5 text-center">
      <p className="text-danger fs-5">Error: {error}</p>
      <Link to="/admin" className="btn btn-primary mt-3 btn-lg rounded-pill">Go to Admin Dashboard</Link>
    </div>
  );

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "calc(100vh - 200px)" }}>
        <h2 className="mb-3 fw-bold text-danger">Access Denied</h2>
        <p className="fs-5 text-muted">You do not have administrative privileges to view this page.</p>
        <Link to="/" className="btn btn-primary mt-3 btn-lg rounded-pill">Go Home</Link>
      </div>
    );
  }

  if (reviews.length === 0) return (
    <div className="container py-5 text-center" style={{ minHeight: "calc(100vh - 200px)" }}>
      <h2 className="mb-3 fw-bold text-primary">No Pending Reviews</h2>
      <p className="fs-5 text-muted">There are no reviews awaiting approval at this time.</p>
      <Link to="/admin" className="btn btn-primary mt-3 btn-lg rounded-pill">Back to Admin Dashboard</Link>
    </div>
  );

  return (
    <div className="container py-5" style={{ minHeight: "100vh" }}>
      <h2 className="fw-bold mb-5 text-center text-primary d-flex align-items-center justify-content-center">
        <i className="bi bi-stars me-3"></i> Pending Reviews
      </h2>
      <div className="row g-4 justify-content-center">
        {reviews.map((review) => (
          <div key={review._id} className="col-md-6 col-lg-4">
            <div className="card shadow-lg h-100 border-0 rounded-3 overflow-hidden">
              <div className="card-body p-4">
                <h5 className="card-title text-primary fw-bold mb-3">{review.title} <span className="text-muted fs-6">(ID: {review._id.substring(0, 8)}...)</span></h5>
                <p className="card-text mb-1"><strong>User:</strong> <span className="text-dark">{review.user ? review.user.name : 'N/A'}</span></p>
                <p className="card-text mb-1"><strong>Item Type:</strong> <span className="text-dark">{review.itemType}</span></p>
                <p className="card-text mb-1"><strong>Item ID:</strong> <span className="text-muted">{review.itemId}</span></p>
                <p className="card-text mb-1"><strong>Rating:</strong> <span className="text-warning">{'⭐'.repeat(review.rating)} ({review.rating}/5)</span></p>
                <p className="card-text mb-1"><strong>Comment:</strong> <span className="text-muted">{review.comment}</span></p>
                <p className="card-text mb-1"><strong>Date of Experience:</strong> <span className="text-dark">{new Date(review.dateOfExperience).toLocaleDateString()}</span></p>
                <p className="card-text mb-3"><strong>Submitted At:</strong> <span className="text-dark">{new Date(review.createdAt).toLocaleString()}</span></p>
                <div className="d-flex mt-3">
                  <button 
                    className="btn btn-success btn-sm d-flex align-items-center rounded-pill px-3 py-2 me-2" 
                    onClick={() => handleApproveReview(review._id)}
                  >
                    <i className="bi bi-check-circle me-1"></i> Approve
                  </button>
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

export default AdminReviews;
