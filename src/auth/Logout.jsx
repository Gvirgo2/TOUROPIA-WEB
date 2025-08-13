import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      navigate('/login');
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Logging Out...</h2>
        <div className="spinner"></div>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'white' }}>
          Please wait while we log you out...
        </p>
      </div>
    </div>
  );
};

export default Logout; 