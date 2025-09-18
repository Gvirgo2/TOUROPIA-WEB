import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext'; // Import CartContext to get bookingCount

const UserSidebar = ({ isOpen, toggleSidebar }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { bookingCount } = useContext(CartContext); // Get bookingCount

  const handleLogout = () => {
    logout();
    toggleSidebar(); // Close sidebar on logout
  };

  if (!isAuthenticated) return null; // Don't render if not authenticated

  return (
    <div className={`offcanvas offcanvas-start ${isOpen ? 'show' : ''}`} tabIndex="-1" id="userSidebar" aria-labelledby="userSidebarLabel" data-bs-backdrop="false" data-bs-scroll="true">
      <div className="offcanvas-header bg-primary text-white">
        <h5 className="offcanvas-title" id="userSidebarLabel">
          <i className="bi bi-person-circle me-2"></i>Welcome, {user?.FirstName || 'User'}
        </h5>
        <button type="button" className="btn-close btn-close-white text-reset" onClick={toggleSidebar} aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <Link to="/profile" className="text-decoration-none text-dark fs-5 py-2 d-block" onClick={toggleSidebar}>
              <i className="bi bi-person me-3"></i>Profile
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/my-bookings" className="text-decoration-none text-dark fs-5 py-2 d-flex align-items-center justify-content-between" onClick={toggleSidebar}>
              <span><i className="bi bi-journal-check me-3"></i>My Bookings</span>
              {bookingCount > 0 && (
                <span className="badge bg-danger rounded-pill">{bookingCount}</span>
              )}
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/my-reviews" className="text-decoration-none text-dark fs-5 py-2 d-block" onClick={toggleSidebar}>
              <i className="bi bi-chat-left-text me-3"></i>My Reviews
            </Link>
          </li>
          {user?.role === 'admin' && (
            <li className="list-group-item bg-light">
              <Link to="/admin" className="text-decoration-none text-primary fw-bold fs-5 py-2 d-block" onClick={toggleSidebar}>
                <i className="bi bi-gear-fill me-3"></i>Admin Dashboard
              </Link>
            </li>
          )}
          <li className="list-group-item">
            <button onClick={handleLogout} className="btn btn-danger w-100 mt-3 d-flex align-items-center justify-content-center">
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserSidebar;
