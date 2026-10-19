// API Client for Next.js User Management Backend
// Uses VITE_API_BASE_URL in production (e.g., https://your-project.vercel.app),
// or falls back to local relative path '/api/users' during local dev proxy.
const SERVER_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
  : '';
const API_BASE = `${SERVER_URL}/api/users`;

export async function fetchUsersApi(filters = {}) {
  const query = new URLSearchParams();
  if (filters.search) query.append('search', filters.search);
  if (filters.role && filters.role !== 'ALL') query.append('role', filters.role);
  if (filters.department && filters.department !== 'ALL') query.append('department', filters.department);
  if (filters.status && filters.status !== 'ALL') query.append('status', filters.status);

  const url = `${API_BASE}${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const result = await res.json();
  return result.data || [];
}

export async function createUserApi(userData) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error(`Failed to create user: ${res.statusText}`);
  const result = await res.json();
  return result.data;
}

export async function updateUserApi(id, updateData) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error(`Failed to update user: ${res.statusText}`);
  const result = await res.json();
  return result.data;
}

export async function deleteUserApi(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete user: ${res.statusText}`);
  return await res.json();
}

export async function bulkUsersApi(action, ids, status = null) {
  const res = await fetch(`${API_BASE}/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ids, status }),
  });
  if (!res.ok) throw new Error(`Bulk action failed: ${res.statusText}`);
  return await res.json();
}

export async function resetSeedApi() {
  const res = await fetch(`${API_BASE}/seed`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Reset failed: ${res.statusText}`);
  const result = await res.json();
  return result.data;
}
