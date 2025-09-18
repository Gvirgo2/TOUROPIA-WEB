import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authAPI } from '../../api/axios';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    FirstName: '',
    LastName: '',
    email: '',
    role: 'user',
    isVerified: false,
    active: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await authAPI.getUserById(id);
        const fetchedUser = res?.data?.data?.data || res?.data?.data || res?.data || {};
        setUserData({
          FirstName: fetchedUser.FirstName || '',
          LastName: fetchedUser.LastName || '',
          email: fetchedUser.email || '',
          role: fetchedUser.role || 'user',
          isVerified: !!fetchedUser.isVerified,
          active: !!fetchedUser.active,
        });
      } catch (err) {
        console.error('Error fetching user for edit:', err);
        setError(err.response?.data?.message || 'Failed to load user data.');
        toast.error(err.response?.data?.message || 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchUser();
    } else {
      setError('No user ID provided for editing.');
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateUserRole(id, { role: userData.role, active: userData.active }); // Only update role and active status
      toast.success('User updated successfully!');
      navigate('/admin/users');
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading user data...</p>;
  if (error) return <p className="text-center mt-4 text-danger">Error: {error}</p>;

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="p-4 border rounded shadow-lg bg-white">
            <h2 className="mb-4 text-center fw-bold text-primary d-flex align-items-center justify-content-center">
              <i className="bi bi-pencil-square me-2"></i> Edit User: {userData.FirstName} {userData.LastName}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold text-dark">Email</label>
                <input
                  type="email"
                  className="form-control form-control-lg border-secondary rounded-pill px-3"
                  id="email"
                  name="email"
                  value={userData.email}
                  disabled // Email usually cannot be changed
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label fw-bold text-dark">Role</label>
                <select
                  className="form-select form-select-lg border-secondary rounded-pill px-3"
                  id="role"
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-3 form-check d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  id="active"
                  name="active"
                  checked={userData.active}
                  onChange={handleChange}
                />
                <label className="form-check-label text-dark" htmlFor="active">User is Active</label>
              </div>
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary btn-lg fw-bold d-flex align-items-center justify-content-center py-2 rounded-pill" disabled={loading}>
                  <i className="bi bi-save me-2"></i> {loading ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
