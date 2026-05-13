const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(error.error || 'Erreur serveur');
  }

  return res.json();
}

export const api = {
  // Auth
  login: (name, role) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ name, role }),
    }),

  // Employees
  getEmployees: () => request('/employees'),

  // Leave requests
  getLeaves: (employeeName) => {
    const params = employeeName
      ? `?employee_name=${encodeURIComponent(employeeName)}`
      : '';
    return request(`/leaves${params}`);
  },

  createLeave: (data) =>
    request('/leaves', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateLeaveStatus: (id, status) =>
    request(`/leaves/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Meetings
  getMeetings: () => request('/meetings'),

  createMeeting: (data) =>
    request('/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
