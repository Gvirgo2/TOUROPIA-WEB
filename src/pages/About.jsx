import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import tst from "../assets/tst.jpg";
import tstbanner from "../assets/tstbanner.jpg";
import aboutbanner from "../assets/aboutbanner.png";

const About = () => {
  // Simple rotating testimonials (continuous)
  const testimonials = [
    {
      name: "David Malan",
      role: "Traveler",
      text:
        "Looking For A day Trip outside Addis Ababa? Taking a trip to Wenchi Crater Lake is a nice Choice for Spending your Weekend...",
      date: "Jan 20, 2025",
      avatar: tst,
    },
    {
      name: "Jessica Drake",
      role: "Traveler",
      text:
        "Wonderful coordination and authentic experiences. Loved the guides and the attention to detail across the whole trip.",
      date: "Feb 2, 2025",
      avatar: tst,
    },
    {
      name: "Ronald Raymond",
      role: "Traveler",
      text:
        "Great value for money and top-notch support. Booking and changes were smooth, highly recommend Touropia.",
      date: "Mar 5, 2025",
      avatar: tst,
    },
  ];
  const [tIndex, setTIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setTIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);
  const activeTestimonial = testimonials[tIndex];

  return (
    <div>
      {/* About Section */}
      <div className="about-section section" aria-labelledby="about-title">
        <div className="container about">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-title">
                <div className="row">
                  <p>Special offers</p>
                  <h2 id="about-title">Get The Best Travel Experience With Touropia</h2>
                </div>
              </div>

              <p className="about-pera">
                Travel is more than just moving from one place to another; it is
                a journey into new ways of life. One of the greatest benefits of
                traveling is the opportunity it provides to learn about different
                cultures. By experiencing a place firsthand, we gain knowledge
                and perspectives that cannot be found in books or on screens.
              </p>

              <Link to="/tours" className="btn" aria-label="Explore tours">
                Learn More <i className="ri-arrow-right-up-line"></i>
              </Link>

              <div className="user-icon d-flex align-items-center gap-3 mt-4" aria-live="polite">
                <i className="ri-user-line" aria-hidden></i>
                <p className="about-pera m-0">
                  500 people Booked Tomorrow Land Event in the last week
                </p>
              </div>
            </div>

            <div className="col-lg-6 mt-xl-0 mt-5">
              <div className="about-img">
                <img
                  src={aboutbanner}
                  alt="Travelers exploring destinations"
                  className="img-fluid rounded-4 w-100"
                  loading="lazy"
                />
              </div>

              <div className="row states-box mt-5 text-center" aria-label="Key stats">
                <div className="col-4 mb-3">
                  <h4>150k</h4>
                  <span>Happy Traveler</span>
                </div>
                <div className="col-4 mb-3">
                  <h4>95.7%</h4>
                  <span>Satisfaction Rate</span>
                </div>
                <div className="col-4 mb-3">
                  <h4>500+</h4>
                  <span>Tour Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="price-section section" aria-labelledby="pricing-title">
        <div className="container">
          <div className="section-title mb-5">
            <div className="row text-center">
              <p>package pricing plan</p>
              <h2 id="pricing-title">simply choose The pricing plan <br/>That fits you best</h2>
            </div>

          </div>
          <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="pricing-card h-100">
                <h5>Basic</h5>
                <p className="mb-3">Best for personaland basic needs</p>
                <div className="pricing-content d-flex align-items-center gap-3 border-top">
                  <h2>$45</h2>
                  <span>One-time payment</span>
                </div>
                <ul className="list-unstyled mt-4">
                  <li className='mb-3'>
                    <i className="ri-check-line" aria-hidden></i>
                    10+ partners
                  </li>
                  <li className='mb-3'>
                    <i className="ri-check-line" aria-hidden></i>
                    Mass Messaging
                  </li>
                  <li className='mb-3'>
                    <i className="ri-check-line" aria-hidden></i>
                    Online booking engine
                  </li>
                  <li className='mb-0'>
                    <i className="ri-check-line" aria-hidden></i>
                    Business card scanner
                  </li>
                </ul>
                <Link to="/tours" className="btn text-white w-100 mt-3" aria-label="Try Basic plan">Try Now <i className="ri-arrow-right-up-line" aria-hidden></i> </Link>
                <p className="text-white mt-2 mb-0 small">per month +2% per online Booking</p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="pricing-card h-100">
                <h5>Pro <span className="popular-tag text-white">popular</span></h5>
                <p className="mb-3">Best for personaland basic needs</p>
                <div className="pricing-content d-flex align-items-center gap-3 border-top">
                  <h2>$120</h2>
                  <span>One-time payment</span>
                </div>
                <ul className="list-unstyled mt-4">
                  <li className='mb-3'>
                    <i className="ri-check-line" aria-hidden></i>
                    10+ partners
                  </li>
                  <li className='mb-3'>
                    <i className="ri-check-line" aria-hidden></i>
                    Mass Messaging
                  </li>
                  <li className='mb-3'>
                    <i className="ri-check-line" aria-hidden></i>
                    Online booking engine
                  </li>
                  <li className='mb-0'>
                    <i className="ri-check-line" aria-hidden></i>
                    Business card scanner
                  </li>
                </ul>
                <Link to="/tours" className="btn text-white w-100 mt-3" aria-label="Try Pro plan">Try Now <i className="ri-arrow-right-up-line" aria-hidden></i> </Link>
                <p className="text-white mt-2 mb-0 small">per month +11% per online Booking</p>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="pricing-card h-100">
                <h5>Custom</h5>
                <p className="mb-3">Best for personaland basic needs</p>
                <ul className="list-unstyled mt-4">
                  
                  <li className='mb-3'>
                    <i className="ri-check-line" aria-hidden></i>
                    Mass Messaging
                  </li>
                    <li className='mb-3'>
                    <i className="ri-check-line" aria-hidden></i>
                    Unlimited Everything
                  </li>
                  <li className='mb-3'>
                    <i className="ri-check-line" aria-hidden></i>
                    Online booking engine
                  </li>
                  <li className='mb-0'>
                    <i className="ri-check-line" aria-hidden></i>
                    Business card scanner
                  </li>
                </ul>
                <Link to="/contact" className="btn text-white w-100 mt-3" aria-label="Contact for custom plan">Contact <i className="ri-arrow-right-up-line" aria-hidden></i> </Link>
                <p className="text-white mt-2 mb-0 small"> please contact anytime</p>
              </div>
            </div>
          </div>
          </div>
          

        </div>
      </div>

      {/* Testimonials Section */}
      <section
        style={{
          padding: "50px 20px",
          background:
            "linear-gradient(135deg, var(--overlay-bg) 0%, var(--overlay-bg-dark) 50%, var(--overlay-bg-darker) 100%)",
          color: "green",
        }}
        aria-labelledby="testimonials-title"
      >
        <div className="container">
          <div className="text-center mb-5">
            <p>Testimonials</p>
            <h2 id="testimonials-title">What People Have Said About Our Service</h2>
          </div>

          <div className="row g-4 align-items-center">
            {/* Testimonial Card (auto-rotating) */}
            <div className="col-12 col-lg-6">
              <div className="d-flex align-items-start mb-3 gap-3">
                <img
                  src={activeTestimonial.avatar}
                  alt={activeTestimonial.name}
                  className="rounded-circle"
                  style={{ width: 60, height: 60, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }}
                  loading="lazy"
                />
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    {activeTestimonial.name}
                  </div>
                  <div style={{ opacity: 0.8 }}>{activeTestimonial.role}</div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-1 mb-3" aria-hidden>
                <span style={{ fontSize: "1.2rem" }}>★</span>
                <span style={{ fontSize: "1.2rem" }}>★</span>
                <span style={{ fontSize: "1.2rem" }}>★</span>
                <span style={{ fontSize: "1.2rem" }}>★</span>
                <span style={{ fontSize: "1.2rem" }}>★</span>
              </div>

              <p className="mb-3" style={{ fontSize: "1.05rem", lineHeight: 1.6 }}>
                "{activeTestimonial.text}"
              </p>

              <div className="d-flex justify-content-between align-items-center">
                <span style={{ fontSize: "1.2rem" }}>
                  Touro<span style={{ color: "#f2ea0e" }}>p</span>ia
                </span>
                <span>{activeTestimonial.date}</span>
              </div>
            </div>

            {/* Testimonial Image */}
            <div className="col-12 col-lg-6">
              <div
                style={{
                  height: "300px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={tstbanner}
                  alt="Travel moments collage"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  Customer Experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <>
  <section aria-labelledby="offers-title">
    {/* Banner */}
    <div className="banner-container section">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="section-title">
            <p>special offers</p>
            <h2 id="offers-title" style={{ color: 'green', fontWeight: 'bold', fontSize: '2.5rem' }}>
              Winter  Our Big Offer to Inspire You
            </h2>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* First Offer */}
          <div className="col-lg-6 mb-4">
            <div className="banner-content z-1 py-5 px-4 rounded-3 banner-bg-1 text-white">
              <p className="highlight-text">Save up to</p>
              <h4 className="fs-1 fw-semibold">50%</h4>
              <p className="pera fs-4 fw-bold">Let's go to the mountains</p>
              <div className="location d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-alt" aria-hidden></i>
                <p className="name mb-0">Addis Ababa, Ethiopia</p>
              </div>
              <Link to="/tours" className="btn banner-btn" aria-label="Book mountain offer">Booking Now</Link>
            </div>
          </div>

          {/* Second Offer */}
          <div className="col-lg-6 mb-4">
            <div className="hotel-banner-content z-1 py-5 px-4 rounded-3 text-white">
              <p className="fs-1 fw-semibold">Nearby Hotel</p>
              <h4 className="highlight-text">Up to 50% Off</h4>
              <div className="location d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-alt" aria-hidden></i>
                <p className="name mb-0">Addis Ababa, Ethiopia</p>
              </div>
              <Link to="/hotels" className="btn banner-btn" aria-label="Book hotel offer">Booking Now</Link>
            </div>
          </div>
        </div>
      </div> 
    </div>
  </section>
</>

    </div>
  );
};

export default About;
