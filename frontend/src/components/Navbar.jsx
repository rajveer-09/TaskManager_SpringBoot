import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckSquare, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'var(--navbar-bg)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo Area */}
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textDecoration: 'none'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, var(--primary-color), #2563EB)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)'
                    }}>
                        <CheckSquare size={24} color="white" strokeWidth={2.5} />
                    </div>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        letterSpacing: '-0.03em'
                    }}>
                        TaskManager
                    </span>
                </Link>

                {/* User Actions */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.375rem 0.5rem 0.375rem 1rem',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '99px'
                            }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>
                                    {user.username}
                                </span>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'var(--primary-color)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    fontSize: '0.875rem'
                                }}>
                                    {getInitials(user.username)}
                                </div>
                            </div>

                            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" className="btn btn-secondary" style={{ textDecoration: 'none' }}>Log In</Link>
                            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
