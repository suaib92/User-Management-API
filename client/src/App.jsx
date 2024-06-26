import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';

const App = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register setToken={handleSetToken} />} />
          <Route path="/login" element={<Login setToken={handleSetToken} />} />
          <Route path="/profile" element={token ? <Profile token={token} setToken={handleSetToken} /> : <Navigate to="/login" />} />
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
