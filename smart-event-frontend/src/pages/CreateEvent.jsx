import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { eventApi } from '../api/api';
import { Pencil, Sparkles } from 'lucide-react';
import Loader from '../components/Loader';
import './CreateEvent.css';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingEdit, setFetchingEdit] = useState(!!editId);

  // If editing, fetch existing event
  useEffect(() => {
    if (!editId) return;

    async function fetchEvent() {
      try {
        const event = await eventApi.getById(editId);
        setForm({
          title: event.title || '',
          description: event.description || '',
          date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
          location: event.location || '',
          capacity: event.capacity?.toString() || '',
        });
      } catch (err) {
        setError('Failed to load event for editing');
      } finally {
        setFetchingEdit(false);
      }
    }
    fetchEvent();
  }, [editId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: new Date(form.date).toISOString(),
      location: form.location.trim(),
      capacity: parseInt(form.capacity, 10),
    };

    if (payload.capacity < 1) {
      setError('Capacity must be at least 1');
      setLoading(false);
      return;
    }

    try {
      if (editId) {
        await eventApi.update(editId, payload);
        navigate(`/events/${editId}`);
      } else {
        const data = await eventApi.create(payload);
        navigate(`/events/${data.event._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEdit) return <Loader />;

  return (
    <div className="create-event-page" id="create-event-page">
      <div className="create-event-card glass-card">
        <div className="create-event-header">
          <h1>
            {editId ? (
              <><Pencil size={22} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Edit Event</>
            ) : (
              <><Sparkles size={22} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Create New Event</>
            )}
          </h1>
          <p>{editId ? 'Update your event details below' : 'Fill in the details to create your event'}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} id="create-event-form">
          <div className="form-group">
            <label className="form-label" htmlFor="event-title">Event Title</label>
            <input
              id="event-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Tech Conference 2026"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event-description">Description</label>
            <textarea
              id="event-description"
              name="description"
              className="form-input"
              placeholder="Tell people what your event is about..."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="create-event-row">
            <div className="form-group">
              <label className="form-label" htmlFor="event-date">Date & Time</label>
              <input
                id="event-date"
                name="date"
                type="datetime-local"
                className="form-input"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="event-capacity">Capacity</label>
              <input
                id="event-capacity"
                name="capacity"
                type="number"
                className="form-input"
                placeholder="100"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="event-location">Location</label>
            <input
              id="event-location"
              name="location"
              type="text"
              className="form-input"
              placeholder="e.g. Colombo, Sri Lanka"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              id="cancel-event-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
              id="submit-event-btn"
            >
              {loading ? <Loader small /> : editId ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
