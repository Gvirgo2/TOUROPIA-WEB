import { useParams, Link } from "react-router-dom";
import { restaurantAPI } from "../api/axios"; // Import reviewAPI
import React, { useState, useEffect, useCallback } from 'react';
import BookingForm from "../components/BookingForm"; // Import BookingForm
import { toast } from 'react-toastify'; // Import toast for messages
import ReviewForm from "../components/ReviewForm"; // Import ReviewForm

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); // New state for reviews

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const res = await restaurantAPI.getRestaurantReviews(id);
      const fetchedReviews = res?.data?.data?.reviews || res?.data?.reviews || [];
      setReviews(fetchedReviews);
    } catch (err) {
      console.error("Error fetching restaurant reviews:", err);
    }
  }, [id, setReviews]);

  useEffect(() => {
    const fetchRestaurantAndReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await restaurantAPI.getRestaurantById(id);
        const restaurantData = res?.data?.data?.data || res?.data?.data || res?.data;
        setRestaurant(restaurantData);
        // Fetch reviews after restaurant details are loaded
        fetchReviews();
        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
        setError(err.response?.data?.message || 'Failed to load restaurant details');
        setLoading(false);
      }
    };

    fetchRestaurantAndReviews();
  }, [id, fetchReviews]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Loading restaurant details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger fs-5">Error: {error}</p>
        <Link to="/restaurants" className="btn btn-success mt-3 btn-lg rounded-pill">Back to Restaurants</Link>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container py-5 text-center">
        <p>Restaurant not found.</p>
        <Link to="/restaurants" className="btn btn-success mt-3 btn-lg rounded-pill">Back to Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link to="/restaurants" className="text-decoration-none d-inline-flex align-items-center mb-4 text-primary fw-bold">
        <i className="bi bi-arrow-left me-2"></i> Back to Restaurants
      </Link>

      <div className="row g-4">
        <div className="col-md-6">
          <img src={restaurant.image} alt={restaurant.title} className="img-fluid rounded-4 w-100 shadow-sm" />
        </div>
        <div className="col-md-6 d-flex flex-column">
          <h2 className="fw-bold mb-2 text-primary">{restaurant.title}</h2>
          <div className="mb-2 text-muted fs-5">
            <i className="ri-map-pin-line me-1"></i> {restaurant.location}
          </div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-primary text-white text-capitalize fs-6">{restaurant.tag}</span>
            <span className="fs-5">{restaurant.rating}⭐ ({typeof restaurant.reviews === 'object' ? (restaurant.reviews.length || 0) : restaurant.reviews || 0} reviews)</span>
          </div>

          <div className="mb-3">
            {restaurant.oldPrice && (
              <s className="text-secondary me-2 fs-5">${restaurant.oldPrice}</s>
            )}
            <strong className="text-success fs-4">${restaurant.price}</strong>
            <small className="text-muted ms-1 fs-5">/meal</small>
          </div>

          <p className="text-muted fs-5 mb-4">
            {restaurant.description || "Enjoy an unforgettable dining experience with authentic flavors and a cozy atmosphere."}
          </p>

          <div className="mt-4 d-flex gap-2">
            <Link to="/restaurants" className="btn btn-outline-secondary btn-lg rounded-pill px-4 py-2">Back</Link>
          </div>

          {/* Booking Form for Restaurants */}
          <BookingForm 
            entityId={restaurant._id} // Assuming _id is the unique identifier
            entityType="restaurant"
            price={restaurant.price}
            maxGuests={99} // Default max 99, assuming no specific capacity field from API for restaurants
            title={restaurant.title}
            image={restaurant.image}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5 p-4 bg-light rounded-4 shadow-sm">
        <h3 className="fw-bold text-primary mb-4 d-flex align-items-center">
          <i className="bi bi-chat-left-text me-2"></i> Customer Reviews ({reviews.length})
        </h3>
        {reviews.length > 0 ? (
          <div className="row g-3">
            {reviews.map((review) => (
              <div key={review._id || review.id} className="col-md-6">
                <div className="card h-100 border-0 shadow-sm rounded-3">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-dark">{review.title || "No Title"}</h5>
                    <p className="card-text text-muted">{review.comment || "No comment provided."}</p>
                    <div className="d-flex align-items-center">
                      <span className="text-warning me-1">{'⭐'.repeat(review.rating)}</span>
                      <span className="text-muted">({review.rating}/5)</span>
                    </div>
                    {review.user && review.user.name && (
                      <p className="card-text mt-2"><small className="text-muted">By: {review.user.name}</small></p>
                    )}
                    {review.createdAt && (
                      <p className="card-text"><small className="text-muted">On: {new Date(review.createdAt).toLocaleDateString()}</small></p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted fs-5">No reviews yet. Be the first to review this restaurant!</p>
        )}
      </div>

      {/* Review Submission Form */}
      <ReviewForm itemType="restaurant" itemId={restaurant._id} onReviewSubmitted={fetchReviews} />
    </div>
  );
}
