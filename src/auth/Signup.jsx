import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

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

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Send with exact field names backend expects
    const result = await signup({
      FirstName: formData.firstName,  // Backend expects FirstName (capital F)
      LastName: formData.lastName,    // Backend expects LastName (capital L)
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      role: 'user'
    });
    
    if (result.success) {
      setMessage(result.message || 'Account created successfully! Please check your email for verification.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        
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
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-input"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-input"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordConfirm" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            className="form-input"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="Confirm your password"
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
            'Sign Up'
          )}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Already have an account?{' '}
          </span>
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup; 