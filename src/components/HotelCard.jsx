import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const HotelCard = ({ item, handleDeleteHotel }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="card shadow-lg h-100 border-0 rounded-4 overflow-hidden hotel-card">
      <Link to={`/hotels/${item.id}`} className="text-decoration-none">
        <div className="hotel-card-image-container overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="card-img-top hotel-card-image"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="card-body d-flex flex-column p-4">
        <h5 className="card-title fw-bold mb-2">
          <Link to={`/hotels/${item.id}`} className="text-decoration-none text-primary">
            {item.title}
          </Link>
        </h5>
        <p className="card-text text-muted small mb-2 d-flex align-items-center">
          <i className="bi bi-geo-alt-fill me-1"></i> {item.location}
        </p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-info text-white px-3 py-2 rounded-pill fw-normal">{item.tag}</span>
          <span className="text-warning fw-bold d-flex align-items-center">
            <i className="bi bi-star-fill me-1"></i> {item.rating}
          </span>
        </div>
        <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
          <p className="h5 fw-bold text-success mb-0">
            ${item.price} <small>/night</small>
          </p>
          <div className="d-flex align-items-center">
            <Link to={`/hotels/${item.id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2">
              View Details
            </Link>
            {isAdmin && (
              <Link to={`/admin/hotels/${item.id}`} className="action-icon-btn edit-icon-btn" title="Edit Hotel">
                <i className="bi bi-pencil"></i>
              </Link>
            )}
            {isAdmin && (
              <button
                className="action-icon-btn delete-icon-btn ms-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteHotel(item.id);
                }}
                title="Delete Hotel"
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
