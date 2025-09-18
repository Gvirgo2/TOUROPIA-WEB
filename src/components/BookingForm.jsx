import React, { useState } from 'react';
import { toast } from 'react-toastify';
// import { bookingAPI } from '../api/axios'; // bookingAPI moved to checkout
import { useAuth } from '../auth/AuthContext';
import { CartContext } from '../context/CartContext'; // Import CartContext
import { useContext } from 'react'; // Import useContext

const BookingForm = ({ entityId, entityType, price, maxGuests, title, image }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useContext(CartContext); // Get addToCart from CartContext
  const [numGuests, setNumGuests] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to make a booking.');
      return;
    }
    if (!bookingDate) {
      toast.error('Please select a booking date.');
      return;
    }
    if (numGuests <= 0 || numGuests > maxGuests) {
      toast.error(`Number of guests must be between 1 and ${maxGuests}.`);
      return;
    }

    setLoading(true);
    try {
      const cartItem = {
        id: entityId,
        type: entityType.toLowerCase(),
        title: title,
        image: image,
        price: price,
        quantity: numGuests,
        startDate: bookingDate,
        maxGuests: maxGuests,
      };

      addToCart(cartItem);
      toast.success(`${title} added to cart!`);
      // Reset form
      setNumGuests(1);
      setBookingDate('');
      setSpecialRequests('');
    } catch (err) {
      console.error('Error adding item to cart:', err);
      toast.error(err.response?.data?.message || 'Failed to add item to cart.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate min date for booking to be today
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="card shadow-sm p-4 mt-4">
      <h4 className="mb-3">Book Now</h4>
      {!isAuthenticated && (
        <div className="alert alert-warning" role="alert">
          Please log in to make a booking.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="numGuests" className="form-label">Number of Guests</label>
          <input
            type="number"
            id="numGuests"
            className="form-control"
            value={numGuests}
            onChange={(e) => setNumGuests(Number(e.target.value))}
            min="1"
            max={maxGuests || 99} // Default max 99 if not provided
            required
            disabled={!isAuthenticated}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bookingDate" className="form-label">Booking Date</label>
          <input
            type="date"
            id="bookingDate"
            className="form-control"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={minDate}
            required
            disabled={!isAuthenticated}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="specialRequests" className="form-label">Special Requests (Optional)</label>
          <textarea
            id="specialRequests"
            className="form-control"
            rows="3"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            disabled={!isAuthenticated}
          ></textarea>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading || !isAuthenticated}>
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
