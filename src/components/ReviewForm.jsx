import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext';
import { reviewAPI } from '../api/axios';
import { Link } from 'react-router-dom'; // Added Link import

const ReviewForm = ({ itemType, itemId, onReviewSubmitted }) => {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [dateOfExperience, setDateOfExperience] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    if (!rating || !title.trim() || !comment.trim() || !dateOfExperience) {
      toast.error("Please fill in all required fields (rating, title, comment, date of experience).");
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        itemType,
        itemId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        dateOfExperience,
        // images: [], // Assuming no image upload for now
      };
      
      await reviewAPI.createReview(reviewData);
      toast.success("Review submitted successfully and is awaiting approval!");
      setRating(0);
      setTitle('');
      setComment('');
      setDateOfExperience('');
      if (onReviewSubmitted) {
        onReviewSubmitted(); // Callback to refresh reviews in parent component
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 shadow-sm mt-4">
      <h4 className="mb-3">Submit Your Review</h4>
      {!isAuthenticated ? (
        <p className="text-muted">Please <Link to="/login">log in</Link> to submit a review.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="rating" className="form-label">Rating (1-5)</label>
            <select 
              id="rating" 
              className="form-select" 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              required
            >
              <option value="0">Select a rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Review Title</label>
            <input 
              type="text" 
              id="title" 
              className="form-control" 
              placeholder="e.g., Amazing Experience!"
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">Your Comment</label>
            <textarea 
              id="comment" 
              className="form-control" 
              rows="4" 
              placeholder="Share your detailed experience..."
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="dateOfExperience" className="form-label">Date of Experience</label>
            <input 
              type="date" 
              id="dateOfExperience" 
              className="form-control" 
              value={dateOfExperience} 
              onChange={(e) => setDateOfExperience(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
