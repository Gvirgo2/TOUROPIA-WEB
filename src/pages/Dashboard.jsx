import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// Import correct images from assets folder
import heroBg from '../assets/hero-bg.jpg';
import ertale from '../assets/Ertale.jpg';
import gonder from '../assets/Gonder.jpg';
import harar from '../assets/Harar.jpg';
import lali from '../assets/lali.jpg';
import explore1 from '../assets/Explore1.jpg';
import explore2 from '../assets/Explore2.jpg';
import explore3 from '../assets/Explore3.jpg';
import denakil from '../assets/Denakil.png';
import explore4 from '../assets/Explore4.jpg';
import explore5 from '../assets/Explore5.jpg';
import explore6 from '../assets/Explore6.jpg';
import explore7 from '../assets/Explore7.jpg';
import userImg1 from '../assets/userImg-1.png';
import userImg2 from '../assets/userImg-2.png';
import userImg3 from '../assets/userImg-3.png';
import userImg4 from '../assets/userImg-4.png';
import userImg5 from '../assets/userImg-5.png';
import userImg6 from '../assets/userImg-6.png';
import user1 from '../assets/user-1.png';
import user2 from '../assets/user-2.png';
import user3 from '../assets/user-3.png';
import user4 from '../assets/user-4.png';
import starIcon from '../assets/star.svg';
import timeIcon from '../assets/time.svg';
import locationIcon from '../assets/location.svg';
import planeIcon from '../assets/PLane.svg';
import personIcon from '../assets/person.svg';
import tst from '../assets/tst.jpg';
import tstbanner from '../assets/tstbanner.jpg';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Import CartContext
import { useAuth } from '../auth/AuthContext'; // Import useAuth

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); // Destructure addToCart from CartContext
  const { isAuthenticated } = useAuth(); // Get isAuthenticated from useAuth

  const [searchFilters, setSearchFilters] = useState({
    destination: "",
    tourType: "",
    date: "",
    guests: 1,
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchFilters.destination) queryParams.append("destination", searchFilters.destination);
    if (searchFilters.tourType) queryParams.append("tourType", searchFilters.tourType);
    if (searchFilters.date) queryParams.append("date", searchFilters.date);
    if (searchFilters.guests) queryParams.append("guests", searchFilters.guests);
    navigate(`/tours?${queryParams.toString()}`);
  };

  // CSS Variables for better dark mode support
  const cssVars = {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#ffffff',
    '--bg-card': '#ffffff',
    '--text-primary': '#333333',
    '--text-secondary': '#666666',
    '--border-color': '#ddd',
    '--shadow-color': 'rgba(0,0,0,0.1)',
    '--shadow-hover': 'rgba(0,0,0,0.15)',
    '--accent-color': '#23A16F',
    '--accent-hover': '#1e8f5e',
    '--rating-color': '#f1b614',
    '--overlay-bg': 'rgba(59, 130, 246, 0.7)',
    '--overlay-bg-dark': 'rgba(30, 64, 175, 0.7)',
    '--overlay-bg-darker': 'rgba(30, 58, 138, 0.7)',
  };

  // Dark mode styles
  const darkModeStyles = {
    '--bg-primary': '#1a1a1a',
    '--bg-secondary': '#2d2d2d',
    '--bg-card': '#2d2d2d',
    '--text-primary': '#ffffff',
    '--text-secondary': '#cccccc',
    '--border-color': '#444',
    '--shadow-color': 'rgba(0,0,0,0.3)',
    '--shadow-hover': 'rgba(0,0,0,0.5)',
    '--accent-color': '#23A16F',
    '--accent-hover': '#1e8f5e',
    '--rating-color': '#f1b614',
    '--overlay-bg': 'rgba(59, 130, 246, 0.8)',
    '--overlay-bg-dark': 'rgba(30, 64, 175, 0.8)',
    '--overlay-bg-darker': 'rgba(30, 58, 138, 0.8)',
  };

  // Check if user prefers dark mode
  const [currentStyles, setCurrentStyles] = useState(cssVars);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateStyles = (e) => {
      setCurrentStyles(e.matches ? darkModeStyles : cssVars);
    };

    // Set initial styles
    updateStyles(mediaQuery);

    // Add listener for changes
    mediaQuery.addListener(updateStyles);

    // Cleanup
    return () => mediaQuery.removeListener(updateStyles);
  }, []);

  const tabs = [
    {
      title: "Fishing & Swimming",
      description: "Enjoy a relaxing day fishing in serene waters or swimming in crystal-clear lakes surrounded by nature. Stay in cozy lakeside cabins that combine comfort with stunning views. Participate in guided fishing tours and water activities perfect for all ages.",
      image: explore1
    },
    {
      title: "Cultural Experiences",
      description: "Immerse yourself in local culture through guided tours, traditional foods, and interactive workshops. Stay in charming local inns and experience authentic living. Join festivals, handicraft sessions, and cultural performances for a deep local connection.",
      image: explore2
    },
    {
      title: "Trailers & Sports",
      description: "Experience high-adrenaline sports like mountain biking, trail running, and adventure races. Our accommodations are located close to action spots for convenience and comfort. Enjoy guided excursions, safety support, and equipment for all your sporting needs.",
      image: explore3
    },
    {
      title: "Mountain & Hill Hiking",
      description: "Hike breathtaking mountains and hills while exploring scenic trails and panoramic views. Stay in mountain lodges or eco-friendly cabins surrounded by nature. Join guided treks to discover hidden valleys, waterfalls, and wildlife.",
      image: explore4
    },
    {
      title: "Outdoor & Adventure",
      description: "Experience thrilling outdoor adventures like kayaking, rock climbing, and zip-lining. Our camps and lodges provide comfort and safety amidst the wild landscapes. Participate in guided tours and challenge yourself with exciting activities for all skill levels.",
      image: explore5
    },
    {
      title: "Music & Relaxing",
      description: "Unwind with music-themed tours, relaxing retreats, and scenic escapes. Stay in boutique hotels or resorts that offer both comfort and serenity. Enjoy live performances, spa sessions, and tranquil settings to recharge your mind and body.",
      image: explore6
    },
    {
      title: "Educational Tour",
      description: "Learn and explore through educational tours, museums, and historical site visits. Accommodations are selected for comfort and proximity to educational attractions. Participate in guided lessons, workshops, and interactive experiences for an enriching journey.",
      image: explore7
    }
  ];

  const topTours = [
    { id: "65f2c1a9d3a4b2c1d4e5f6b1", name: "Ertale Tour", image: ertale, rating: 4.5, reviewCount: 120, duration: "3 days", price: 250 },
    { id: "65f2c1a9d3a4b2c1d4e5f6b2", name: "Gonder Castles", image: gonder, rating: 4.8, reviewCount: 95, duration: "2 days", price: 180 },
    { id: "65f2c1a9d3a4b2c1d4e5f6b3", name: "Lalibela Churches", image: lali, rating: 4.9, reviewCount: 150, duration: "2 days", price: 300 },
    { id: "65f2c1a9d3a4b2c1d4e5f6b4", name: "Harar City", image: harar, rating: 4.6, reviewCount: 88, duration: "2 days", price: 220 },
    { id: "65f2c1a9d3a4b2c1d4e5f6b5", name: "Simien Mountains", image: explore4, rating: 4.7, reviewCount: 110, duration: "5 days", price: 500 },
    { id: "65f2c1a9d3a4b2c1d4e5f6b6", name: "Bale Mountains", image: explore5, rating: 4.5, reviewCount: 75, duration: "3 days", price: 400 },
    { id: "65f2c1a9d3a4b2c1d4e5f6b7", name: "Danakil Depression", image: denakil, rating: 4.8, reviewCount: 65, duration: "4 days", price: 600 },
    { id: "65f2c1a9d3a4b2c1d4e5f6b8", name: "Blue Nile Falls", image: explore1, rating: 4.4, reviewCount: 92, duration: "1 day", price: 100 }
  ];

  return (
    <div style={{
      ...currentStyles,
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh'
    }}>
     
      {/* Dark Mode Toggle */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000,
        backgroundColor: 'var(--bg-card)',
        border: `1px solid var(--border-color)`,
        borderRadius: '50px',
        padding: '8px',
        cursor: 'pointer',
        boxShadow: `0 2px 10px var(--shadow-color)`
      }}
      onClick={() => {
        const isDark = currentStyles === darkModeStyles;
        setCurrentStyles(isDark ? cssVars : darkModeStyles);
      }}>
        <div style={{ 
          width: '20px', 
          height: '20px', 
          borderRadius: '50%',
          backgroundColor: currentStyles === darkModeStyles ? '#f1b614' : '#333',
          transition: 'all 0.3s ease'
        }} />
      </div>

      {/* Hero Section with Background Image */}
      <section className="hero-section" style={{ 
        background: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '100px 20px',
        textAlign: 'center',
        color: 'white',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '20px',
          color: 'var(--white-color)',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          fontWeight: '700'
        }}>
          Plan tours to dream locations with just a click!
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          marginBottom: '40px', 
          color: 'var(--white-color)',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          fontWeight: '500'
        }}>
          "From the soaring peaks of the Simien Mountains to the lava lakes of Danakil, Ethiopia is nature's untamed masterpiece waiting to be explored."
        </p>
      
        {/* Customer Profile Images */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '10px', 
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {[userImg1, userImg2, userImg3, userImg4, userImg5, userImg6].map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt={`Customer ${index + 0.5}`}
              className="users-image"
            />
          ))}
          <div style={{ 
            backgroundColor: 'var(--secondary-color)',
            color: 'var(--white-color)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '2px solid var(--white-color)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginLeft: '-10px',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: '2'
          }}>
            10K+
          </div>
        </div>

        <form style={{ maxWidth: '800px', margin: '0 auto' }} onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white' }}>
                <img src={locationIcon} alt="location" style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.9rem' }}>Location</span>
              </div>
              <select name="destination" value={searchFilters.destination} onChange={handleSearchChange} style={{ padding: '10px', borderRadius: '5px', border: 'none', minWidth: '150px' }}>
                <option>Bale Mountains</option>
                <option>Lalibela</option>
                <option>Axum</option>
                <option>Harar</option>
                <option>Danakil</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white' }}>
                <img src={planeIcon} alt="plane" style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.9rem' }}>Tour Type</span>
              </div>
              <select name="tourType" value={searchFilters.tourType} onChange={handleSearchChange} style={{ padding: '10px', borderRadius: '5px', border: 'none', minWidth: '150px' }}>
                <option>Pre-book</option>
                <option>Cultural</option>
                <option>Historical</option>
                <option>Nature</option>
                <option>Wildlife</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white' }}>
                <img src={timeIcon} alt="date" style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.9rem' }}>Date</span>
              </div>
              <input type="date" name="date" value={searchFilters.date} onChange={handleSearchChange} style={{ padding: '10px', borderRadius: '5px', border: 'none', minWidth: '150px' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'white' }}>
                <img src={personIcon} alt="person" style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.9rem' }}>Guests</span>
              </div>
              <select name="guests" value={searchFilters.guests} onChange={handleSearchChange} style={{ padding: '10px', borderRadius: '5px', border: 'none', minWidth: '150px' }}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            
            <button style={{ 
              padding: '10px 20px', 
              backgroundColor: '#23A16F', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '25px'
            }}>
              Search
            </button>
          </div>
        </form>
      </section>
     <>
      <section>
             {/* Banner */}
       <div className="banner-container section">
         <div className="container">
           <div className="row text-center mb-5">
                           <div className="section-title">
                <p>special offers</p>
                <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '2.5rem' }}>Winter  Our Big Offer to Inspire You</h2>
              </div>
           </div>
         </div>
                <div className="container">
         <div className="row">
           <div className="col-lg-6 mb-4">
             <div className="banner-content z-1 py-5 px-4 rounded-3 banner-bg-1 text-white">
                <p className="highlight-text">Save up to</p> 
                <h4 className="fs-1 fw-semibold">50%</h4>
                <p className="pera fs-4 fw-bold">Let's go to the mountains</p>
                <div className="location d-flex align-items-center gap-2">
                 <i className="bi bi-geo-alt-alt"></i>
                 <p className="name mb-0">Addis Ababa, Ethiopia</p>
                </div>
                <button className="btn banner-btn banner-booking-btn" onClick={() => navigate('/tours')}>Booking  Now</button>
               </div>
           </div>
           
           <div className="col-lg-6 mb-4">
             <div className="hotel-banner-content z-1 py-5 px-4 rounded-3 text-white">
                <p className="fs-1 fw-semibold">Nearby Hotel</p> 
                <h4 className="highlight-text">Up to 50% Off</h4>
                
                <div className="location d-flex align-items-center gap-2">
                 <i className="bi bi-geo-alt-alt"></i>
                 <p className="name mb-0">Addis Ababa, Ethiopia</p>
                </div>
                <button className="btn banner-btn banner-booking-btn" onClick={() => navigate('/hotels')}>Booking  Now</button>
               </div>
           </div>
           
         </div>
         </div> 
       </div>
      </section>
      </>
      {/* Top Tours Section with Images */}
      <section style={{ 
        padding: '50px 20px', 
        textAlign: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <h2 style={{ marginBottom: '30px' }}>Our Top Tours</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px', 
          maxWidth: '1200px', 
          margin: '0 auto 30px' 
        }}>
          {topTours.map((tour, index) => (
            <div key={index} style={{ 
              background: 'var(--bg-card)', 
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: `0 4px 15px var(--shadow-color)`,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              border: `1px solid var(--border-color)`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = `0 8px 25px var(--shadow-hover)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 15px var(--shadow-color)`;
            }}>
              <div style={{ 
                height: '200px', 
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img 
                  src={tour.image} 
                  alt={tour.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h6 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{tour.name}</h6>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ color: 'var(--rating-color)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <img src={starIcon} alt="star" style={{ width: '16px', height: '16px' }} />
                    {tour.rating} ({tour.reviewCount})
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
                    <img src={timeIcon} alt="time" style={{ width: '16px', height: '16px' }} />
                    {tour.duration}
                  </div>
                </div>
                <button 
                  className="tour-book-now-btn" 
                  onClick={() => {
                    if (isAuthenticated) {
                      addToCart({ ...tour, quantity: 1, itemType: 'tour' });
                    } else {
                      navigate('/login'); // Redirect to login if not authenticated
                    }
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <Link to="./tours" style={{ 
          padding: '10px 20px', 
          backgroundColor: 'var(--accent-color)', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-color)'}>
          Explore More
        </Link>
      </section>

      {/* Explore Section with Images */}
      <section style={{ 
        padding: '50px 20px', 
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2>Everything For Your Perfect Trip</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'start' }}>
            {/* Tabs List */}
            <div>
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  style={{ 
                    cursor: 'pointer',
                    padding: '15px',
                    marginBottom: '10px',
                    backgroundColor: activeIndex === index ? 'var(--accent-color)' : 'var(--bg-card)',
                    color: activeIndex === index ? 'white' : 'var(--text-primary)',
                    borderRadius: '5px',
                    border: `1px solid var(--border-color)`,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}
                >
                  <img 
                    src={tab.image} 
                    alt={tab.title}
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      objectFit: 'cover',
                      borderRadius: '5px'
                    }}
                  />
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{tab.title}</h3>
                </div>
              ))}
            </div>

            {/* Tab Content with Image */}
            <div style={{ color: 'var(--text-primary)' }}>
              <h2 style={{ marginBottom: '20px' }}>{tabs[activeIndex].title}</h2>
              <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>{tabs[activeIndex].description}</p>
              <div style={{ 
                height: '250px', 
                borderRadius: '10px', 
                overflow: 'hidden',
                marginTop: '20px'
              }}>
                <img 
                  src={tabs[activeIndex].image} 
                  alt={tabs[activeIndex].title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with User Images */}
      <section style={{ 
        padding: '50px 20px', 
        background: 'var(--bg-primary)', 
        color: 'var(--text-primary)' 
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p>Testimonials</p>
            <h2>What People Have Said About Our Service</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <img 
                  src={tst} 
                  alt="David Malan" 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    marginRight: '15px',
                    border: '3px solid rgba(255,255,255,0.3)'
                  }}
                />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>David Malan</div>
                  <div style={{ opacity: 0.8 }}>Traveler</div>
                </div>
              </div>
              <div style={{ color: 'var(--rating-color)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '1.2rem' }}>★</span>
                <span style={{ fontSize: '1.2rem' }}>★</span>
                <span style={{ fontSize: '1.2rem' }}>★</span>
                <span style={{ fontSize: '1.2rem' }}>★</span>
                <span style={{ fontSize: '1.2rem' }}>★</span>
              </div>
              <p style={{ fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.6' }} className="testimonial-feedback-text">
                "Our trip to the historical city of Lalibela was truly unforgettable. The rock-hewn churches were awe-inspiring, and the local guide provided such deep insights. Touropia made the planning seamless!"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>
                  Touro<span style={{ color: '#f2ea0e' }}>p</span>ia
                </span>
                <span>Jan 20, 2025</span>
              </div>
            </div>
            <div style={{ 
              height: '300px', 
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img 
                src={tstbanner} 
                alt="Testimonial" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                Customer Experience
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
