import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const bookingIds = location.state?.bookingIds;
    const cartItems = location.state?.cartItems; // Receive cartItems

    if (!bookingIds || bookingIds.length === 0) {
      // If no booking IDs are passed, redirect to cart or an error page
      navigate('/cart', { replace: true });
      return;
    }

    // Simulate payment processing delay
    const timer = setTimeout(() => {
      // After delay, navigate to BookingSummary with the booking IDs and cart items
      navigate('/booking-summary', { state: { bookingIds, cartItems }, replace: true });
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  return (
    <div className="container py-5 text-center" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem", marginBottom: "20px" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <h2 className="fw-bold mb-3">Processing Your Payment...</h2>
      <p className="text-muted">Please do not close this window. We are confirming your booking(s).</p>
    </div>
  );
};

export default PaymentProcessing;
