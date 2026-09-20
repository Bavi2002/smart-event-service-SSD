import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationApi } from '../api/api';
import { Ticket, Calendar, FileText } from 'lucide-react';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import './MyBookings.css';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cancel
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const data = await registrationApi.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await registrationApi.cancel(cancelId);
      setCancelId(null);
      fetchBookings(); // Refresh
    } catch (err) {
      setError(err.message || 'Cancel failed');
      setCancelId(null);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="bookings-page" id="bookings-page">
      <div className="bookings-header animate-fade-in-up">
        <h1>My Bookings</h1>
        <p>View and manage your event registrations</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Ticket size={48} strokeWidth={1.5} />
          </div>
          <h3>No bookings yet</h3>
          <p>Browse events and book your first ticket!</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 'var(--space-lg)' }}
            onClick={() => navigate('/events')}
            id="browse-events-btn"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking, i) => (
            <div
              key={booking._id}
              className="booking-item glass-card animate-fade-in-up"
              style={{ animationDelay: `${0.05 * i}s` }}
              onClick={() => booking.eventId && navigate(`/events/${booking.eventId}`)}
              id={`booking-${booking._id}`}
            >
              <div className="booking-item-info">
                <span className="booking-item-title">
                  {booking.eventTitle || 'Untitled Event'}
                </span>
                <div className="booking-item-meta">
                  <span><Ticket size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{booking.ticketCount} ticket{booking.ticketCount > 1 ? 's' : ''}</span>
                  <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Booked {formatDate(booking.bookedAt || booking.createdAt)}</span>
                  {booking.notes && <span><FileText size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{booking.notes}</span>}
                </div>
              </div>
              <div className="booking-item-actions" onClick={(e) => e.stopPropagation()}>
                <span className={`badge ${
                  booking.status === 'confirmed' ? 'badge-success' :
                  booking.status === 'cancelled' ? 'badge-danger' :
                  'badge-warning'
                }`}>
                  {booking.status}
                </span>
                {booking.status === 'confirmed' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setCancelId(booking._id)}
                    id={`cancel-booking-${booking._id}`}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        title="Cancel Booking"
      >
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setCancelId(null)}>
            Keep Booking
          </button>
          <button
            className="btn btn-danger"
            onClick={handleCancel}
            disabled={cancelling}
            id="confirm-cancel-btn"
          >
            {cancelling ? <Loader small /> : 'Cancel Booking'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
