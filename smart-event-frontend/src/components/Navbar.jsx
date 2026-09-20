import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Menu, X, User, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <span className="navbar-brand-icon">
            <Zap size={18} />
          </span>
          Smart Events
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="navbar-toggle"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`navbar-links${menuOpen ? ' open' : ''}`} id="navbar-links">
          <NavLink
            to="/events"
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
            onClick={closeMenu}
            id="nav-events"
          >
            Browse Events
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/create-event"
                className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                onClick={closeMenu}
                id="nav-create-event"
              >
                Create Event
              </NavLink>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                onClick={closeMenu}
                id="nav-bookings"
              >
                My Bookings
              </NavLink>
              <NavLink
                to="/notifications"
                className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                onClick={closeMenu}
                id="nav-notifications"
              >
                Notifications
              </NavLink>
            </>
          )}

          {/* Mobile-only auth section */}
          {user ? (
            <div className="navbar-user-mobile">
              <NavLink
                to="/profile"
                className="navbar-link"
                onClick={closeMenu}
                id="nav-profile-mobile"
              >
                Profile
              </NavLink>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="nav-logout-mobile">
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-user-mobile">
              <NavLink to="/login" className="navbar-link" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" className="navbar-link" onClick={closeMenu}>
                Register
              </NavLink>
            </div>
          )}
        </div>

        {/* Desktop user section */}
        <div className="navbar-user">
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                id="nav-profile"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="navbar-avatar">{user.name?.[0] || '?'}</span>
                  <span className="navbar-username">{user.name}</span>
                </div>
              </NavLink>
              <span className="navbar-divider" />
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="nav-logout">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                id="nav-login"
              >
                Login
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
