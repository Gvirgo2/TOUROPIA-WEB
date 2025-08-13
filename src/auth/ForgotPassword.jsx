import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    console.log('Submitting forgot password for email:', email);

    try {
      const result = await forgotPassword(email);
      console.log('Forgot password result:', result);
      
      if (result.success) {
        setMessage(result.message || 'Password reset email sent successfully! Please check your email for the reset link.');
        setEmail('');
      } else {
        setError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        
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
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
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
            'Send Reset Link'
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

export default ForgotPassword; 