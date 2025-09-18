import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { contactAPI } from '../../api/axios'; // Adjust path as necessary

const AdminContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await contactAPI.getContactById(id);
        const contactData = res?.data?.data || res?.data?.contact;
        if (contactData) {
          setContact(contactData);
          setResponse(contactData.response || '');
          setStatus(contactData.status || '');
        } else {
          setError('Contact not found');
          toast.error('Contact not found');
        }
      } catch (err) {
        console.error("Error fetching contact details:", err);
        setError(err.response?.data?.message || 'Failed to load contact details');
        toast.error(err.response?.data?.message || 'Failed to load contact details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContact();
    }
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleResponseChange = (e) => {
    setResponse(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactAPI.updateContactStatus(id, { status, response });
      toast.success('Contact inquiry updated successfully!');
      // Optionally navigate back to the contacts list or refresh
      navigate('/admin/contacts'); 
    } catch (err) {
      console.error("Error updating contact inquiry:", err);
      toast.error(err.response?.data?.message || 'Failed to update contact inquiry');
    }
  };

  if (loading) return <p className="text-center mt-4">Loading contact details...</p>;
  if (error) return <p className="text-center mt-4 text-danger">Error: {error}</p>;
  if (!contact) return <p className="text-center mt-4">Contact not found.</p>;

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <h2 className="mb-4 text-center fw-bold text-primary d-flex align-items-center justify-content-center">
        <i className="bi bi-info-circle-fill me-2"></i> Contact Inquiry Details
      </h2>
      <div className="card shadow-lg p-4 mb-4 bg-white rounded">
        <div className="card-body">
          <h5 className="card-title mb-3 fw-bold text-dark">From: {contact.name} (<a href={`mailto:${contact.email}`} className="text-primary text-decoration-none">{contact.email}</a>)</h5>
          <h6 className="card-subtitle mb-3 text-muted">Subject: {contact.subject}</h6>
          <p className="card-text"><strong>Phone:</strong> <a href={`tel:${contact.phone}`} className="text-dark text-decoration-none">{contact.phone}</a></p>
          <p className="card-text"><strong>Message:</strong> <span className="text-muted">{contact.message}</span></p>
          <p className="card-text"><strong>Current Status:</strong> 
            <span className={`badge ms-2
              ${contact.status === 'new' ? 'bg-info' : 
               contact.status === 'in-progress' ? 'bg-warning' : 
               'bg-success'}`}>
              {contact.status}
            </span>
          </p>
          <p className="card-text"><strong>Received At:</strong> {new Date(contact.createdAt).toLocaleString()}</p>
          {contact.respondedBy && <p className="card-text"><strong>Responded By:</strong> {contact.respondedBy}</p>}
          {contact.respondedAt && <p className="card-text"><strong>Responded At:</strong> {new Date(contact.respondedAt).toLocaleString()}</p>}
        </div>
      </div>

      <div className="mt-4 p-4 border rounded shadow-lg bg-white">
        <h4 className="mb-4 fw-bold text-primary">Update Inquiry Status and Response</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="status" className="form-label fw-bold text-dark">Status</label>
            <select
              id="status"
              className="form-select form-select-lg border-secondary rounded-pill px-3"
              value={status}
              onChange={handleStatusChange}
              required
            >
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="response" className="form-label fw-bold text-dark">Response Message</label>
            <textarea
              id="response"
              className="form-control form-control-lg border-secondary rounded-3 px-3"
              rows="5"
              value={response}
              onChange={handleResponseChange}
              placeholder="Enter your response to the inquiry..."
            ></textarea>
          </div>
          <div className="d-grid gap-2 mt-4">
            <button type="submit" className="btn btn-primary btn-lg fw-bold d-flex align-items-center justify-content-center py-2 rounded-pill">
              <i className="bi bi-save me-2"></i> Update Contact
            </button>
            <button type="button" className="btn btn-secondary btn-lg fw-bold d-flex align-items-center justify-content-center py-2 rounded-pill" onClick={() => navigate('/admin/contacts')}>
              <i className="bi bi-arrow-left-circle me-2"></i> Back to Contacts
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminContactDetail;
