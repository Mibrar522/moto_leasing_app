import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Fingerprint, ShieldCheck, UserCog } from 'lucide-react';
import API from '../api/axios';
import './Auth.css';

const DASHBOARD_THEME_STORAGE_KEY = 'dashboard_theme';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loginTheme] = useState(() => localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY) || 'sandstone');
    const apiBaseUrl = String(API.defaults.baseURL || '');
    const navigate = useNavigate(); // Hook initialized inside the component

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', credentials);
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            alert("Logged in successfully!");
            navigate('/app/dashboard');
        } catch (err) {
            const status = err.response?.status;
            const serverMessage = err.response?.data?.message || err.response?.data?.error;

            if (status === 404) {
                alert(serverMessage || `Login route not found. Backend URL: ${apiBaseUrl || 'not set'}.`);
                return;
            }

            if (status === 400) {
                alert(serverMessage || "Invalid credentials.");
                return;
            }

            if (status === 403) {
                alert(serverMessage || "Access denied for this account.");
                return;
            }

            if (status === 500) {
                alert(serverMessage || "Server error during login.");
                return;
            }

            alert(serverMessage || "Unable to connect to the login service.");
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
                        <label className="auth-field">
                            <span>Email address</span>
                            <input 
                                type="email" 
                                placeholder="name@company.com" 
                                required 
                                onChange={e => setCredentials({...credentials, email: e.target.value})} 
                            />
                        </label>
                        <label className="auth-field">
                            <span>Password</span>
                            <input 
                                type="password" 
                                placeholder="Enter your password" 
                                required 
                                onChange={e => setCredentials({...credentials, password: e.target.value})} 
                            />
                        </label>
                        <button type="submit" className="auth-button">Enter dashboard</button>
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
