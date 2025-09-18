import React, { useState } from 'react';
import { authAPI } from '../api/axios';

const CorsTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testCors = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      const response = await authAPI.testCors();
      setTestResult(`✅ CORS Test Successful: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ CORS Test Failed: ${error.message}\n\nDetails: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      const response = await authAPI.testConnection();
      setTestResult(`✅ Connection Test Successful: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Connection Test Failed: ${error.message}\n\nDetails: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>CORS Test Component</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testCors}
          disabled={loading}
          style={{ 
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test CORS'}
        </button>
        
        <button 
          onClick={testConnection}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
      
      {testResult && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '5px',
          border: '1px solid #dee2e6',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          {testResult}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h3>Debug Information:</h3>
        <ul>
          <li>Current Origin: {window.location.origin}</li>
                          <li>API Base URL: https://touropia-backend.vercel.app/api/v1</li>
          <li>User Agent: {navigator.userAgent}</li>
        </ul>
      </div>
    </div>
  );
};

export default CorsTest; 