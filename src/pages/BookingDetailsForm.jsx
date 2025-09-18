import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

function BookingDetailsForm() {
  const { cartItems, subtotal, total } = useContext(CartContext); // Destructure subtotal and total
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    alternativePhone: "", 
    country: "", 
    city: "", 
    zipCode: "", 
    notes: "",
  });

  const [itemBookingDetails, setItemBookingDetails] = useState([]); 

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: `${user.FirstName || ""} ${user.LastName || ""}`.trim(),
        email: user.email || "",
        phone: user.phone || "", 
        address: user.address || "", 
        alternativePhone: user.alternativePhone || "", 
        country: user.country || "", 
        city: user.city || "", 
        zipCode: user.zipCode || "", 
      }));
    }

    const initialItemDetails = cartItems.map(item => ({
      id: item.id,
      type: item.type,
      quantity: item.quantity || 1,
      startDate: item.startDate || new Date().toISOString().split("T")[0],
      endDate: new Date(new Date(item.startDate || new Date()).setDate(new Date(item.startDate || new Date()).getDate() + 1)).toISOString().split("T")[0], // Default 1 day after start
      participants: [{ name: (user && user.FirstName) ? `${user.FirstName} ${user.LastName}`.trim() : "", age: 0, specialRequirements: "" }], 
      roomType: "", 
      route: "", 
      departureTime: "", 
    }));
    setItemBookingDetails(initialItemDetails);
  }, [user, cartItems]); 

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemDetailChange = (itemId, field, value) => {
    setItemBookingDetails(prevDetails => 
      prevDetails.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleContinueToReview = () => {
    console.log("Attempting to continue to review...");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("Cart items count:", cartItems.length);

    if (!isAuthenticated) {
      toast.error("Please log in to proceed.");
      console.log("Validation failed: User not authenticated.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to book.");
      console.log("Validation failed: Cart is empty.");
      return;
    }

    // Basic validation for required contact fields
    console.log("FormData before contact validation:", formData);
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill in all required contact details.");
      console.log("Validation failed: Missing contact details.", { fullName: formData.fullName, email: formData.email, phone: formData.phone, address: formData.address });
      return;
    }

    // Validate per-item booking details (e.g., quantity, dates)
    console.log("ItemBookingDetails before item validation:", itemBookingDetails);
    for (const item of itemBookingDetails) {
      if (item.quantity <= 0) {
        toast.error(`Quantity for ${cartItems.find(c => c.id === item.id)?.title || "an item"} must be at least 1.`);
        console.log("Validation failed: Invalid quantity for item:", item);
        return;
      }
      if (!item.startDate) {
        toast.error(`Start Date for ${cartItems.find(c => c.id === item.id)?.title || "an item"} is required.`);
        console.log("Validation failed: Missing start date for item:", item);
        return;
      }
    }

    console.log("All validations passed. Navigating to review page...");
    // Navigate to the review and payment page, passing the collected data
    navigate("/booking-review-and-payment", {
      state: {
        formData,
        itemBookingDetails,
        cartItems, // Pass cartItems for summary display
      }
    });
  };

  if (!isAuthenticated && !user) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">Please log in to manage your booking details.</h2>
        <Link to="/login" className="btn btn-primary mt-3">Log In</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">Your cart is empty!</h2>
        <p>Please add some items to your cart before proceeding to checkout.</p>
        <Link to="/tours" className="btn btn-primary mt-3">Explore Tours</Link>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper py-5" style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Your Booking Details</h2>
          <p>Home → Cart → Details</p>
          <div className="d-flex justify-content-center gap-2 steps">
            <span className='step completed' style={{ backgroundColor: 'green', color: '#fff' }}>1</span>
            <span className='step current' style={{ border: '1px solid #28a745', color: '#000' }}>2</span>
            <span className='step' style={{ border: '1px solid #ccc' }}>3</span>
            <span className='step' style={{ border: '1px solid #ccc' }}>✔️</span>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            {/* Personal Details */}
            <div className="p-4 rounded shadow mb-4" style={{ backgroundColor: "#d4edda" }}>
              <h5 className='text-dark mb-4'>Your Contact Details</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input type="text" id="fullName" name="fullName" className='form-control' placeholder='Full Name' value={formData.fullName} onChange={handleFormChange} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" id="email" name="email" className='form-control' placeholder='Email Address' value={formData.email} onChange={handleFormChange} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input type="tel" id="phone" name="phone" className='form-control' placeholder='Phone Number' value={formData.phone} onChange={handleFormChange} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input type="text" id="address" name="address" className='form-control' placeholder='Address' value={formData.address} onChange={handleFormChange} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="alternativePhone" className="form-label">Alternative Number (Optional)</label>
                  <input type="tel" id="alternativePhone" name="alternativePhone" className='form-control' placeholder='Alternative Number' value={formData.alternativePhone} onChange={handleFormChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="country" className="form-label">Country</label>
                  <input type="text" id="country" name="country" className='form-control' placeholder='Country' value={formData.country} onChange={handleFormChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label">City</label>
                  <input type="text" id="city" name="city" className='form-control' placeholder='City' value={formData.city} onChange={handleFormChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="zipCode" className="form-label">Zip Code</label>
                  <input type="text" id="zipCode" name="zipCode" className='form-control' placeholder='Zip Code' value={formData.zipCode} onChange={handleFormChange} />
                </div>
                <div className="col-12">
                  <label htmlFor="notes" className="form-label">Additional Notes (Optional)</label>
                  <textarea id="notes" name="notes" className='form-control' rows="3" placeholder='Additional Notes(Optional)' value={formData.notes} onChange={handleFormChange}></textarea>
                </div>
              </div>
            </div>

            {/* Per-Item Booking Details */}
            <h5 className='text-dark mb-3 mt-4'>Booking Details for Each Item</h5>
            {cartItems.map((item, index) => {
              const itemDetail = itemBookingDetails.find(d => d.id === item.id) || {};
              return (
                <div key={item.id} className="p-4 rounded shadow mb-4" style={{ backgroundColor: "#e6ffe6" }}>
                  <h6 className="mb-3">{item.title} ({item.type})</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor={`startDate-${item.id}`} className="form-label">Start Date</label>
                      <input 
                        type="date" 
                        id={`startDate-${item.id}`} 
                        className='form-control' 
                        value={itemDetail.startDate || ""}
                        onChange={(e) => handleItemDetailChange(item.id, 'startDate', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`endDate-${item.id}`} className="form-label">End Date (Optional)</label>
                      <input 
                        type="date" 
                        id={`endDate-${item.id}`} 
                        className='form-control' 
                        value={itemDetail.endDate || ""}
                        onChange={(e) => handleItemDetailChange(item.id, 'endDate', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`quantity-${item.id}`} className="form-label">Quantity / Guests</label>
                      <input 
                        type="number" 
                        id={`quantity-${item.id}`} 
                        className='form-control' 
                        value={itemDetail.quantity || 1}
                        onChange={(e) => handleItemDetailChange(item.id, 'quantity', Number(e.target.value))}
                        min="1"
                        max={item.maxGuests || 99}
                        required 
                      />
                    </div>
                    {item.type === "hotel" && (
                      <div className="col-md-6">
                        <label htmlFor={`roomType-${item.id}`} className="form-label">Room Type</label>
                        <input 
                          type="text" 
                          id={`roomType-${item.id}`} 
                          className='form-control' 
                          placeholder="e.g., Standard, Deluxe"
                          value={itemDetail.roomType || ""}
                          onChange={(e) => handleItemDetailChange(item.id, 'roomType', e.target.value)}
                        />
                      </div>
                    )}
                    {item.type === "transport" && (
                      <>
                        <div className="col-md-6">
                          <label htmlFor={`route-${item.id}`} className="form-label">Route</label>
                          <input 
                            type="text" 
                            id={`route-${item.id}`} 
                            className='form-control' 
                            placeholder="e.g., Addis Ababa to Gondar"
                            value={itemDetail.route || ""}
                            onChange={(e) => handleItemDetailChange(item.id, 'route', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor={`departureTime-${item.id}`} className="form-label">Departure Time</label>
                          <input 
                            type="time" 
                            id={`departureTime-${item.id}`} 
                            className='form-control' 
                            value={itemDetail.departureTime || ""}
                            onChange={(e) => handleItemDetailChange(item.id, 'departureTime', e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    <div className="col-12">
                      <label htmlFor={`participants-${item.id}`} className="form-label">Participants (Names, ages, special requests)</label>
                      <textarea 
                        id={`participants-${item.id}`} 
                        className='form-control' 
                        rows="2" 
                        placeholder="e.g., John Doe (30), Jane Smith (25, vegetarian)"
                        value={(itemDetail.participants && itemDetail.participants[0]?.name) || ""}
                        onChange={(e) => handleItemDetailChange(item.id, 'participants', [{ name: e.target.value, age: 0, specialRequirements: "" }])}
                      ></textarea>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-lg-4">
            {/* Removed Order Summary and Payment Section */}
            <div className="p-4 rounded shadow" style={{ backgroundColor: "#f8f9fa" }}>
              <h5 className="mb-4">Summary of Items</h5>
              {cartItems.map(item => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span>{item.title} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr/>
                <p>Sub Total <span className='float-end'>${subtotal.toFixed(2)}</span></p>
                <p>VAT (5%) <span className='float-end'>${(total - subtotal).toFixed(2)}</span></p>
                <hr className='border-success'/>
                <p className='fw-bold fs-5'>
                  Total <span className='float-end'>${total.toFixed(2)}</span>
                </p>
            </div>
          </div>

          <div className="col-12 mt-4 text-center">
            <button 
              type='button'
              className='btn btn-primary btn-lg fw-bold'
              onClick={handleContinueToReview}
            >
              Continue to Order Review & Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsForm;
