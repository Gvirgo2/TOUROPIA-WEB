import React, { useState, useEffect } from 'react';
import { transportAPI } from '../../api/axios'; // Adjust path as necessary
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

const NewTransport = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the transport ID from the URL
  let newId = 1
  const [formData, setFormData] = useState({
    id: id ? id : newId++,
    brand: '',
    model: '',
    category: '',
    transmission: '',
    fuelType: '',
    pickupLocation: '',
    pricePerDay: 0,
    imageUrl: '',
    description: '',
    seatingCapacity: 1,
    isFeatured: true, // Default to true
    status: 'available', // Default status
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchTransport = async () => {
        setLoading(true);
        try {
          const res = await transportAPI.getTransportById(id);
          const transportDataFromAPI = res?.data?.data?.data || {};
          setFormData({
            ...transportDataFromAPI,
          });
        } catch (error) {
          console.error('Error fetching transport for edit:', error);
          toast.error(error.response?.data?.message || 'Failed to load transport for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchTransport();
    }
  }, [id]);

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
      let response;
      if (id) {
        response = await transportAPI.updateTransport(id, formData);
        toast.success('Transport updated successfully!');
      } else {
        response = await transportAPI.createTransport(formData);
        toast.success('Transport created successfully!');
      }
      navigate('/admin/transports', { state: { transportUpdated: true } });
    } catch (error) {
      console.error(id ? 'Error updating transport:' : 'Error creating transport:', error);
      toast.error(error.response?.data?.message || (id ? 'Failed to update transport.' : 'Failed to create transport.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">{id ? 'Edit Transport' : 'Create New Transport'}</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="brand" className="form-label">Brand</label>
            <input
              type="text"
              className="form-control"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="model" className="form-label">Model</label>
            <input
              type="text"
              className="form-control"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="transmission" className="form-label">Transmission</label>
            <select
              className="form-select"
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              required
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="fuelType" className="form-label">Fuel Type</label>
            <select
              className="form-select"
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              required
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="pricePerDay" className="form-label">Price / Day</label>
            <input
              type="number"
              className="form-control"
              id="pricePerDay"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="seatingCapacity" className="form-label">Capacity</label>
            <input
              type="number"
              className="form-control"
              id="seatingCapacity"
              name="seatingCapacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="pickupLocation" className="form-label">Pickup Location</label>
            <input
              type="text"
              className="form-control"
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
        </div>
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
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
            rows="5"
          ></textarea>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update Transport' : 'Create Transport')}
          </button>
        </div>
      </div>
      </form>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
    </div>
  );
};

export default NewTransport;
