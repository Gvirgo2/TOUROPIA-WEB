import { useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { tourAPI } from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { toast } from 'react-toastify'; // Import toast for messages
import BookingForm from "../components/BookingForm"; // Import BookingForm
import ReviewForm from "../components/ReviewForm"; // Import ReviewForm
import { useState } from 'react';

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); // New state for reviews
  // const [destinationQuery, setDestinationQuery] = useState(""); // Removed
  const { isAdmin, user } = useAuth(); // Destructure user as well

  // Debugging logs for admin access
  console.log("TourDetail.jsx: Current user from useAuth:", user);
  console.log("TourDetail.jsx: Is Admin:", isAdmin);
  console.log("TourDetail.jsx: User role:", user?.role);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const res = await tourAPI.getTourReviews(id);
      console.log("TourDetail.jsx: Tour Reviews API raw response:", res);
      const fetchedReviews = res?.data?.data?.reviews || res?.data?.reviews || [];
      setReviews(fetchedReviews);
    } catch (err) {
      console.error("Error fetching tour reviews:", err);
    }
  }, [id, setReviews]);

  useEffect(() => {
    const fetchTourAndDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("TourDetail.jsx: Fetching tour with ID:", id);
        const tourRes = await tourAPI.getTourById(id);
        console.log("TourDetail.jsx: Tour API raw response:", tourRes);
        const tourPayload = tourRes?.data ?? {};
        const t = tourPayload?.data?.data || tourPayload?.data || tourPayload?.tour || tourPayload;
        console.log("TourDetail.jsx: Raw tour data before normalization:", t);
        if (!t) {
          setError("Tour not found");
          setLoading(false);
          return;
        }
        const title = t.title || t.name || t.tourTitle || "Untitled Tour";
        const location = t.location || t.city || t.destination || t.area || "";
        const type = t.type || t.category || t.tourType || "general";
        const rating = Number(t.rating || t.ratingsAverage || t.averageRating || t.stars || 0);
        const price = Number(t.price || t.startingPrice || t.fromPrice || 0);
        const imagesArr = t.images || t.photos || t.gallery || [];
        let tourImage = t.image || t.coverImage || t.imageUrl || (Array.isArray(imagesArr) && imagesArr.length > 0 ? imagesArr[0] : undefined) || "https://via.placeholder.com/800x500?text=Tour";
        const description = t.description || t.summary || t.overview || '';
        const maxGuests = Number(t.maxGroupSize || t.maxGuests || 99);

        if (tourImage && typeof tourImage === 'string') {
          if (tourImage.startsWith("C:\\")) {
            const filename = tourImage.split(/[\\/]/).pop();
            tourImage = `/images/${filename}`;
          } else if (tourImage.startsWith("/public/")) {
            tourImage = tourImage.replace("/public", "");
          } else if (!tourImage.startsWith("http") && !tourImage.startsWith("/")) {
            if (!tourImage.startsWith("images/")) {
              tourImage = `/images/${tourImage}`;
            } else {
              tourImage = `/${tourImage}`;
            }
          }
        }

        const finalTourData = { id, title, location, type, rating, price, image: tourImage, description, maxGuests };
        setTour(finalTourData);
        console.log("TourDetail.jsx: Final tour data set to state:", finalTourData);
        
        // Fetch reviews after tour details are loaded
        fetchReviews();

      } catch (err) {
        console.error("TourDetail.jsx: Error in fetchTourAndDetails:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load tour");
      } finally {
        setLoading(false);
        console.log("TourDetail.jsx: fetchTourAndDetails completed. Loading set to false.");
      }
    };
    fetchTourAndDetails();
  }, [id, fetchReviews]);

  if (loading) return <div className="container py-5 text-center">Loading...</div>;
  if (error) return (
    <div className="container py-5 text-center">
      <p className="text-danger fs-5">{error}</p>
      <Link to="/tours" className="btn btn-success mt-3 btn-lg rounded-pill">Back to Tours</Link>
    </div>
  );
  if (!tour) return null;

  const handleDeleteTour = async () => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        await tourAPI.deleteTour(id);
        toast.success("Tour deleted successfully!");
        navigate("/tours"); // Redirect to tours list after deletion
      } catch (err) {
        console.error("Error deleting tour:", err);
        toast.error(err?.response?.data?.message || "Failed to delete tour.");
      }
    }
  };

  const handleUpdateTour = async () => {
    // For simplicity, we'll use a prompt for now. A modal or dedicated form would be better.
    const newTitle = prompt("Edit tour title:", tour.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      try {
        await tourAPI.updateTour(id, { title: newTitle });
        setTour((prevTour) => ({ ...prevTour, title: newTitle })); // Update local state
        toast.success("Tour updated successfully!");
      } catch (err) {
        console.error("Error updating tour:", err);
        toast.error(err?.response?.data?.message || "Failed to update tour.");
      }
    }
  };

  console.log("TourDetail.jsx: Component is rendering. Current tour state:", tour);
  return (
    <div className="container py-5">
      <Link to="/tours" className="text-decoration-none d-inline-flex align-items-center mb-4 text-primary fw-bold">
        <i className="bi bi-arrow-left me-2"></i> Back to Tours
      </Link>

      <div className="row g-4">
        <div className="col-md-7">
          <img src={tour.image} alt={tour.title} className="img-fluid rounded-4 w-100 shadow-sm" />
        </div>
        <div className="col-md-5 d-flex flex-column">
          <h2 className="fw-bold mb-2 text-primary">{tour.title}</h2>
          <div className="mb-2 text-muted fs-5">
            <i className="ri-map-pin-line me-1"></i> {tour.location}
          </div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-primary text-white text-capitalize fs-6">{tour.type}</span>
            <span className="fs-5">{tour.rating}⭐</span>
          </div>
          <div className="mb-3">
            <strong className="text-success fs-4">from ${tour.price}</strong>
          </div>
          {tour.description && <p className="text-muted fs-5">{tour.description}</p>}
          {/* {console.log("TourDetail.jsx: Description rendered:", tour.description)} */}

          {/* Removed "Find more tours by destination" section */}
          {/* 
          <div className="mt-3 p-3 border rounded bg-light">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <strong>Find more tours by destination</strong>
              {tour.location && (
                <button className="btn btn-sm btn-outline-success" onClick={() => navigate(`/tours?destination=${encodeURIComponent(tour.location)}`)}>
                  {tour.location}
                </button>
              )}
            </div>
            <form className="d-flex gap-2" onSubmit={handleDestinationSearch}>
              <input
                type="text"
                className="form-control"
                placeholder="Search destination..."
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
              />
              <button className="btn btn-success" type="submit">Search</button>
            </form>
          </div> 
          */}

          <div className="mt-4 d-flex gap-2">
            <Link to="/tours" className="btn btn-outline-secondary btn-lg rounded-pill px-4 py-2">Back</Link>
            {/* The existing "Book" button will be effectively replaced by the BookingForm for a richer UX */}
            {/* <Link to="/cart" className="btn btn-success">Book</Link> */}
            {/* {isAdmin && (
              <>
                <Link to={`/admin/tours/${id}`} className="ms-3 btn btn-warning btn-lg rounded-pill px-4 py-2 d-flex align-items-center"><i className="bi bi-pencil-square me-2"></i> Edit Tour</Link>
                <button className="ms-2 btn btn-danger btn-lg rounded-pill px-4 py-2 d-flex align-items-center" onClick={handleDeleteTour}><i className="bi bi-trash"></i> Delete Tour</button>
              </>
            )} */}
          </div>

          {/* Booking Form for Tours */}
          <BookingForm 
            entityId={tour.id}
            entityType="tour"
            price={tour.price}
            maxGuests={tour.maxGuests}
            title={tour.title}
            image={tour.image}
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
          <p className="text-muted fs-5">No reviews yet. Be the first to review this tour!</p>
        )}
      </div>

      {/* Review Submission Form */}
      <ReviewForm itemType="tour" itemId={tour.id} onReviewSubmitted={fetchReviews} />
    </div>
  );
}
