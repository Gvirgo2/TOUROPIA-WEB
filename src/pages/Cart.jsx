import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../src/context/CartContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import CheckoutPage from './ConfirmYourBooking'; // No longer conditionally render

function Cart() {
  const { cartItems, addToCart, removeFromCart, subtotal, total } = useContext(CartContext); // Destructure subtotal and total from CartContext
  // const [showCheckout, setShowCheckout] = useState(false); // Removed state
  const navigate = useNavigate(); // Initialize useNavigate
  // const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]); // Removed global bookingDate
  // const [subtotal, setSubtotal] = useState(0); // Removed local state

  // Removed useEffect for local subtotal calculation

  const increaseQty = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) addToCart({ ...item, quantity: (item.quantity || 1) + 1 });
  };

  const decreaseQty = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      if ((item.quantity || 1) > 1) {
        addToCart({ ...item, quantity: item.quantity - 1 });
      } else {
        removeFromCart(id);
      }
    }
  };

  const vat = total - subtotal; // Calculate VAT from context's total and subtotal
  const grandTotal = total; // Use total from context as grandTotal

  // if (showCheckout) return <CheckoutPage cartItems={cartItems} bookingDate={cartItems.length > 0 ? cartItems[0].startDate : new Date().toISOString().split("T")[0]} />; // Removed conditional render

  return (
    <div className="cartpage-wrapper" style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div className="container cartpage-container py-5">
        <div className="text-center mb-5">
      <h2 className="mb-2">Tour Cart Summary</h2>
      <p className="text-muted">Home → Your Cart</p>
         <div className="d-flex justify-content-center gap-2 steps">
            <span className='step completed'>1</span>
            <span className='step current'>2</span>
            <span className='step'>3</span>
            <span className='step'></span>
          </div>
          </div>
        


        <div className="row g-4">
          <div className="col-md-8">
            {cartItems.length === 0 ? (
              <div className="cart-empty text-center p-4 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                <i className="ri-shopping-cart-2-line fs-1 mb-2"></i>
                <h5>Your cart is currently empty</h5>
                <p>Add some bookings to see them here.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Package</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id}>
                        <td className="d-flex align-items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            width="80"
                            className="rounded"
                            onError={(e) => { e.target.src = "/default-hotel.jpg"; }}
                          />
                          <div>
                            <strong>{item.title}</strong>
                            <br />
                            <small>{item.person} person{item.person > 1 ? "s" : ""}</small>
                            <br />
                            <small className="text-capitalize">{item.type}</small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-sm btn-light" onClick={() => decreaseQty(item.id)}>–</button>
                            <span>{item.quantity || 1}</span>
                            <button className="btn btn-sm btn-light" onClick={() => increaseQty(item.id)}>+</button>
                          </div>
                        </td>
                        <td>
                          <div>
                            ${((parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                            <br/>
                            <small className="text-muted">Date: {item.startDate}</small>
                          </div>
                        </td>
                        <td>
                          <i className="ri-delete-bin-line text-danger fs-5" role="button" onClick={() => removeFromCart(item.id)}></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="col-md-4">
            <div className="p-4 rounded shadow" style={{ backgroundColor: "#d4edda" }}>
              <h5 className="mb-4">Cart Summary</h5> {/* Changed to Cart Summary */}
              {/* Removed "Select Travel Date" and input field */}
              {/* <p className="fw-bold">Select Travel Date</p>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="form-control mb-3"
              /> */}
              <p><i className="ri-shopping-cart-line me-2"></i>Items in cart: {cartItems.length}</p> {/* Display items count */}

              <div className="border-top pt-2 mt-2">
                <p>Sub Total <span className="float-end">${subtotal.toFixed(2)}</span></p>
                <p>VAT (5%) <span className="float-end">${vat.toFixed(2)}</span></p>
                <hr />
                <h6>Grand Total <span className="float-end">${grandTotal.toFixed(2)}</span></h6>
              </div>

              <button
                className="btn w-100 fw-bold mt-3"
                style={{ backgroundColor: "#28a745", color: "#fff" }}
                disabled={cartItems.length === 0}
                onClick={() => navigate('/booking-details-form')} // Navigate to BookingDetailsForm route
              >
                Continue & Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
