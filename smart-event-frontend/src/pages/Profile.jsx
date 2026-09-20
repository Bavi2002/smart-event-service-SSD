import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/api';
import { Pencil } from 'lucide-react';
import Loader from '../components/Loader';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const updated = await userApi.updateProfile({ name: form.name.trim(), phone: form.phone.trim() });
      updateUser(updated);
      setEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally { setLoading(false); }
  };

  if (!user) return <Loader />;

  return (
    <div className="profile-page" id="profile-page">
      <div className="profile-card glass-card">
        <div className="profile-header">
          <div className="profile-avatar">{user.name?.[0] || '?'}</div>
          <div className="profile-header-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <span className="badge badge-info" style={{ marginTop: '8px' }}>{user.role || 'user'}</span>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {editing ? (
          <form onSubmit={handleSubmit} id="profile-edit-form">
            <p className="profile-section-title">Edit Profile</p>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input id="profile-name" name="name" type="text" className="form-input" value={form.name} onChange={handleChange} required minLength={2} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email</label>
              <input id="profile-email" type="email" className="form-input" value={user.email} disabled style={{ opacity: 0.5 }} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone">Phone</label>
              <input id="profile-phone" name="phone" type="tel" className="form-input" placeholder="+94 77 123 4567" value={form.phone} onChange={handleChange} />
            </div>
            <div className="profile-actions">
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); setForm({ name: user.name || '', phone: user.phone || '' }); }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading} id="save-profile-btn">{loading ? <Loader small /> : 'Save Changes'}</button>
            </div>
          </form>
        ) : (
          <>
            <p className="profile-section-title">Profile Details</p>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{user.name}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{user.email}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{user.phone || 'Not set'}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Member Since</label>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setEditing(true)} id="edit-profile-btn">
              <Pencil size={16} /> Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
