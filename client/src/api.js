const API = import.meta.env.VITE_API_URL || 'https://cycxagu4nx62zdw2bpexc56xh40iliuw.lambda-url.us-east-1.on.aws/api';

function handleUnauthorized(res) {
  if (res && res.status === 401) {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } catch {}
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.assign('/login');
    }
    return true;
  }
  return false;
}

async function parseOrThrow(res, fallbackMsg = 'Request failed') {
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(data.error || fallbackMsg);
    return data;
  } catch (e) {
    if (!res.ok) throw new Error(fallbackMsg);
    return {};
  }
}

export async function apiLogin(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  return parseOrThrow(res, 'Login failed');
}

export function authHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

export async function listCompanies() {
  const res = await fetch(`${API}/companies`, { headers: authHeaders() });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  return parseOrThrow(res, 'Failed to list users');
}

export async function createCompany(payload) {
  const res = await fetch(`${API}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  return parseOrThrow(res, 'Failed to create user');
}

export async function updateCompanyStatus(id, payload) {
  const res = await fetch(`${API}/companies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  return parseOrThrow(res, 'Failed to update user');
}

// Contact form submissions (admin only)
export async function listContacts() {
  const res = await fetch(`${API}/companies/contacts`, { headers: authHeaders() });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  return parseOrThrow(res, 'Failed to list contacts');
}
