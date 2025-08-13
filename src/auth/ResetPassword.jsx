import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const { resetPassword } = useAuth();

  useEffect(() => {
    // Debug token extraction
    console.log('ResetPassword: Token from URL params:', token);
    console.log('ResetPassword: Current URL:', window.location.href);
    
    if (!token) {
      setError('Invalid reset link. Token is missing.');
      return;
    }
    
    setTokenValid(true);
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!token) {
      setError('Invalid reset link. Token is missing.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    console.log('ResetPassword: Submitting with token:', token);
    console.log('ResetPassword: Password data:', {
      password: formData.password,
      passwordConfirm: formData.passwordConfirm
    });

    try {
      const result = await resetPassword(token, {
        password: formData.password,
        passwordConfirm: formData.passwordConfirm
      });
      
      console.log('ResetPassword: Result:', result);
      
      if (result.success) {
        setMessage(result.message || 'Password reset successfully!');
        setFormData({
          password: '',
          passwordConfirm: ''
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error('ResetPassword: Error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Invalid Reset Link</h2>
          <div className="alert alert-error">
            {error || 'This reset link is invalid or has expired.'}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/forgot-password" className="btn btn-primary">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        
        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your new password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordConfirm" className="form-label">
            Confirm New Password
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            className="form-input"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="Confirm your new password"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            'Reset Password'
          )}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/login" className="nav-link">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword; 