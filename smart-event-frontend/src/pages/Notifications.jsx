import { useState, useEffect } from 'react';
import { notificationApi } from '../api/api';
import { Ticket, Bell, Mail } from 'lucide-react';
import Loader from '../components/Loader';
import './Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await notificationApi.getMyNotifications();
        setNotifications(data);
      } catch (err) {
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'booking_confirmation': return { icon: <Ticket size={20} />, className: 'booking' };
      case 'event_reminder': return { icon: <Bell size={20} />, className: 'reminder' };
      default: return { icon: <Mail size={20} />, className: 'default' };
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) return <Loader />;

  return (
    <div className="notifications-page" id="notifications-page">
      <div className="notifications-header animate-fade-in-up">
        <h1>Notifications</h1>
        <p>Your email notification history</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Bell size={48} strokeWidth={1.5} /></div>
          <h3>No notifications yet</h3>
          <p>Your booking confirmations and event reminders will appear here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif, i) => {
            const icon = getIcon(notif.type);
            return (
              <div key={notif._id} className="notification-item glass-card animate-fade-in-up" style={{ animationDelay: `${0.05 * i}s` }} id={`notification-${notif._id}`}>
                <div className={`notification-icon ${icon.className}`}>{icon.icon}</div>
                <div className="notification-content">
                  <div className="notification-subject">{notif.subject}</div>
                  <div className="notification-to">To: {notif.to}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <span className={`badge ${notif.status === 'sent' ? 'badge-success' : 'badge-danger'}`}>{notif.status}</span>
                    <span className="notification-date">{formatDate(notif.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
