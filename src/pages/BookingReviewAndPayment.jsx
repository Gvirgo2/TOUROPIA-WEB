import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../auth/AuthContext';
import { bookingAPI } from '../api/axios';
import { toast } from 'react-toastify';

function BookingReviewAndPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart, subtotal, total, triggerBookingRefresh } = useContext(CartContext);
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState(location.state?.formData || {});
  const [itemBookingDetails, setItemBookingDetails] = useState(location.state?.itemBookingDetails || []);
  const [cartItemsForSummary, setCartItemsForSummary] = useState(location.state?.cartItems || []); // Use this for display
  const [loading, setLoading] = useState(false);

  // Add payment-specific state
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (!location.state || !location.state.formData || !location.state.itemBookingDetails) {
      toast.error("Missing booking details. Please start the booking process again.");
      navigate("/cart"); // Redirect to cart if no data
    }
  }, [location.state, navigate]);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleConfirmAllBookings = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to complete your booking.");
      return;
    }

    if (paymentMethod === "credit_card") {
      // Basic validation for credit card fields
      if (!cardName.trim() || !cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
        toast.error("Please fill in all credit card details.");
        setLoading(false); // Ensure loading is reset if validation fails
        return;
      }
      // Additional validation for card number format, expiry date, CVV can be added here
      // For example, a regex for card number or date format
    } else if (paymentMethod === "online_payment") {
      // Potentially add validation for other online payment methods if there are specific inputs
      // For now, we assume "Other Online Payment" doesn't require extra fields on this page.
    }

    setLoading(true);
    try {
      const successfulBookings = [];
      for (const cartItem of cartItemsForSummary) {
        const itemDetail = itemBookingDetails.find(d => d.id === cartItem.id);
        if (!itemDetail) {
          console.warn(`BookingReviewAndPayment.jsx: Item details not found for cart item ID: ${cartItem.id}`);
          continue;
        }

        // Calculate the individual item's total price including VAT
        const itemTotalPrice = (cartItem.price * itemDetail.quantity * 1.05);

        const bookingData = {
          user: user?._id,
          bookingType: cartItem.type,
          bookingItem: cartItem.id,
          bookingDetails: {
            startDate: itemDetail.startDate,
            endDate: itemDetail.endDate || itemDetail.startDate, // Ensure endDate is present, default to startDate
            quantity: itemDetail.quantity,
            participants: itemDetail.participants.filter(p => p.name.trim() !== ""), // Filter out empty participants
            ...(itemDetail.roomType && { roomType: itemDetail.roomType }),
            ...(itemDetail.route && { route: itemDetail.route, departureTime: itemDetail.departureTime }),
          },
          contactInfo: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            alternativePhone: formData.alternativePhone || undefined, // Send undefined if empty
            country: formData.country || undefined, // Send undefined if empty
            city: formData.city || undefined, // Send undefined if empty
            zipCode: formData.zipCode || undefined, // Send undefined if empty
          },
          payment: {
            amount: parseFloat(itemTotalPrice.toFixed(2)), // Ensure amount is a number with 2 decimal places
            currency: "ETB",
            paymentMethod: paymentMethod,
            paymentStatus: "pending", // Default status, will be updated by backend payment gateway
            transactionId: `TXN-${Date.now()}-${cartItem.id}-${Math.random().toString(36).substring(7)}`, // More unique ID
            paymentDate: new Date().toISOString(),
            ...(paymentMethod === "credit_card" && {
              cardName: cardName,
              cardNumber: cardNumber,
              expiryDate: expiryDate,
              cvv: cvv,
            }),
          },
          notes: formData.notes || undefined, // Send undefined if empty
        };

        console.log(`BookingReviewAndPayment.jsx: Sending booking for ${cartItem.title}:`, JSON.stringify(bookingData, null, 2));
        const res = await bookingAPI.createBooking(bookingData);
        successfulBookings.push(res.data.data._id);
      }

      toast.success("All bookings created successfully!");
      clearCart();
      triggerBookingRefresh(); // Trigger refresh of booking count in Navbar
      navigate("/payment-processing", { state: { bookingIds: successfulBookings, cartItems: cartItemsForSummary } }); // Navigate to the processing page

    } catch (err) {
      console.error("Error creating bookings:", err);
      toast.error(err.response?.data?.message || "Failed to create one or more bookings.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItemsForSummary.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">No items to review.</h2>
        <p>Please add some items to your cart and fill out booking details.</p>
        <Link to="/cart" className="btn btn-primary mt-3">Go to Cart</Link>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary mb-3">Order Review & Payment</h2>
          <p className="text-muted fs-5">Home → Cart → Details → Review</p>
          <div className="d-flex justify-content-center gap-2 steps mt-4">
            <span className='step completed bg-success text-white'><i className="bi bi-check"></i></span>
            <span className='step completed bg-success text-white'><i className="bi bi-check"></i></span>
            <span className='step current border border-primary text-primary fw-bold'>3</span>
            <span className='step border border-secondary text-secondary'>✔️</span>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-lg-8">
            <div className="p-5 rounded shadow-lg bg-white">
              <h5 className='mb-4 text-primary fw-bold fs-4 d-flex align-items-center'><i className="bi bi-receipt me-2"></i> Order Summary</h5>
              <div className="mb-4 border-bottom pb-3">
                {cartItemsForSummary.map(item => (
                  <div key={item.id} className="d-flex justify-content-between mb-2 fs-5">
                    <span>{item.title} <span className="text-muted">x {item.quantity}</span></span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr/>
                <p className="fs-5">Sub Total <span className='float-end'>${subtotal.toFixed(2)}</span></p>
                <p className="fs-5 mb-3">VAT (5%) <span className='float-end'>${(total - subtotal).toFixed(2)}</span></p>
                <hr className='border-primary'/>
                <p className='fw-bold fs-4 text-success'>
                  Total <span className='float-end'>${total.toFixed(2)} ETB</span>
                </p>
              </div>

              <h5 className='mb-4 text-primary fw-bold fs-4 d-flex align-items-center'><i className="bi bi-credit-card me-2"></i> Payment Method</h5>
              <div className="mb-4">
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="paymentMethod" id="creditCard" value="credit_card" 
                    checked={paymentMethod === "credit_card"} onChange={handlePaymentMethodChange} />
                  <label className="form-check-label fs-5 text-dark" htmlFor="creditCard">
                    Credit Card / Debit Card
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="paymentMethod" id="onlinePayment" value="online_payment" 
                    checked={paymentMethod === "online_payment"} onChange={handlePaymentMethodChange} />
                  <label className="form-check-label fs-5 text-dark" htmlFor="onlinePayment">
                    Other Online Payment (e.g., PayPal, Telebirr)
                  </label>
                </div>
              </div>

              {paymentMethod === "credit_card" && (
                <div className="credit-card-details p-4 border rounded bg-light mb-4">
                  <div className="mb-3">
                    <label htmlFor="cardName" className="form-label fw-bold text-dark">Name on Card</label>
                    <input type="text" id="cardName" name="cardName" className="form-control form-control-lg border-secondary rounded-pill px-3" placeholder="Full Name on Card" 
                      value={cardName} onChange={(e) => setCardName(e.target.value)} required={paymentMethod === "credit_card"} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label fw-bold text-dark">Card Number</label>
                    <input type="text" id="cardNumber" name="cardNumber" className="form-control form-control-lg border-secondary rounded-pill px-3" placeholder="XXXX XXXX XXXX XXXX" 
                      value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required={paymentMethod === "credit_card"} />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="expiryDate" className="form-label fw-bold text-dark">Expiry Date</label>
                      <input type="text" id="expiryDate" name="expiryDate" className="form-control form-control-lg border-secondary rounded-pill px-3" placeholder="MM/YY" 
                        value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required={paymentMethod === "credit_card"} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cvv" className="form-label fw-bold text-dark">CVV</label>
                      <input type="text" id="cvv" name="cvv" className="form-control form-control-lg border-secondary rounded-pill px-3" placeholder="XXX" 
                        value={cvv} onChange={(e) => setCvv(e.target.value)} required={paymentMethod === "credit_card"} />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type='button'
                className='btn btn-primary btn-lg w-100 fw-bold mt-4 py-3 rounded-pill d-flex align-items-center justify-content-center'
                onClick={handleConfirmAllBookings}
                disabled={loading || cartItemsForSummary.length === 0}
              >
                <i className="bi bi-lock-fill me-2"></i> {loading ? "Processing Payment..." : "Confirm All Bookings"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingReviewAndPayment;
