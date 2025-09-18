import React, { useState, useEffect } from 'react';
import { tourAPI } from '../../api/axios'; // Adjust path as necessary
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import { useAuth } from '../../auth/AuthContext'; // Import useAuth

const NewTour = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the tour ID from the URL
  const { user } = useAuth(); // Get user from AuthContext
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    rating: 0,
    price: 0,
    image: '',
    description: '',
    duration: 0,
    maxGroupSize: 0,
    status: 'active', // Default to active so it shows in the tour list
    createdBy: user?._id || '', // Set createdBy to the logged-in user's ID
    guests: 1, // Default number of guests
    id: Date.now(), // Set id to a numeric value for new tours
    oldPrice: 0, // Default old price
    isFeatured: false, // Default to not featured
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  useEffect(() => {
    if (id) {
      const fetchTour = async () => {
        setLoading(true);
        try {
          console.log('Fetching tour with ID:', id);
          const res = await tourAPI.getTourById(id);
          console.log('API response for tour:', res);
          const tourDataFromAPI = res?.data?.data?.data || {}; // Correctly access the deepest nested data
          console.log('Extracted and flattened tourData from API:', tourDataFromAPI);

          setFormData({
            // Explicitly ensure correct types and provide fallbacks, replacing the entire state
            id: Number(tourDataFromAPI.id) || 0, // Ensure id is a number
            title: tourDataFromAPI.title || '',
            location: tourDataFromAPI.location || '',
            type: tourDataFromAPI.type || '',
            rating: Number(tourDataFromAPI.rating || 0),
            price: Number(tourDataFromAPI.price || 0),
            image: tourDataFromAPI.image || '',
            description: tourDataFromAPI.description || '',
            duration: Number(tourDataFromAPI.duration || 0),
            maxGroupSize: Number(tourDataFromAPI.maxGroupSize || 0),
            guests: Number(tourDataFromAPI.guests || 1),
            oldPrice: Number(tourDataFromAPI.oldPrice || 0),
            isFeatured: !!tourDataFromAPI.isFeatured,
            status: tourDataFromAPI.status || 'active',
            createdBy: tourDataFromAPI.createdBy || user?._id || '',
          });
          console.log('Updated formData after fetch:', formData);
        } catch (error) {
          console.error('Error fetching tour for edit:', error);
          toast.error(error.response?.data?.message || 'Failed to load tour for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchTour();
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (id) {
        const { id: _, ...dataToUpdate } = formData; // Exclude 'id' for update operations
        console.log('Attempting to update tour with data:', dataToUpdate);
        response = await tourAPI.updateTour(id, dataToUpdate); // Use updateTour API call
        toast.success('Tour updated successfully!');
      } else {
        console.log('Attempting to create tour with data:', formData);
        response = await tourAPI.createTour(formData); // Use the createTour API call
        toast.success('Tour created successfully!');
      }
      console.log('Tour operation successful, response:', response);
      navigate('/tours', { state: { tourCreated: true } }); // Pass state to trigger re-fetch
    } catch (error) {
      console.error(id ? 'Error updating tour:' : 'Error creating tour:', error);
      toast.error(error.response?.data?.message || (id ? 'Failed to update tour.' : 'Failed to create tour.'));
    } finally {
      console.log('Finished tour operation attempt.');
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">{id ? 'Edit Tour' : 'Create New Tour'}</h2>
      {console.log('Rendering formData:', formData)} {/* Add this line for debugging */}
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
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="type" className="form-label">Type</label>
            <input
              type="text"
              className="form-control"
              id="type"
              name="type"
              value={formData.type}
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
            <label htmlFor="price" className="form-label">Price</label>
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
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="duration" className="form-label">Duration (days)</label>
            <input
              type="number"
              className="form-control"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="maxGroupSize" className="form-label">Max Group Size</label>
            <input
              type="number"
              className="form-control"
              id="maxGroupSize"
              name="maxGroupSize"
              value={formData.maxGroupSize}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="guests" className="form-label">Number of Guests</label>
            <input
              type="number"
              className="form-control"
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="col-md-6 mb-3 form-check d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isFeatured">Is Featured</label>
          </div>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update Tour' : 'Create Tour')}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" /> {/* Add ToastContainer */}
    </div>
  );
};

export default NewTour;
