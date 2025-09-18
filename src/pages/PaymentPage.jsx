import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartContext } from "../context/CartContext";
import BookingSummary from "./BookingSummary";


// Travel Date Picker Component
const TravelDatePicker = ({ bookingInfo, setBookingInfo }) => {
  const handleCheckInChange = (e) =>
    setBookingInfo((prev) => ({ ...prev, checkInDate: e.target.value }));
  const handleCheckOutChange = (e) =>
    setBookingInfo((prev) => ({ ...prev, checkOutDate: e.target.value }));

  return (
    <div className="mb-3">
      <label className="form-label">
        <strong>Travel Date:</strong>
      </label>
      <div className="d-flex gap-2">
        <input
          type="date"
          className="form-control"
          value={bookingInfo.checkInDate || ""}
          onChange={handleCheckInChange}
        />
        <input
          type="date"
          className="form-control"
          value={bookingInfo.checkOutDate || ""}
          onChange={handleCheckOutChange}
        />
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const { cartItems = [], bookingInfo = {}, setBookingInfo } =
    useContext(CartContext) || {};
  const [selectedMethod, setSelectedMethod] = useState("Mastercard");
  const [agreed, setAgreed] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
    0
  );
  const vat = subtotal * 0.05;
  const grandTotal = subtotal + vat;

  const handlePayment = (e) => {
    e.preventDefault();
    const updatedBooking = {
      ...bookingInfo,
      subtotal,
      vatTax: vat,
      total: grandTotal,
      paymentMethod: selectedMethod,
    };
    setBookingInfo(updatedBooking);
    setConfirmation(updatedBooking);
  };

  if (confirmation) {
    return <BookingSummary bookingInfo={confirmation} />;
  }

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#fff", minHeight: "100vh" }}
    >
      {/* Progress Steps */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Place Your Order</h2>
        <p>Home → Cart → Checkout → Payment</p>
        <div className="d-flex justify-content-center gap-2 steps">
            <span className='step completed' style={{ backgroundColor: 'green', color: '#fff' }}>1</span>
            <span className='step completed' style={{ backgroundColor: 'green', color: '#fff' }}>2</span>
            <span className='step completed' style={{ backgroundColor: 'green', color: '#fff' }}>3</span>
            <span className='step' style={{ border: '1px solid #ccc' }}>✔️</span>
          </div>
      </div>

      <div className="row g-4">
        {/* Payment Form */}
        <div className="col-md-7">
          <form onSubmit={handlePayment}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">CVV</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <label className="form-label">Payment Method</label>
              <div className="d-flex gap-3 flex-wrap">
                {["Mastercard", "Visa", "Alipay"].map((method) => (
                  <button
                    type="button"
                    key={method}
                    className={`btn btn-outline-secondary ${
                      selectedMethod === method ? "active" : ""
                    }`}
                    onClick={() => setSelectedMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="form-check mb-3 d-flex align-items-center gap-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="agreeTerms"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
              />
              <label className="form-check-label" htmlFor="agreeTerms">
                I agree to the{" "}
                <a href="/terms" target="_blank">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 fw-bold"
              disabled={!agreed}
            >
              Payment Now
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="col-md-5">
          <div className="card shadow-sm" style={{ backgroundColor: "#d4edda" }}>
            <div className="card-body">
              <h5 className="card-title mb-3">Order Summary</h5>

              <TravelDatePicker
                bookingInfo={bookingInfo}
                setBookingInfo={setBookingInfo}
              />

              {cartItems.length ? (
                <>
                  <ul className="list-group list-group-flush mb-3">
                    {cartItems.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between bg-light"
                      >
                        <span>{item.name}</span>
                        <span>
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between">
                    <span>Sub Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>VAT (5%)</span>
                    <span>${vat.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Adults</span>
                    <span>{bookingInfo.adults}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Children</span>
                    <span>{bookingInfo.children}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Tour Guide</span>
                    <span>{bookingInfo.tourGuide}</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <p className="text-muted">Your cart is empty</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;