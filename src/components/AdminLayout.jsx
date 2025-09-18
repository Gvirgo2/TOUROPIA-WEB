import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure Bootstrap Icons are imported

const AdminLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div 
        className="bg-dark text-white p-3" 
        style={{ width: '250px', flexShrink: 0 }}
      >
        <h4 className="mb-4 text-center text-uppercase fw-bold text-success d-flex align-items-center justify-content-center border-bottom pb-3 mb-3" style={{ letterSpacing: '1px' }}>
          <i className="bi bi-gear-fill me-2"></i> Admin Panel
        </h4>
        <ul className="nav nav-pills flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin/users" className="nav-link text-white d-flex align-items-center py-2 px-3 rounded-md transition-colors duration-200 hover:bg-success hover:text-white" style={{ borderRadius: '0.375rem' }}>
              <i className="bi bi-people me-2"></i>
              Users
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/news/new" className="nav-link text-white d-flex align-items-center py-2 px-3 rounded-md transition-colors duration-200 hover:bg-success hover:text-white" style={{ borderRadius: '0.375rem' }}>
              <i className="bi bi-newspaper me-2"></i>
              News
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/hotels/new" className="nav-link text-white d-flex align-items-center py-2 px-3 rounded-md transition-colors duration-200 hover:bg-success hover:text-white" style={{ borderRadius: '0.375rem' }}>
              <i className="bi bi-hospital me-2"></i>
              Hotels
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/restaurants/new" className="nav-link text-white d-flex align-items-center py-2 px-3 rounded-md transition-colors duration-200 hover:bg-success hover:text-white" style={{ borderRadius: '0.375rem' }}>
              <i className="bi bi-person-workspace me-2"></i>
              Restaurants
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/tours/new" className="nav-link text-white d-flex align-items-center py-2 px-3 rounded-md transition-colors duration-200 hover:bg-success hover:text-white" style={{ borderRadius: '0.375rem' }}>
              <i className="bi bi-geo-alt-fill me-2"></i>
              Tours
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/transports/new" className="nav-link text-white d-flex align-items-center py-2 px-3 rounded-md transition-colors duration-200 hover:bg-success hover:text-white" style={{ borderRadius: '0.375rem' }}>
              <i className="bi bi-bus-front me-2"></i>
              Transports
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/contacts" className="nav-link text-white d-flex align-items-center py-2 px-3 rounded-md transition-colors duration-200 hover:bg-success hover:text-white" style={{ borderRadius: '0.375rem' }}>
              <i className="bi bi-envelope-fill me-2"></i>
              Contacts
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/bookings" className="nav-link text-white d-flex align-items-center py-2 px-3 rounded-md transition-colors duration-200 hover:bg-success hover:text-white" style={{ borderRadius: '0.375rem' }}>
              <i className="bi bi-journal-check me-2"></i>
              Bookings
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/reviews" className="nav-link text-white d-flex align-items-center py-2 px-3 rounded-md transition-colors duration-200 hover:bg-success hover:text-white" style={{ borderRadius: '0.375rem' }}>
              <i className="bi bi-star-half me-2"></i>
              Reviews
            </Link>
          </li>
          {/* Add more admin links as needed */}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
        <Outlet /> {/* This is where the nested routes will render */}
      </div>
    </div>
  );
};

export default AdminLayout;
