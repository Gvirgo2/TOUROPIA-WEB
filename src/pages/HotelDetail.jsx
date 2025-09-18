import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { hotelAPI } from "../api/axios"; // Import reviewAPI
import BookingForm from "../components/BookingForm"; // Import BookingForm
import { toast } from 'react-toastify'; // Import toast for messages
import ReviewForm from "../components/ReviewForm"; // Import ReviewForm

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); // New state for reviews

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const res = await hotelAPI.getHotelReviews(id);
      const fetchedReviews = res?.data?.data?.reviews || res?.data?.reviews || [];
      setReviews(fetchedReviews);
    } catch (err) {
      console.error("Error fetching hotel reviews:", err);
    }
  }, [id, setReviews]);

  useEffect(() => {
    const fetchHotelAndReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await hotelAPI.getHotelById(id);
        const payload = res?.data ?? {};
        const h = payload?.data?.data || payload?.data || payload?.hotel || payload;
        if (!h) {
          setError("Hotel not found");
          setLoading(false);
          return;
        }
        const title = h.title || h.name || h.hotelName || "Untitled Hotel";
        const location = h.location || h.city || h.address || "";
        const rating = Number(h.rating || h.ratingsAverage || h.averageRating || 0);
        const reviewsCount = Number(h.reviews || h.ratingsQuantity || 0); // Renamed to avoid conflict with reviews state
        const price = Number(h.price || h.pricePerNight || h.startingPrice || 0);
        const tag = h.tag || h.category || h.type || "";
        const imagesArr = h.images || h.photos || h.gallery || [];
        const image = h.image || h.coverImage || h.imageUrl || (Array.isArray(imagesArr) && imagesArr.length > 0 ? imagesArr[0] : undefined) || "https://via.placeholder.com/800x500?text=Hotel";
        const description = h.description || h.summary || h.overview || "No description available.";
        const maxGuests = Number(h.maxGuests || h.maxCapacity || 99); // Add maxGuests for hotels

        setHotel({ id, title, location, rating, reviews: reviewsCount, price, tag, image, description, maxGuests });

        // Fetch reviews after hotel details are loaded
        fetchReviews();

      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load hotel");
      } finally {
        setLoading(false);
      }
    };
    fetchHotelAndReviews();
  }, [id, fetchReviews]);

  if (loading) return <div className="container py-5 text-center">Loading...</div>;
  if (error) return (
    <div className="container py-5 text-center">
      <p className="text-danger fs-5">{error}</p>
      <Link to="/hotels" className="btn btn-success mt-3 btn-lg rounded-pill">Back to Hotels</Link>
    </div>
  );
  if (!hotel) return null;

  return (
    <div className="container py-5">
      <Link to="/hotels" className="text-decoration-none d-inline-flex align-items-center mb-4 text-primary fw-bold">
        <i className="bi bi-arrow-left me-2"></i> Back to Hotels
      </Link>

      <div className="row g-4">
        <div className="col-md-7">
          <img src={hotel.image} alt={hotel.title} className="img-fluid rounded-4 w-100 shadow-sm" />
        </div>
        <div className="col-md-5 d-flex flex-column">
          <h2 className="fw-bold mb-2 text-primary">{hotel.title}</h2>
          <div className="mb-2 text-muted fs-5">
            <i className="ri-map-pin-line me-1"></i> {hotel.location}
          </div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-primary text-white text-capitalize fs-6">{hotel.tag}</span>
            <span className="fs-5">{hotel.rating}⭐ ({hotel.reviews} reviews)</span>
          </div>

          <div className="mb-3">
            <strong className="text-success fs-4">${hotel.price}</strong>
            <small className="text-muted ms-1 fs-5">/night</small>
          </div>

          <p className="text-muted fs-5">{hotel.description}</p>

          <div className="mt-4 d-flex gap-2">
            <Link to="/hotels" className="btn btn-outline-secondary btn-lg rounded-pill px-4 py-2">Back</Link>
          </div>

          {/* Booking Form for Hotels */}
          <BookingForm 
            entityId={hotel.id}
            entityType="hotel"
            price={hotel.price}
            maxGuests={hotel.maxGuests}
            title={hotel.title}
            image={hotel.image}
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
          <p className="text-muted fs-5">No reviews yet. Be the first to review this hotel!</p>
        )}
      </div>

      {/* Review Submission Form */}
      <ReviewForm itemType="hotel" itemId={hotel.id} onReviewSubmitted={fetchReviews} />
    </div>
  );
}
