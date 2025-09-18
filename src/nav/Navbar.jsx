import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import ThemeToggle from '../pages/ThemeToggle';
import { CartContext } from '../context/CartContext'; // Import CartContext

const Navbar = ({ toggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, bookingCount } = useContext(CartContext); // Get cartCount and bookingCount from CartContext
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navQuery, setNavQuery] = useState("");
  const [showAdminDropdown, setShowAdminDropdown] = useState(false); // New state for admin dropdown
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    setShowAdminDropdown(false); // Close admin dropdown when mobile menu is toggled
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
    setShowAdminDropdown(false); // Close admin dropdown when any menu item is clicked
  };

  const toggleAdminDropdown = () => {
    setShowAdminDropdown(prev => !prev);
    setIsMenuOpen(false); // Close mobile menu if admin dropdown is toggled
  };

  const performSearch = () => {
    const q = navQuery.trim();
    navigate(q ? `/tours?destination=${encodeURIComponent(q)}` : '/tours');
    closeMenu();
  };

  const handleNavSearchKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  };

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <>
      <nav className='text-white p-0 navbar navbar-expand-lg flex-column' style={{ backgroundColor: '#23A16F' }}>
        <div className="container d-flex align-items-center justify-content-center">
          <div className="row w-100 py-3" style={{ borderBottom: '1px solid #065e34ff' }}>
            <div className="col-lg-12">
              <div className="w-100 top-header d-flex align-items-center justify-content-between">
                <div className="call d-none d-lg-flex align-items-center">
                  <span className="bi bi-telephone me-3" style={{ backgroundColor: '#23A16F' }}></span>
                  <div className="call-text">
                    <p className="m-0">Call Anytime</p>
                    <h4 className="f5-6 m-0 fw-semibold"> (251) +00-00-00-00</h4>
                  </div>
                </div>
                <div className="logo">
                  <h1 className='p-0 m-0 text-uppercase fw-semibold'>
                    <Link to="/" className='text-white text-decoration-none navbar-brand fs-2 m-0'>
                      Tour<span style={{ color: '#f2ea0eff' }}>o</span>pia
                    </Link>
                  </h1>
                </div>
                <div className="top-header-right d-none d-lg-flex align-items-center gap-4">
                  {/* <div className="lang d-flex align-items-center gap-2 fs-6">
                    <span className="ri-global-line"></span>
                    <p className="m-0">English</p>
                  </div> */}
                  <div className="divider gradient-divider"></div>

                  <Link to="/cart" className='cartpage-cart-link position-relative text-white text-decoration-none'>
                    <i className="bi bi-cart-fill text-white fs-5"></i>
                    <span className="cart-count position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  </Link>
                  
                  {/* Bookings Link */}
                  {/* Removed Bookings Link */}

                  {isAuthenticated ? (
                    <div className="d-flex align-items-center gap-3">
                      <span className="text-white">Welcome, {user?.role === 'admin' ? 'Admin' : user?.FirstName || 'User'}</span>
                      {/* Removed Profile, My Bookings, My Reviews links - now in sidebar */}
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-3">
                      <Link to="/signup" className="btn btn-outline-light rounded-5 px-4 py-2 fs-6 fw-semibold text-decoration-none d-flex align-items-center justify-content-center">
                        sign up
                      </Link>
                      <Link to="/login" className="btn btn-outline-light rounded-5 px-4 py-2 fs-6 fw-semibold text-decoration-none d-flex align-items-center justify-content-center">
                        Login
                      </Link>
                    </div>
                  )}
                  
                  <div className="d-flex align-items-center">
                    <ThemeToggle />
                  </div>
                  {/* Admin Profile Icon */}
                  {isAuthenticated && user?.role === 'admin' && (
                    <button 
                      className="btn btn-outline-light rounded-5 px-4 py-2 fs-6 fw-semibold text-decoration-none d-flex align-items-center justify-content-center"
                      onClick={toggleSidebar} // Call toggleSidebar prop
                    >
                      <i className="bi bi-person-circle fs-5"></i>
                    </button>
                  )}
                  {/* Add a button to toggle the user sidebar */}
                  {isAuthenticated && user?.role !== 'admin' && (
                    <button 
                      className="btn btn-outline-light rounded-5 px-4 py-2 fs-6 fw-semibold text-decoration-none d-flex align-items-center justify-content-center"
                      onClick={toggleSidebar} // Call toggleSidebar prop
                    >
                      <i className="bi bi-person-circle fs-5"></i>
                    </button>
                  )}
                </div>

                <button
                  className="navbar-toggler nav-toggle d-block d-lg-none box-shadow-none"
                  type="button"
                  onClick={toggleMenu}
                  aria-label='Toggle navigation'
                >
                  <span className="bi bi-list fs-1 text-white"></span>
                </button>
              </div>
            </div>    
          </div>
        </div>
        
        <div className="container">
          <div className="row py-0 py-lg-4 w-100 d-flex align-items-center">
            <div className="col-lg-9">
              <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ""}`} id='navtoggle'>
                <ul className="nav-menu list-unstyled m-0 d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 gap-xl-5 gap-lg-4">
                  {/* Admin Panel Dropdown for desktop */}
                  {isAuthenticated && user?.role === 'admin' && (
                    <li className="nav-item dropdown position-relative d-none d-lg-block">
                      <button
                        className="nav-link text-white text-decoration-none dropdown-toggle"
                        onClick={toggleAdminDropdown}
                        id="adminDropdown"
                        aria-expanded={showAdminDropdown}
                      >
                        <i className="bi bi-gear-fill me-2"></i>Admin Panel
                      </button>
                      <ul className={`dropdown-menu dropdown-menu-dark animate slideIn py-2 ${showAdminDropdown ? 'show' : ''}`} aria-labelledby="adminDropdown" style={{ backgroundColor: '#065e34ff' }}>
                        <li><Link to="/admin/users" className="dropdown-item text-white" onClick={closeMenu}><i className="bi bi-people me-2"></i>Users</Link></li>
                        <li><Link to="/admin/news/new" className="dropdown-item text-white" onClick={closeMenu}><i className="bi bi-newspaper me-2"></i>News</Link></li>
                        <li><Link to="/admin/hotels/new" className="dropdown-item text-white" onClick={closeMenu}><i className="bi bi-hospital me-2"></i>Hotels</Link></li>
                        <li><Link to="/admin/restaurants/new" className="dropdown-item text-white" onClick={closeMenu}><i className="bi bi-person-workspace me-2"></i>Restaurants</Link></li>
                        <li><Link to="/admin/tours/new" className="dropdown-item text-white" onClick={closeMenu}><i className="bi bi-geo-alt-fill me-2"></i>Tours</Link></li>
                        <li><Link to="/admin/transports/new" className="dropdown-item text-white" onClick={closeMenu}><i className="bi bi-bus-front me-2"></i>Transports</Link></li>
                        <li><Link to="/admin/contacts" className="dropdown-item text-white" onClick={closeMenu}><i className="bi bi-envelope-fill me-2"></i>Contacts</Link></li>
                        <li><Link to="/admin/bookings" className="dropdown-item text-white" onClick={closeMenu}><i className="bi bi-journal-check me-2"></i>Bookings</Link></li>
                        <li><Link to="/admin/reviews" className="dropdown-item text-white" onClick={closeMenu}><i className="bi bi-stars me-2"></i>Reviews</Link></li>
                      </ul>
                    </li>
                  )}

                  {/* Admin links for mobile only (if admin) */}
                  {isAuthenticated && user?.role === 'admin' && (
                    <>
                      <li className="nav-items position-relative d-lg-none">
                        <Link to="/admin/users" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Users</Link>
                      </li>
                      <li className="nav-items position-relative d-lg-none">
                        <Link to="/admin/news/new" className='nav-link text-white text-decoration-none' onClick={closeMenu}>News</Link>
                      </li>
                      <li className="nav-items position-relative d-lg-none">
                        <Link to="/admin/hotels/new" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Hotels</Link>
                      </li>
                      <li className="nav-items position-relative d-lg-none">
                        <Link to="/admin/restaurants/new" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Restaurants</Link>
                      </li>
                      <li className="nav-items position-relative d-lg-none">
                        <Link to="/admin/tours/new" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Tours</Link>
                      </li>
                      <li className="nav-items position-relative d-lg-none">
                        <Link to="/admin/transports/new" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Transports</Link>
                      </li>
                      <li className="nav-items position-relative d-lg-none">
                        <Link to="/admin/contacts" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Contacts</Link>
                      </li>
                      <li className="nav-items position-relative d-lg-none">
                        <Link to="/admin/bookings" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Bookings</Link>
                      </li>
                    </>
                  )}
                  <li className="nav-items position-relative">
                    <Link to="/" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Home</Link>
                  </li>
                  <li className="nav-items position-relative">
                    <Link to="/tours" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Tours</Link>
                  </li>
                  <li className="nav-items position-relative">
                    <Link to="/hotels" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Hotels</Link>
                  </li>
                  <li className="nav-items position-relative">
                    <Link to="/transports" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Transports</Link>
                  </li>
                  <li className="nav-items position-relative">
                    <Link to="/restaurants" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Restaurants</Link>
                  </li>
                  <li className="nav-items position-relative">
                    <Link to="/about" className='nav-link text-white text-decoration-none' onClick={closeMenu}>About</Link>
                  </li>
                  <li className="nav-items position-relative">
                    <Link to="/news" className='nav-link text-white text-decoration-none' onClick={closeMenu}>News</Link>
                  </li>
                  
                  {/* Conditional Contact/Admin Contacts for non-admin on desktop and all on mobile */}
                  {(!isAuthenticated || user?.role !== 'admin') && (
                    <li className="nav-items position-relative d-lg-block">
                      <Link to="/contact" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Contact</Link>
                    </li>
                  )}

                  {/*isAuthenticated && (
                    <li className="nav-items position-relative">
                      <Link to="/dashboard" className='nav-link text-white text-decoration-none' onClick={closeMenu}>Dashboard</Link>
                    </li>
                  )*/}

                  {/* Mobile search input */}
                  <li className="nav-items w-100 d-lg-none">
                    <form className="d-flex align-items-center gap-2" onSubmit={handleNavSearchSubmit}>
                      <input
                        type="text"
                        className='form-control form-control-sm'
                        placeholder='Search destinations'
                        value={navQuery}
                        onChange={(e) => setNavQuery(e.target.value)}
                      />
                      <button type="submit" className="btn btn-light btn-sm">Search</button>
                    </form>
                  </li>

                  <li className="nav-items position-relative d-lg-none">
                    <div className="d-flex justify-content-center mt-3">
                      <ThemeToggle />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="nav-input-box w-100 d-none d-lg-flex align-items-center justify-content-start gap-2">
                <i className="bi bi-search text-white"></i>
                <input
                  type="text"
                  className='form-control form-control-sm w-100'
                  placeholder='Search destinations'
                  value={navQuery}
                  onChange={(e) => setNavQuery(e.target.value)}
                  onKeyDown={handleNavSearchKey}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar; 