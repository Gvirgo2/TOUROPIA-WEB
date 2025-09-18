import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await bookingAPI.getCurrentUserBookings();
        // The backend might return an array directly or nested under data.data
        const fetchedBookings = res?.data?.data?.data || res?.data?.data || [];
        setBookings(Array.isArray(fetchedBookings) ? fetchedBookings : []); // Ensure it's always an array
      } catch (err) {
        console.error("Error fetching my bookings:", err);
        console.error("API Error Response Data:", err.response?.data); // Add this line
        toast.error(err.response?.data?.message || 'Failed to fetch your bookings.');
        setError("Failed to fetch your bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, [isAuthenticated, user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    try {
      await bookingAPI.cancelBooking(bookingId);
      toast.success("Booking cancelled successfully!");
      setBookings(prevBookings => prevBookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  if (loading) return <div className="container py-5 text-center"><p>Loading your bookings...</p></div>;
  if (error) return (
    <div className="container py-5 text-center">
      <p className="text-danger fs-5">Error: {error}</p>
      <Link to="/tours" className="btn btn-primary mt-3 btn-lg rounded-pill">Explore Tours</Link>
    </div>
  );

  if (bookings.length === 0) return (
    <div className="container py-5 text-center" style={{ minHeight: "calc(100vh - 200px)" }}>
      <h2 className="mb-3 fw-bold text-primary">No Bookings Yet</h2>
      <p className="fs-5 text-muted">You haven't made any bookings. Start exploring our tours, hotels, restaurants, and transports!</p>
      <Link to="/tours" className="btn btn-primary mt-3 btn-lg rounded-pill">Explore Tours</Link>
    </div>
  );

  return (
    <div className="container py-5" style={{ minHeight: "100vh" }}>
      <h2 className="fw-bold mb-5 text-center text-primary d-flex align-items-center justify-content-center">
        <i className="bi bi-journal-check me-3"></i> My Bookings
      </h2>
      <div className="row g-4 justify-content-center">
        {bookings.map((booking) => (
          <div key={booking._id} className="col-md-6 col-lg-4">
            <div className="card shadow-lg h-100 border-0 rounded-3 overflow-hidden">
              <div className="card-body p-4">
                <h5 className="card-title text-primary fw-bold mb-3">Your Booking <span className="text-muted fs-6">(ID: {booking._id.substring(0, 8)}...)</span></h5>
                <p className="card-text mb-1"><strong>Type:</strong> <span className="text-dark">{booking.bookingType}</span></p>
                <p className="card-text mb-1"><strong>Item ID:</strong> <span className="text-muted">{booking.bookingItem}</span></p>
                <p className="card-text mb-1"><strong>Start Date:</strong> <span className="text-dark">{new Date(booking.bookingDetails.startDate).toLocaleDateString()}</span></p>
                {booking.bookingDetails.endDate && <p className="card-text mb-1"><strong>End Date:</strong> <span className="text-dark">{new Date(booking.bookingDetails.endDate).toLocaleDateString()}</span></p>}
                <p className="card-text mb-1"><strong>Quantity:</strong> <span className="text-dark">{booking.bookingDetails.quantity}</span></p>
                <p className="card-text mb-1"><strong>Total Amount:</strong> <span className="text-success fw-bold">${booking.payment.amount.toFixed(2)} {booking.payment.currency}</span></p>
                <p className="card-text mb-3"><strong>Status:</strong> <span className={`badge rounded-pill ms-2 ${booking.status === 'pending' ? 'bg-warning text-dark' : booking.status === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>{booking.status}</span></p>
                <div className="d-flex mt-3">
                  <Link to={`/bookings/${booking._id}`} className="btn btn-info btn-sm me-2 d-flex align-items-center rounded-pill px-3 py-2">
                    <i className="bi bi-eye me-1"></i> View Details
                  </Link>
                  {booking.status === 'pending' && (
                    <button 
                      className="btn btn-danger btn-sm d-flex align-items-center rounded-pill px-3 py-2" 
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      <i className="bi bi-x-circle me-1"></i> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
