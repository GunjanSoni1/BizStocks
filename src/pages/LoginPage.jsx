import React, { useState } from 'react';
import { authAPI } from '../utils/api';

const LoginPage = ({ setAppUser, setCurrentPage, showMessage, closeModal, setUserId, setIsMockMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      showMessage('Please enter both email and password.', 'error');
      return;
    }

    if (!emailPattern.test(email)) {
      showMessage('Please enter a valid email like example@domain.com.', 'error');
      return;
    }

    if (password.length < 8) {
      showMessage('Password must be at least 8 characters long.', 'error');
      return;
    }

    setLoading(true);
    try {
      // Try to login via API first
      const response = await authAPI.login(email, password);
      setAppUser({
        uid: response.user.uid,
        email: response.user.email,
        displayName: response.user.displayName || email.split('@')[0],
        businessName: response.user.businessName || ''
      });
      setUserId(response.user.uid);
      setIsMockMode(false);
      setCurrentPage('Dashboard');
      showMessage('Login successful! Connected to server.', 'success');
      setLoading(false);
    } catch (error) {
      // If API fails, check if backend is available
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      fetch(`${API_URL}/health`)
        .then(() => {
          // Backend is up but login failed - show error
          showMessage(`Login failed: ${error.message}. Please check your credentials or create an account.`, 'error');
          setLoading(false);
        })
        .catch(() => {
          // Backend is down - use mock mode
          console.warn('Backend not available, using mock mode');
          setAppUser({ uid: 'user-123', email, displayName: email.split('@')[0] });
          setUserId('local-user');
          if (setIsMockMode) setIsMockMode(true);
          setCurrentPage('Dashboard');
          showMessage('Login successful (offline mode). Backend server is not running.', 'info');
          setLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f6f0] flex flex-col items-center justify-center px-4">
      <div className="space-y-2 text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Login</h1>
        <p className="text-sm text-slate-500">Please enter your login and your password.</p>
      </div>

      <form onSubmit={handleManualLogin} className="space-y-4 w-full max-w-sm">
        <div className="relative w-full max-w-sm mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-400 text-base">👤</span>
          </div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username or E-mail"
            className="w-full h-11 rounded-md border border-slate-300 bg-white pl-14 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            required
          />
        </div>

        <div className="relative w-full max-w-sm mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-400 text-base">🔑</span>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-11 rounded-md border border-slate-300 bg-white pl-14 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            required
          />
        </div>

        <div className="w-full max-w-sm mx-auto">
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center w-full h-11 rounded-md border border-lime-400 bg-lime-400 text-slate-900 font-semibold text-sm hover:bg-lime-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

