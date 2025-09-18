import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../../api/axios'; // Adjust path as necessary
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { useParams } from 'react-router-dom'; // Import useParams

const NewRestaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    rating: 0,
    price: 0,
    image: '',
    description: '',
    capacity: 0,
    id: '', // New field for client-provided ID
    tag: '', // New field
    oldPrice: 0, // New field
    isFeatured: false, // New field
    status: 'active', // New field
  });
  const [loading, setLoading] = useState(false);

  // Fetch restaurant data if ID is present (for editing)
  useEffect(() => {
    if (id) {
      const fetchRestaurant = async () => {
        try {
          const res = await restaurantAPI.getRestaurantById(id);
          const restaurantData = res?.data?.data?.data || res?.data?.data || res?.data; // Adjust based on actual API response structure
          if (restaurantData) {
            setFormData({
              title: restaurantData.title || '',
              location: restaurantData.location || '',
              rating: restaurantData.rating || 0,
              price: restaurantData.price || 0,
              image: restaurantData.image || '',
              description: restaurantData.description || '',
              capacity: restaurantData.capacity || 0,
              id: id,
              tag: restaurantData.tag || '',
              oldPrice: restaurantData.oldPrice || 0,
              isFeatured: restaurantData.isFeatured || false,
              status: restaurantData.status || 'active',
            });
          }
        } catch (error) {
          console.error('Error fetching restaurant:', error);
          toast.error('Failed to load restaurant data.');
          navigate('/admin/restaurants/new'); // Redirect to create if fetching fails
        }
      };
      fetchRestaurant();
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
        // Update existing restaurant
        await restaurantAPI.updateRestaurant(id, formData); // Use the updateRestaurant API call
        toast.success('Restaurant updated successfully!');
      } else {
        // Create new restaurant
        await restaurantAPI.createRestaurant(formData); // Use the createRestaurant API call
        toast.success('Restaurant created successfully!');
      }
      navigate('/restaurants', { state: { restaurantCreated: true } }); // Pass state to trigger re-fetch
    } catch (error) {
      console.error(id ? 'Error updating restaurant:' : 'Error creating restaurant:', error);
      toast.error(error.response?.data?.message || (id ? 'Failed to update restaurant.' : 'Failed to create restaurant.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" /> {/* Add ToastContainer here */}
      <h2 className="mb-4 text-center">{id ? 'Edit Restaurant' : 'Create New Restaurant'}</h2>
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
            <label htmlFor="id" className="form-label">Restaurant ID</label>
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
          {/* <div className="col-md-6 mb-3">
            <label htmlFor="cuisine" className="form-label">Cuisine</label>
            <input
              type="text"
              className="form-control"
              id="cuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              required
            />
          </div> */}
        </div>
        <div className="row">
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
          <div className="col-md-6 mb-3">
            <label htmlFor="price" className="form-label">Price (Average Meal Cost)</label>
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
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="capacity" className="form-label">Capacity</label>
            <input
              type="number"
              className="form-control"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="tag" className="form-label">Tag (e.g., Fine Dining, Casual)</label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
            />
          </div>
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
        </div>
        <div className="row">
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
          <div className="col-md-6 mb-3">
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
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update Restaurant' : 'Create Restaurant')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRestaurant;
