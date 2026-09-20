import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi, registrationApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Pencil, Trash2, PartyPopper, Minus, Plus } from 'lucide-react';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import './EventDetail.css';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking
  const [ticketCount, setTicketCount] = useState(1);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [eventData, availData] = await Promise.all([
          eventApi.getById(id),
          eventApi.checkAvailability(id),
        ]);
        setEvent(eventData);
        setAvailability(availData);
      } catch (err) {
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBooking(true);
    setBookingError('');

    try {
      await registrationApi.book(id, ticketCount);
      setBookingSuccess(true);
      // Refresh availability
      const availData = await eventApi.checkAvailability(id);
      setAvailability(availData);
    } catch (err) {
      setBookingError(err.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await eventApi.delete(id);
      navigate('/events');
    } catch (err) {
      setBookingError(err.message || 'Delete failed');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Colombo',
    });
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="event-detail">
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/events')}>
          <ArrowLeft size={16} /> Back to Events
        </button>
      </div>
    );
  }
  if (!event) return null;

  const remaining = availability?.remaining ?? event.capacity;
  const isOrganizer = user && (user._id === event.organizerId || user.id === event.organizerId);
  const isUpcoming = new Date(event.date) > new Date();

  return (
    <div className="event-detail" id="event-detail-page">
      <button className="event-detail-back" onClick={() => navigate('/events')} id="back-to-events">
        <ArrowLeft size={16} /> Back to Events
      </button>

      <div className="event-detail-grid">
        {/* Main Content */}
        <div className="event-detail-main">
          <div className="event-detail-header">
            <h1 className="event-detail-title">{event.title}</h1>
            <span className={`badge ${isUpcoming ? 'badge-success' : 'badge-warning'}`}>
              {isUpcoming ? 'Upcoming' : 'Past'}
            </span>
          </div>

          <div className="event-detail-info-card glass-card">
            <div className="event-detail-info-row">
              <div className="event-detail-info-icon">
                <Calendar size={18} />
              </div>
              <div>
                <div className="event-detail-info-label">Date</div>
                <div className="event-detail-info-value">{formatDate(event.date)}</div>
              </div>
            </div>
            <div className="event-detail-info-row">
              <div className="event-detail-info-icon">
                <Clock size={18} />
              </div>
              <div>
                <div className="event-detail-info-label">Time</div>
                <div className="event-detail-info-value">{formatTime(event.date)}</div>
              </div>
            </div>
            <div className="event-detail-info-row">
              <div className="event-detail-info-icon">
                <MapPin size={18} />
              </div>
              <div>
                <div className="event-detail-info-label">Location</div>
                <div className="event-detail-info-value">{event.location}</div>
              </div>
            </div>
            <div className="event-detail-info-row">
              <div className="event-detail-info-icon">
                <Users size={18} />
              </div>
              <div>
                <div className="event-detail-info-label">Capacity</div>
                <div className="event-detail-info-value">{remaining} / {event.capacity} spots remaining</div>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="event-detail-description glass-card">
              <h3>About This Event</h3>
              <p>{event.description}</p>
            </div>
          )}

          {/* Organizer Actions */}
          {isOrganizer && (
            <div className="event-detail-actions">
              <button
                className="btn btn-secondary"
                onClick={() => navigate(`/create-event?edit=${event._id}`)}
                id="edit-event-btn"
              >
                <Pencil size={16} /> Edit Event
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteModal(true)}
                id="delete-event-btn"
              >
                <Trash2 size={16} /> Delete Event
              </button>
            </div>
          )}
        </div>

        {/* Sidebar - Booking */}
        <div className="event-detail-sidebar">
          <div className="booking-card glass-card" id="booking-card">
            {bookingSuccess ? (
              <div className="booking-success">
                <div className="booking-success-icon">
                  <PartyPopper size={40} strokeWidth={1.5} />
                </div>
                <h3>Booking Confirmed!</h3>
                <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-md) 0' }}>
                  You've booked {ticketCount} ticket{ticketCount > 1 ? 's' : ''} for this event.
                  Check your email for the confirmation.
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/my-bookings')}
                  id="view-bookings-btn"
                >
                  View My Bookings
                </button>
              </div>
            ) : (
              <>
                <h3 className="booking-card-title">Book Tickets</h3>

                <div className="booking-availability">
                  <span className={`booking-availability-dot ${
                    remaining === 0 ? 'none' : remaining <= 10 ? 'low' : ''
                  }`} />
                  <span>
                    {remaining === 0
                      ? 'Sold out'
                      : remaining <= 10
                        ? `Only ${remaining} spots left!`
                        : `${remaining} spots available`}
                  </span>
                </div>

                {remaining > 0 && isUpcoming && (
                  <>
                    <div>
                      <label className="form-label">Number of Tickets</label>
                      <div className="booking-ticket-select">
                        <button
                          className="booking-ticket-btn"
                          onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                          disabled={ticketCount <= 1}
                          id="ticket-decrease"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="booking-ticket-count" id="ticket-count">{ticketCount}</span>
                        <button
                          className="booking-ticket-btn"
                          onClick={() => setTicketCount(Math.min(10, ticketCount + 1, remaining))}
                          disabled={ticketCount >= 10 || ticketCount >= remaining}
                          id="ticket-increase"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {bookingError && (
                      <div className="alert alert-error" style={{ marginBottom: 0 }}>{bookingError}</div>
                    )}

                    <button
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      onClick={handleBook}
                      disabled={booking}
                      id="book-now-btn"
                    >
                      {booking ? <Loader small /> : `Book ${ticketCount} Ticket${ticketCount > 1 ? 's' : ''}`}
                    </button>
                  </>
                )}

                {!isUpcoming && (
                  <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    This event has already passed.
                  </p>
                )}

                {!user && isUpcoming && remaining > 0 && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
                    Please <a href="/login" style={{ color: 'var(--color-primary)' }}>sign in</a> to book tickets.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
      >
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
          Are you sure you want to delete "<strong>{event.title}</strong>"? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting} id="confirm-delete-btn">
            {deleting ? <Loader small /> : 'Delete Event'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
