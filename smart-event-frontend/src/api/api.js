/* ============================================
   API Integration Layer
   Smart Event Management System
   ============================================ */

const API_BASE = 'http://localhost:3005';  // API Gateway

// ---- Helpers ----

function getToken() {
  return localStorage.getItem('token');
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ---- User Service (port 3001) ----

export const userApi = {
  register(name, email, password, phone) {
    return request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    });
  },

  login(email, password) {
    return request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile() {
    return request('/api/users/profile');
  },

  updateProfile(data) {
    return request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  validateToken() {
    return request('/api/users/validate-token', {
      method: 'POST',
    });
  },
};

// ---- Event Service (port 3002) ----

export const eventApi = {
  getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.date) query.set('date', params.date);
    const qs = query.toString();
    return request(`/api/events${qs ? `?${qs}` : ''}`);
  },

  getById(id) {
    return request(`/api/events/${id}`);
  },

  create(eventData) {
    return request('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  update(id, eventData) {
    return request(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  delete(id) {
    return request(`/api/events/${id}`, {
      method: 'DELETE',
    });
  },

  checkAvailability(id) {
    return request(`/api/events/${id}/availability`);
  },
};

// ---- Registration Service (port 3003) ----

export const registrationApi = {
  book(eventId, ticketCount, notes) {
    return request('/api/registrations', {
      method: 'POST',
      body: JSON.stringify({ eventId, ticketCount, notes }),
    });
  },

  getMyBookings() {
    return request('/api/registrations/my-bookings');
  },

  getEventParticipants(eventId) {
    return request(`/api/registrations/event/${eventId}`);
  },

  cancel(id) {
    return request(`/api/registrations/${id}`, {
      method: 'DELETE',
    });
  },
};

// ---- Notification Service (port 3004) ----

export const notificationApi = {
  getMyNotifications() {
    return request('/api/notifications/my-notifications');
  },
};
