import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import './EventCard.css';

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const isUpcoming = new Date(event.date) > new Date();

  return (
    <div
      className="event-card glass-card"
      onClick={() => navigate(`/events/${event._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/events/${event._id}`)}
      id={`event-card-${event._id}`}
    >
      <div className="event-card-header">
        <h3 className="event-card-title">{event.title}</h3>
        <span className={`badge ${isUpcoming ? 'badge-success' : 'badge-warning'}`}>
          {isUpcoming ? 'Upcoming' : 'Past'}
        </span>
      </div>

      {event.description && (
        <p className="event-card-description">{event.description}</p>
      )}

      <div className="event-card-meta">
        <span className="event-card-meta-item">
          <MapPin size={15} className="event-card-meta-icon" />
          {event.location}
        </span>
        <span className="event-card-meta-item">
          <Clock size={15} className="event-card-meta-icon" />
          {formatTime(event.date)}
        </span>
        <span className="event-card-meta-item">
          <Users size={15} className="event-card-meta-icon" />
          {event.capacity} spots
        </span>
      </div>

      <div className="event-card-footer">
        <span className="event-card-date">{formatDate(event.date)}</span>
        <ArrowRight size={18} className="event-card-arrow" />
      </div>
    </div>
  );
}
