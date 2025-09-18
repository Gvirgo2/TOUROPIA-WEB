import React, { useState, useEffect } from 'react';
import { transportAPI } from '../../api/axios'; // Adjust path as necessary
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const AdminTransports = () => {
  console.log('AdminTransports component rendered');
  const [transports, setTransports] = useState([]);
  const [filteredTransports, setFilteredTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    console.log('AdminTransports useEffect triggered for initial fetch.');
    fetchTransports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterType, transports]);

  const fetchTransports = async () => {
    setLoading(true);
    try {
      console.log('Attempting to fetch all transports...');
      const res = await transportAPI.getAllTransports();
      console.log('API response for all transports:', res);
      const fetchedTransports = res?.data?.data?.data || res?.data?.data || res?.data || [];
      console.log('Normalized fetched transports:', fetchedTransports);
      setTransports(fetchedTransports);
      setFilteredTransports(fetchedTransports);
    } catch (err) {
      console.error('Error fetching transports:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to load transports.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...transports];

    if (filterType) {
      results = results.filter(transport =>
        transport.type.toLowerCase() === filterType.toLowerCase()
      );
    }

    if (searchTerm) {
      results = results.filter(transport =>
        (transport.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transport.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transport.category || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredTransports(results);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transport?')) {
      try {
        await transportAPI.deleteTransport(id);
        toast.success('Transport deleted successfully!');
        fetchTransports(); // Re-fetch list to update UI
      } catch (err) {
        console.error('Error deleting transport:', err);
        toast.error(err.response?.data?.message || 'Failed to delete transport.');
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Loading transports...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;

  return (
    <div className="admin-transports-page">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Transport Management</h2>
        <Link to="/admin/transports/new" className="btn btn-success d-flex align-items-center">
          <i className="bi bi-plus-circle-fill me-2"></i> Add New Transport
        </Link>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by brand, model, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="car">Car</option>
            <option value="bus">Bus</option>
            <option value="flight">Flight</option>
            <option value="train">Train</option>
            <option value="boat">Boat</option>
          </select>
        </div>
      </div>

      {filteredTransports.length === 0 ? (
        <p className="text-center">No transports found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Category</th>
                <th>Transmission</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransports.map((transport) => (
                <tr key={transport._id || transport.id}>
                  <td>
                    <img
                      src={transport.imageUrl || 'https://via.placeholder.com/50'}
                      alt={transport.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </td>
                  <td>{transport.brand}</td>
                  <td>{transport.model}</td>
                  <td>{transport.category}</td>
                  <td>{transport.transmission}</td>
                  <td>${transport.pricePerDay}</td>
                  <td>
                    <Link to={`/admin/transports/${transport._id || transport.id}`} className="ms-2 action-icon-btn edit-icon-btn">
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button onClick={() => handleDelete(transport._id || transport.id)} className="ms-2 action-icon-btn delete-icon-btn">
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTransports;
