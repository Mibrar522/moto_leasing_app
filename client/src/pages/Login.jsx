import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint, ShieldCheck, UserCog } from 'lucide-react';
import supabase from '../supabaseClient';
import API from '../api/axios';
import './Auth.css';

const DASHBOARD_THEME_STORAGE_KEY = 'dashboard_theme';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginTheme] = useState(() => localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY) || 'sandstone');
  const navigate = useNavigate();

  const apiBaseUrl = String(API.defaults.baseURL || '');

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

      if (data?.session) {
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Navigate to the protected dashboard route
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" data-theme={loginTheme}>
      <div className="auth-shell">
        <section className="auth-showcase">
          <span className="auth-kicker">Motor lease operations</span>
          <div className="auth-showcase-copy">
            <h1>Professional control for modern vehicle leasing teams.</h1>
            <p>
              Manage customer onboarding, dealer operations, sales activity, and compliance workflows from one refined control center.
            </p>
          </div>
          <div className="auth-showcase-metrics">
            <div className="showcase-stat">
              <strong>Fast</strong>
              <span>Sign in and move directly into your daily operational dashboard.</span>
            </div>
            <div className="showcase-stat">
              <strong>Secure</strong>
              <span>Built for staff access, protected actions, and controlled permissions.</span>
            </div>
            <div className="showcase-stat">
              <strong>Ready</strong>
              <span>Designed for leasing, installment handling, and dealer growth.</span>
            </div>
          </div>
          <p className="auth-showcase-footer">
            Trusted workspace for sales agents, operations staff, and super admins.
          </p>
        </section>

        <div className="auth-card">
          <div className="auth-card-head">
            <span className="auth-panel-kicker">Staff access</span>
            <h2>Sign in to the control desk</h2>
            <p>Use your assigned company credentials to access the leasing platform.</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            {error && (
              <div className="error-box" style={{ color: '#ff4d4d', padding: '10px', background: 'rgba(255, 77, 77, 0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            <label className="auth-field">
              <span>Email address</span>
              <input 
                type="email" 
                placeholder="name@company.com" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)} 
                autoComplete="email"
              />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input 
                type="password" 
                placeholder="Enter your password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)} 
                autoComplete="current-password"
              />
            </label>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Authenticating...' : 'Enter dashboard'}
            </button>
          </form>
          <p className="auth-api-hint">Backend API: {apiBaseUrl || 'not configured'}</p>

          <div className="auth-support">
            <div className="auth-support-card">
              <ShieldCheck size={20} />
              <div>
                <strong>Controlled access</strong>
                <p>Only staff accounts provisioned by the super admin can log in here.</p>
              </div>
            </div>
            <div className="auth-support-card">
              <Fingerprint size={20} />
              <div>
                <strong>Operational security</strong>
                <p>Customer onboarding, biometrics, and documentation stay inside the staff workspace.</p>
              </div>
            </div>
            <div className="auth-support-card">
              <UserCog size={20} />
              <div>
                <strong>Need access?</strong>
                <p>
                  Ask your super admin to create your account, or review the <Link to="/register" className="auth-link">account policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;