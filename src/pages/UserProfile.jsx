import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authAPI } from '../api/axios'; // Import reviewAPI
import { useAuth } from '../auth/AuthContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState({
    FirstName: '',
    LastName: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const res = await authAPI.getUserProfile();
          const fetchedProfile = res?.data?.data?.data || res?.data?.data || res?.data || {};
          setUserData({
            FirstName: fetchedProfile.FirstName || '',
            LastName: fetchedProfile.LastName || '',
            email: fetchedProfile.email || '',
          });
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError(err.response?.data?.message || 'Failed to load user profile.');
          toast.error(err.response?.data?.message || 'Failed to load user profile.');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      setError('User not authenticated.');
      setLoading(false);
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await authAPI.updateUserProfile(userData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await authAPI.deleteUserProfile();
        toast.success('Account deleted successfully!');
        logout(); // Log out the user after deleting the account
        navigate('/');
      } catch (err) {
        console.error('Error deleting account:', err);
        toast.error(err.response?.data?.message || 'Failed to delete account.');
      }
    }
  };

  if (loading) return <p className="text-center mt-4">Loading profile data...</p>;
  if (error) return <p className="text-center mt-4 text-danger">Error: {error}</p>;

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="p-4 border rounded shadow-sm bg-light mb-4">
            <h2 className="mb-4 text-center text-success d-flex align-items-center justify-content-center">
              <i className="bi bi-person-circle me-2"></i> My Profile
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="FirstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="FirstName"
                  name="FirstName"
                  value={userData.FirstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="LastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="LastName"
                  name="LastName"
                  value={userData.LastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={userData.email}
                  disabled // Email is typically not editable directly here
                />
              </div>
              <div className="d-grid gap-2 mt-4">
                <button type="submit" className="btn btn-success d-flex align-items-center justify-content-center" disabled={isUpdating}>
                  <i className="bi bi-save me-2"></i> {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>
                <button type="button" className="btn btn-danger d-flex align-items-center justify-content-center" onClick={handleDeleteAccount}>
                  <i className="bi bi-trash me-2"></i> Delete Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
