import React, { useState, useEffect } from 'react';
import { hotelAPI } from '../../api/axios'; // Adjust path as necessary
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'; // Import useParams
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const NewHotel = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    rating: 0,
    reviews: [], // Changed to an empty array
    price: 0,
    tag: '',
    image: '',
    description: '',
    amenities: '',
    oldPrice: 0, // New field
    isFeatured: false, // New field
    status: 'active', // New field
    id: '', // New field for client-provided ID
  });
  const [loading, setLoading] = useState(false);

  // Fetch hotel data if ID is present (for editing)
  useEffect(() => {
    if (id) {
      const fetchHotel = async () => {
        try {
          const res = await hotelAPI.getHotelById(id);
          const hotelData = res?.data?.data?.data || res?.data?.data || res?.data; // Adjust based on actual API response structure
          if (hotelData) {
            setFormData({
              title: hotelData.title || '',
              location: hotelData.location || '',
              rating: hotelData.rating || 0,
              reviews: hotelData.reviews || [], // Map reviews
              price: hotelData.price || 0,
              tag: hotelData.tag || '',
              image: hotelData.image || '',
              description: hotelData.description || '',
              amenities: Array.isArray(hotelData.amenities) ? hotelData.amenities.join(', ') : hotelData.amenities || '',
              oldPrice: hotelData.oldPrice || 0, // Map oldPrice
              isFeatured: hotelData.isFeatured || false, // Map isFeatured
              status: hotelData.status || 'active', // Map status
              id: id, // Set the ID from the URL
            });
          }
        } catch (error) {
          console.error('Error fetching hotel:', error);
          toast.error('Failed to load hotel data.');
          navigate('/admin/hotels/new'); // Redirect to create if fetching fails
        }
      };
      fetchHotel();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        // Update existing hotel
        await hotelAPI.updateHotel(id, formData); // Use the updateHotel API call
        toast.success('Hotel updated successfully!');
      } else {
        // Create new hotel
        await hotelAPI.createHotel(formData); // Use the createHotel API call
        toast.success('Hotel created successfully!');
      }
      navigate('/hotels', { state: { hotelCreated: true } }); // Pass state to trigger re-fetch
    } catch (error) {
      console.error(id ? 'Error updating hotel:' : 'Error creating hotel:', error);
      toast.error(error.response?.data?.message || (id ? 'Failed to update hotel.' : 'Failed to create hotel.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" /> {/* Add ToastContainer here */}
      <h2 className="mb-4 text-center">{id ? 'Edit Hotel' : 'Create New Hotel'}</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="id" className="form-label">Hotel ID</label>
            <input
              type="number"
              className="form-control"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="rating" className="form-label">Rating</label>
            <input
              type="number"
              className="form-control"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="price" className="form-label">Price Per Night</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="tag" className="form-label">Tag (e.g., Luxury, Budget)</label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="oldPrice" className="form-label">Old Price (Optional)</label>
            <input
              type="number"
              className="form-control"
              id="oldPrice"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="col-md-6 mb-3 d-flex align-items-end">
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              />
              <label className="form-check-label" htmlFor="isFeatured">Is Featured</label>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-control"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5" // Increased rows
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="amenities" className="form-label">Amenities (comma-separated)</label>
          <textarea // Changed to textarea for better input for comma-separated values
            className="form-control"
            id="amenities"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            rows="3" // Adjusted rows
          ></textarea>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update Hotel' : 'Create Hotel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewHotel;
