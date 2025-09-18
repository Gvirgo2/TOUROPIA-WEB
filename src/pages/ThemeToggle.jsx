import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <button
        className="btn btn-outline-light btn-sm rounded-circle"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        style={{ 
          width: '40px', 
          height: '40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          background: 'rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        {isDarkMode ? (
          <i className="ri-moon-line text-white fs-5"></i>
        ) : (
          <i className="ri-sun-line text-white fs-5"></i>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle; 