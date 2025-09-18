import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="container py-5" style={{ minHeight: "calc(100vh - 200px)" }}>
      <h2 className="fw-bold text-primary mb-4 text-center">How Touropia Works</h2>
      <p className="fs-5 text-muted text-center">Making your travel dreams a reality, step by step.</p>

      <div className="row g-4 mt-5">
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-lg border-0 rounded-4 p-4 text-center">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <i className="bi bi-search fs-1 text-success mb-3"></i>
              <h5 className="card-title fw-bold mb-2">1. Explore Destinations</h5>
              <p className="card-text text-muted">Browse through our extensive list of tours, hotels, and restaurants. Use filters to find your perfect match.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-lg border-0 rounded-4 p-4 text-center">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <i className="bi bi-cart-plus fs-1 text-warning mb-3"></i>
              <h5 className="card-title fw-bold mb-2">2. Add to Cart & Book</h5>
              <p className="card-text text-muted">Select your desired items, customize your booking details, and add them to your cart. Proceed to our secure checkout.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-lg border-0 rounded-4 p-4 text-center">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <i className="bi bi-check-circle fs-1 text-info mb-3"></i>
              <h5 className="card-title fw-bold mb-2">3. Confirm & Enjoy</h5>
              <p className="card-text text-muted">Receive instant confirmation of your booking. All that's left is to pack your bags and enjoy your adventure!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <p className="fs-5 text-dark">Have more questions? Check out our <Link to="/faq" className="text-decoration-none text-primary fw-semibold">FAQ page</Link> or <Link to="/contact" className="text-decoration-none text-primary fw-semibold">Contact Us</Link>.</p>
      </div>
    </div>
  );
};

export default HowItWorks;
