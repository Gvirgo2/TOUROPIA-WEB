import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminBookingDetail = () => {
  const { id } = useParams(); // Get booking ID from URL
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      if (!isAuthenticated || !user) {
        toast.error("You must be logged in to view booking details.");
        setLoading(false);
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await bookingAPI.getBookingById(id);
        const fetchedBooking = res?.data?.data || res?.data; // Adjust based on API response structure

        // Access control: Only owner or admin can view
        if (fetchedBooking.user?._id !== user._id && user.role !== 'admin') {
          toast.error("You do not have permission to view this booking.");
          navigate(-1); // Go back to previous page
          return;
        }

        setBooking(fetchedBooking);
        setNewStatus(fetchedBooking.status);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(err.response?.data?.message || 'Failed to load booking details.');
        toast.error(err.response?.data?.message || 'Failed to load booking details.');
        // Optionally redirect if booking not found or forbidden
        if (err.response?.status === 404) {
          navigate('/admin/bookings', { replace: true });
        } else if (err.response?.status === 403) {
          navigate(-1); 
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id, user, isAuthenticated, navigate]);

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleSubmitStatusUpdate = async () => {
    if (!newStatus || newStatus === booking.status) return;

    try {
      await bookingAPI.updateBookingStatus(id, { status: newStatus });
      toast.success('Booking status updated successfully!');
      setBooking(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  if (loading) return <p className="text-center mt-4">Loading booking details...</p>;
  if (error) return <p className="text-center mt-4 text-danger">Error: {error}</p>;
  if (!booking) return <p className="text-center mt-4">Booking not found.</p>;

  // Helper to format date
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Booking Details: {booking._id}</h2>
        <Link to="/admin/bookings" className="btn btn-secondary"><i className="bi bi-arrow-left me-2"></i> Back to Bookings</Link>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          Booking Information
        </div>
        <div className="card-body">
          <p><strong>Booking ID:</strong> {booking._id}</p>
          <p><strong>User:</strong> {booking.user ? `${booking.user.FirstName || ''} ${booking.user.LastName || ''}`.trim() : 'N/A'} ({booking.user?.email || 'N/A'})</p>
          <p><strong>Booking Type:</strong> {booking.bookingType}</p>
          <p><strong>Booked Item:</strong> {booking.bookingItem?.title || booking.bookingItem}</p>
          <p><strong>Status:</strong> 
            <span className={`badge ms-2 ${booking.status === 'pending' ? 'bg-warning text-dark' : booking.status === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>
              {booking.status}
            </span>
          </p>
          <p><strong>Created At:</strong> {formatDate(booking.createdAt)}</p>
          <p><strong>Last Updated:</strong> {formatDate(booking.updatedAt)}</p>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          Booking Specifics
        </div>
        <div className="card-body">
          <p><strong>Start Date:</strong> {formatDate(booking.bookingDetails.startDate)}</p>
          {booking.bookingDetails.endDate && <p><strong>End Date:</strong> {formatDate(booking.bookingDetails.endDate)}</p>}
          <p><strong>Quantity (Adults/Guests):</strong> {booking.bookingDetails.quantity}</p>
          {booking.bookingDetails.participants && booking.bookingDetails.participants.length > 0 && (
            <p><strong>Participants:</strong> {booking.bookingDetails.participants.map(p => p.name).join(', ')}</p>
          )}
          {booking.bookingDetails.roomType && <p><strong>Room Type:</strong> {booking.bookingDetails.roomType}</p>}
          {booking.bookingDetails.route && <p><strong>Route:</strong> {booking.bookingDetails.route}</p>}
          {booking.bookingDetails.departureTime && <p><strong>Departure Time:</strong> {booking.bookingDetails.departureTime}</p>}
          {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-warning text-dark">
          Contact Information
        </div>
        <div className="card-body">
          <p><strong>Full Name:</strong> {booking.contactInfo.fullName}</p>
          <p><strong>Email:</strong> {booking.contactInfo.email}</p>
          <p><strong>Phone:</strong> {booking.contactInfo.phone}</p>
          {booking.contactInfo.alternativePhone && <p><strong>Alternative Phone:</strong> {booking.contactInfo.alternativePhone}</p>}
          {booking.contactInfo.address && <p><strong>Address:</strong> {booking.contactInfo.address}</p>}
          {booking.contactInfo.city && <p><strong>City:</strong> {booking.contactInfo.city}</p>}
          {booking.contactInfo.country && <p><strong>Country:</strong> {booking.contactInfo.country}</p>}
          {booking.contactInfo.zipCode && <p><strong>Zip Code:</strong> {booking.contactInfo.zipCode}</p>}
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white">
          Payment Details
        </div>
        <div className="card-body">
          <p><strong>Amount:</strong> ${booking.payment.amount.toFixed(2)} {booking.payment.currency}</p>
          <p><strong>Method:</strong> {booking.payment.paymentMethod}</p>
          <p><strong>Status:</strong> {booking.payment.paymentStatus}</p>
          <p><strong>Transaction ID:</strong> {booking.payment.transactionId}</p>
          <p><strong>Payment Date:</strong> {formatDate(booking.payment.paymentDate)}</p>
        </div>
      </div>

      {(user?.role === 'admin' || booking.user?._id === user?._id) && booking.status !== 'cancelled' && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-dark text-white">
            Update Booking Status
          </div>
          <div className="card-body d-flex align-items-center">
            <select 
              className="form-select me-2" 
              style={{ maxWidth: '200px' }}
              value={newStatus}
              onChange={handleStatusChange}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button 
              className="btn btn-primary" 
              onClick={handleSubmitStatusUpdate}
              disabled={newStatus === booking.status}
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingDetail;
