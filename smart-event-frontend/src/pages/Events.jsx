import { useState, useEffect } from 'react';
import { eventApi } from '../api/api';
import { Search, Theater } from 'lucide-react';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import './Events.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [debounced, setDebounced] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError('');
      try {
        const data = await eventApi.getAll({
          search: debounced || undefined,
          date: dateFilter || undefined,
        });
        setEvents(data);
      } catch (err) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [debounced, dateFilter]);

  return (
    <div className="events-page" id="events-page">
      <div className="events-header animate-fade-in-up">
        <h1>Discover Events</h1>
        <p>Find and book amazing events happening around you</p>
      </div>

      <div className="events-filters animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="events-search">
          <Search size={16} className="events-search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="events-search-input"
          />
        </div>
        <div className="events-date-filter">
          <input
            type="date"
            className="form-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            id="events-date-filter"
          />
        </div>
      </div>

      {error && <div className="alert alert-error container">{error}</div>}

      {loading ? (
        <Loader />
      ) : events.length === 0 ? (
        <div className="events-empty">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Theater size={48} strokeWidth={1.5} />
            </div>
            <h3>No events found</h3>
            <p>Try adjusting your search or check back later for new events.</p>
          </div>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event, i) => (
            <div
              key={event._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
