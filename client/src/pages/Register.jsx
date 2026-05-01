import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Building2 } from 'lucide-react';
import './Auth.css';

const Register = () => {
    return (
        <div className="auth-container">
            <div className="auth-shell">
                <section className="auth-showcase">
                    <span className="auth-kicker">Access policy</span>
                    <div className="auth-showcase-copy">
                        <h1>Account creation stays centrally managed.</h1>
                        <p>
                            This workspace is reserved for approved internal staff, keeping dealership operations and customer records under controlled administration.
                        </p>
                    </div>
                    <div className="auth-showcase-metrics">
                        <div className="showcase-stat">
                            <strong>Centralized</strong>
                            <span>Each staff profile is issued by an authorized super admin.</span>
                        </div>
                        <div className="showcase-stat">
                            <strong>Compliant</strong>
                            <span>Operational roles and features can be assigned with precision.</span>
                        </div>
                        <div className="showcase-stat">
                            <strong>Scalable</strong>
                            <span>Dealer and employee accounts can expand without losing governance.</span>
                        </div>
                    </div>
                    <p className="auth-showcase-footer">
                        Customer self-registration can be introduced later in the dedicated mobile flow.
                    </p>
                </section>

                <div className="auth-card">
                    <div className="auth-card-head">
                        <span className="auth-panel-kicker">Registration info</span>
                        <h2>Accounts are provisioned for you</h2>
                        <p className="auth-register-copy">
                            Desktop staff users are created by the super admin. This protects permissions, reporting visibility, and dealer-level operational data.
                        </p>
                    </div>

                    <div className="auth-support">
                        <div className="auth-support-card">
                            <BadgeCheck size={20} />
                            <div>
                                <strong>Verified staff onboarding</strong>
                                <p>Each account is reviewed before access is granted to leasing tools and customer records.</p>
                            </div>
                        </div>
                        <div className="auth-support-card">
                            <Building2 size={20} />
                            <div>
                                <strong>Dealer-ready structure</strong>
                                <p>New team members can be added with the correct role, feature access, and branch context.</p>
                            </div>
                        </div>
                    </div>

                    <div className="auth-register-actions">
                        <Link to="/" className="auth-button">Return to login</Link>
                        <Link to="/" className="auth-secondary-link">
                            <ArrowLeft size={16} />
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
