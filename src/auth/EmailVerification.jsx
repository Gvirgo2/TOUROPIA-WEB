import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setError('Invalid verification link.');
        setLoading(false);
        return;
      }

      const result = await verifyEmail(token);
      
      if (result.success) {
        setMessage(result.message || 'Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.error);
      }
      
      setLoading(false);
    };

    verifyEmailToken();
  }, [token, navigate, verifyEmail]);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Verifying Email</h2>
          <div className="spinner"></div>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: 'white' }}>
            Please wait while we verify your email...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Email Verification</h2>
        
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

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 