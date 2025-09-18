import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const AngledCard = ({ item, handleDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const itemType = item.type || item.tag || item.cuisine; // Determine item type

  return (
    <div className="angled-card shadow-lg rounded-4">
      <div className="angled-card-image-container">
        <Link to={`/${item.type ? 'tours' : item.tag ? 'hotels' : 'restaurants'}/${item.id}`} className="text-decoration-none">
          <img
            src={item.image}
            alt={item.title}
            className="angled-card-image"
            loading="lazy"
          />
        </Link>
      </div>
      <div className="angled-card-content">
        <div>
          <h5 className="card-title fw-bold">
            <Link to={`/${item.type ? 'tours' : item.tag ? 'hotels' : 'restaurants'}/${item.id}`} className="text-decoration-none text-primary">
              {item.title}
            </Link>
          </h5>
          <p className="text-muted small d-flex align-items-center mb-2">
            <i className="bi bi-geo-alt-fill me-1"></i> {item.location}
          </p>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className={`badge ${item.type ? 'bg-success' : item.tag ? 'bg-info' : 'bg-warning'} text-white px-3 py-2 rounded-pill fw-normal`}>{itemType}</span>
            <span className="text-warning fw-bold d-flex align-items-center">
              {'⭐'.repeat(Math.round(item.rating))}
              <span className="ms-1 text-muted fw-normal">({item.rating}/5)</span>
            </span>
          </div>
        </div>
        <div className="action-buttons">
          <p className="h5 fw-bold text-success mb-0 me-3">
            ${item.price} {item.type ? '' : item.tag ? '/night' : '/meal'}
          </p>
          <Link to={`/${item.type ? 'tours' : item.tag ? 'hotels' : 'restaurants'}/${item.id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2">
            View Details
          </Link>
          {isAdmin && (
            <Link to={`/admin/${item.type ? 'tours' : item.tag ? 'hotels' : 'restaurants'}/${item.id}`} className="action-icon-btn edit-icon-btn" title="Edit">
              <i className="bi bi-pencil"></i>
            </Link>
          )}
          {isAdmin && (
            <button
              className="action-icon-btn delete-icon-btn ms-2"
              onClick={(e) => {
                e.preventDefault();
                handleDelete(item.id);
              }}
              title="Delete"
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AngledCard;
