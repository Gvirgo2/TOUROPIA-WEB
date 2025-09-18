import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../api/axios'; // Adjust path as necessary
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingAPI.getAllBookings();
      const fetchedBookings = res?.data?.data?.data || res?.data?.data || res?.data || [];
      setBookings(fetchedBookings);
    } catch (err) {
      console.error("Error fetching all bookings:", err);
      setError(err.response?.data?.message || 'Failed to load bookings');
      toast.error(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === '' || booking.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
                          (booking.user?.FirstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (booking.user?.LastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (booking.bookingItem?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (booking.bookingType || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Admin actions for updating booking status (from API spec: PATCH /api/v1/bookings/{id}/status)
  const handleUpdateStatus = async (bookingId, currentStatus) => {
    const newStatus = prompt(`Enter new status for booking ID ${bookingId} (e.g., pending, confirmed, cancelled):`, currentStatus);
    if (newStatus && newStatus.trim() !== '' && newStatus !== currentStatus) {
      try {
        await bookingAPI.updateBookingStatus(bookingId, { status: newStatus });
        toast.success('Booking status updated successfully!');
        fetchBookings(); // Refresh the list
      } catch (err) {
        console.error("Error updating booking status:", err);
        toast.error(err.response?.data?.message || 'Failed to update booking status');
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Loading all bookings...</p>;
  if (error) return <p className="text-center mt-4 text-danger">Error: {error}</p>;

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <h2 className="mb-4 text-center fw-bold text-primary d-flex align-items-center justify-content-center">
        <i className="bi bi-journal-check me-2"></i> All Bookings (Admin)
      </h2>

      <div className="row mb-4 justify-content-between align-items-center g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg border-primary rounded-pill px-3"
            placeholder="Search by user name, item title, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select form-select-lg border-primary rounded-pill px-3"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <p className="text-center fs-5 text-muted">No bookings found matching your criteria.</p>
      ) : (
        <div className="table-responsive p-4 border rounded shadow-lg bg-white">
          <table className="table table-striped table-hover table-bordered caption-top">
            <caption className="text-primary fw-bold">List of all bookings</caption>
            <thead className="table-dark">
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Item</th>
                <th>Start Date</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>{booking.user ? `${booking.user.FirstName || ''} ${booking.user.LastName || ''}`.trim() : 'N/A'}</td>
                  <td>{booking.bookingType}</td>
                  <td>{booking.bookingItem?.title || booking.bookingItem}</td> {/* Display title if populated, else ID */}
                  <td>{new Date(booking.bookingDetails.startDate).toLocaleDateString()}</td>
                  <td>{booking.bookingDetails.quantity}</td>
                  <td>${booking.payment.amount.toFixed(2)} {booking.payment.currency}</td>
                  <td>
                    <span className={`badge ${booking.status === 'pending' ? 'bg-warning text-dark' : booking.status === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="d-flex gap-2">
                    <Link to={`/admin/bookings/${booking._id}`} className="action-icon-btn edit-icon-btn" title="View/Edit Details">
                      <i className="bi bi-eye"></i>
                    </Link>
                    <button 
                      className="action-icon-btn delete-icon-btn" 
                      onClick={() => handleUpdateStatus(booking._id, booking.status)}
                      title="Update Status"
                    >
                      <i className="bi bi-pencil-square"></i>
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

export default AdminBookings;
