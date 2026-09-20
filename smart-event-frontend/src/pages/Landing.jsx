import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Ticket, BarChart3, Bell, Shield, ArrowRight } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing-hero" id="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <Sparkles size={16} />
            Smart Event Management Platform
          </div>

          <h1 className="landing-hero-title">
            Discover & Manage<br />
            Events Seamlessly
          </h1>

          <p className="landing-hero-subtitle">
            Create unforgettable events, book tickets instantly, and stay notified. 
            Your all-in-one platform for event management in Sri Lanka.
          </p>

          <div className="landing-hero-actions">
            <Link to="/events" className="btn btn-primary btn-lg" id="hero-browse-btn">
              Browse Events
              <ArrowRight size={18} />
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-secondary btn-lg" id="hero-signup-btn">
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="landing-features">
        <h2 className="landing-features-title">Why Smart Events?</h2>
        <p className="landing-features-subtitle">
          Everything you need to create, manage, and attend events
        </p>

        <div className="landing-features-grid">
          <div className="feature-card glass-card animate-fade-in-up stagger-1">
            <div className="feature-icon feature-icon-purple">
              <Ticket size={24} />
            </div>
            <h4 className="feature-title">Easy Booking</h4>
            <p className="feature-desc">
              Book tickets for any event with just a few clicks. Real-time availability and instant confirmation.
            </p>
          </div>

          <div className="feature-card glass-card animate-fade-in-up stagger-2">
            <div className="feature-icon feature-icon-green">
              <BarChart3 size={24} />
            </div>
            <h4 className="feature-title">Event Management</h4>
            <p className="feature-desc">
              Create and manage events effortlessly. Track registrations, capacity, and participant details.
            </p>
          </div>

          <div className="feature-card glass-card animate-fade-in-up stagger-3">
            <div className="feature-icon feature-icon-blue">
              <Bell size={24} />
            </div>
            <h4 className="feature-title">Smart Notifications</h4>
            <p className="feature-desc">
              Get email confirmations and reminders. Never miss an event with our smart notification system.
            </p>
          </div>

          <div className="feature-card glass-card animate-fade-in-up stagger-4">
            <div className="feature-icon feature-icon-orange">
              <Shield size={24} />
            </div>
            <h4 className="feature-title">Secure & Reliable</h4>
            <p className="feature-desc">
              Built with microservices architecture. JWT authentication keeps your data safe and secure.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stats" id="landing-stats">
        <div className="landing-stats-grid">
          <div>
            <div className="stat-value">500+</div>
            <div className="stat-label">Events Created</div>
          </div>
          <div>
            <div className="stat-value">10K+</div>
            <div className="stat-label">Tickets Booked</div>
          </div>
          <div>
            <div className="stat-value">2K+</div>
            <div className="stat-label">Happy Users</div>
          </div>
          <div>
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="landing-cta" id="landing-cta">
          <div className="landing-cta-inner">
            <h2>Ready to get started?</h2>
            <p>Join thousands of event organizers and attendees on Smart Events.</p>
            <Link to="/register" className="btn btn-primary btn-lg" id="cta-signup-btn" style={{ position: 'relative' }}>
              Create Free Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="landing-footer" id="landing-footer">
        <p>© {new Date().getFullYear()} Smart Event Management System — SLIIT CTSE Assignment</p>
      </footer>
    </div>
  );
}
