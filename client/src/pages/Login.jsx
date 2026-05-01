import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'; // Adjusted path to your supabase client
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Replaces the old authController logic with direct Supabase Auth.
   * This handles the JWT generation and session management automatically.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Upon success, store the token to satisfy your App.jsx hasSessionToken() check
      if (data?.session) {
        localStorage.setItem('token', data.session.access_token);
        
        // You can also store user profile data if needed by your dashboard
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Navigate to the protected dashboard route
        navigate('/app/dashboard');
      }
    } catch (err) {
      // Displays the specific error message (e.g., "Invalid login credentials")
      setError(err.message || 'An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Moto Leasing Login</h2>
          
          {error && (
            <div className="error-box" style={{ color: '#ff4d4d', marginBottom: '15px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="name@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;