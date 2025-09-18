import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { bookingAPI } from '../api/axios';
import { toast } from 'react-toastify';

const BookingSummary = () => {
  const location = useLocation();
  const [bookingIds, setBookingIds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cartItems, setCartItems] = useState([]); // New state for cart items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state && location.state.bookingIds) {
      setBookingIds(location.state.bookingIds);
      if (location.state.cartItems) {
        setCartItems(location.state.cartItems);
      }
    } else {
      setError("No booking information found.");
    }
  }, [location.state]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (bookingIds.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const bookingPromises = bookingIds.map(id => bookingAPI.getBookingById(id));
        const responses = await Promise.all(bookingPromises);
        const fetchedBookings = responses.map(res => res.data.data);
        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Error fetching booking details for summary:", err);
        toast.error("Failed to load booking summary.");
        setError("Failed to load booking summary.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingIds]);

  if (loading) return <div className="container py-5">Loading booking summary...</div>;
  if (error) return (
    <div className="container py-5 text-center">
      <p className="text-danger">Error: {error}</p>
      <Link to="/tours" className="btn btn-primary mt-3">Continue Shopping</Link>
    </div>
  );

  if (bookings.length === 0) return (
    <div className="container py-5 text-center">
      <h2 className="mb-3">No Bookings Found</h2>
      <p>It seems there was an issue retrieving your booking details. Please check your "My Bookings" page or try again.</p>
      <Link to="/tours" className="btn btn-primary mt-3">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-success">Booking Confirmed!</h2>
        <p className="text-muted">Thank you for your booking with Touropia.</p>
        <div className="d-flex justify-content-center gap-2 steps">
          <span className='step completed' style={{ backgroundColor: 'green', color: '#fff' }}>1</span>
          <span className='step completed' style={{ backgroundColor: 'green', color: '#fff' }}>2</span>
          <span className='step completed' style={{ backgroundColor: 'green', color: '#fff' }}>3</span>
          <span className='step current' style={{ border: '1px solid #28a745', color: '#000' }}>✔️</span>
        </div>
      </div>

      <div className="row g-4">
        {bookings.map((booking) => {
          const correspondingCartItem = cartItems.find(item => item.id === booking.bookingItem);
          const totalAmount = parseFloat(booking.payment.amount);
          const taxRate = 0.006; // 0.6%
          const subtotal = totalAmount / (1 + taxRate);
          const taxAmount = totalAmount - subtotal;

          return (
            <div key={booking._id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">Booking Confirmation</h5>
                  <p className="card-text"><strong>Type:</strong> {booking.bookingType}</p>
                  <p className="card-text"><strong>Tour/Item:</strong> {correspondingCartItem?.title || booking.bookingItem}</p>
                  <p className="card-text"><strong>Start Date:</strong> {new Date(booking.bookingDetails.startDate).toLocaleDateString()}</p>
                  {booking.bookingDetails.endDate && <p className="card-text"><strong>End Date:</strong> {new Date(booking.bookingDetails.endDate).toLocaleDateString()}</p>}
                  <p className="card-text"><strong>Adults/Guests:</strong> {booking.bookingDetails.quantity}</p>
                  <p className="card-text"><strong>Children:</strong> N/A (Requires separate input in booking form)</p>
                  <hr/>
                  <p className="card-text"><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
                  <p className="card-text"><strong>Tax (0.6%):</strong> ${taxAmount.toFixed(2)}</p>
                  <p className="card-text"><strong>Total Amount:</strong> ${totalAmount.toFixed(2)} {booking.payment.currency}</p>
                  <p className="card-text"><strong>Status:</strong> <span className={`badge ${booking.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>{booking.status}</span></p>
                  <Link to="/my-bookings" className="btn btn-sm btn-outline-primary mt-2">View All My Bookings</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-5">
        <Link to="/tours" className="btn btn-success me-3">Continue Exploring Tours</Link>
        <Link to="/contact" className="btn btn-outline-info">Contact Support</Link>
      </div>
    </div>
  );
};

export default BookingSummary;
