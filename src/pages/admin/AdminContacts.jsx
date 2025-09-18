import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { contactAPI } from '../../api/axios'; // Adjust path as necessary

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState(''); // New state for status filter
  const [searchTerm, setSearchTerm] = useState('');     // New state for general search
  const navigate = useNavigate();

  // Derived state for filtered contacts
  const filteredContacts = Array.isArray(contacts) ? contacts.filter(contact => {
    const matchesStatus = filterStatus === '' || contact.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
                          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) : [];

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await contactAPI.getAllContacts();
      console.log("AdminContacts.jsx: Raw API response for contacts:", res);
      const contactsData = res?.data?.data?.data || res?.data?.data || res?.data?.contacts || res?.data?.results || [];
      setContacts(contactsData);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError(err.response?.data?.message || 'Failed to load contacts');
      toast.error(err.response?.data?.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUpdateStatus = async (contactId, currentStatus) => {
    const newStatus = prompt(`Enter new status for contact ID ${contactId} (e.g., new, in-progress, resolved):`, currentStatus);
    if (newStatus && newStatus.trim() !== '' && newStatus !== currentStatus) {
      try {
        await contactAPI.updateContactStatus(contactId, { status: newStatus });
        toast.success('Contact status updated successfully!');
        fetchContacts(); // Refresh the list
      } catch (err) {
        console.error("Error updating contact status:", err);
        toast.error(err.response?.data?.message || 'Failed to update contact status');
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Loading contacts...</p>;
  if (error) return <p className="text-center mt-4 text-danger">Error: {error}</p>;

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <h2 className="mb-4 text-center fw-bold text-primary d-flex align-items-center justify-content-center">
        <i className="bi bi-envelope-fill me-2"></i> Contact Inquiries
      </h2>

      <div className="row mb-4 justify-content-between align-items-center g-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg border-primary rounded-pill px-3"
            placeholder="Search by name, email, or subject..."
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
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <p className="text-center fs-5 text-muted">No contact inquiries found matching your criteria.</p>
      ) : (
        <div className="table-responsive p-4 border rounded shadow-lg bg-white">
          <table className="table table-striped table-hover table-bordered caption-top">
            <caption className="text-primary fw-bold">List of all contact inquiries</caption>
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.subject}</td>
                  <td>
                    <span className={`badge 
                      ${contact.status === 'new' ? 'bg-info' : 
                       contact.status === 'in-progress' ? 'bg-warning' : 
                       'bg-success'}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td className="d-flex gap-2">
                    <Link to={`${contact._id}`} className="action-icon-btn edit-icon-btn" title="View Details">
                      <i className="bi bi-eye"></i>
                    </Link>
                    <button 
                      className="action-icon-btn delete-icon-btn" 
                      onClick={() => handleUpdateStatus(contact._id, contact.status)}
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

export default AdminContacts;
