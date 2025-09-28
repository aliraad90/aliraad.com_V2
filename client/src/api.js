const API = import.meta.env.VITE_API_URL || '/api';

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
  return parseOrThrow(res, 'Failed to list companies');
}

export async function createCompany(payload) {
  const res = await fetch(`${API}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  return parseOrThrow(res, 'Failed to create company');
}

export async function updateCompanyStatus(id, payload) {
  const res = await fetch(`${API}/companies/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  return parseOrThrow(res, 'Failed to update company');
}

export async function downloadConfig(companyId) {
  const res = await fetch(`${API}/companies/${companyId}/config`, { headers: authHeaders() });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to download config');
  const blob = await res.blob();
  return blob;
}

export async function listClients() {
  const res = await fetch(`${API}/status/clients`, { headers: authHeaders() });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  return parseOrThrow(res, 'Failed to list clients');
}

export async function downloadOneClickWindows(companyId) {
  const res = await fetch(`${API}/companies/${companyId}/oneclick/windows`, { headers: authHeaders() });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to get Windows one-click');
  return await res.blob();
}

export async function downloadOneClickIOS(companyId) {
  const res = await fetch(`${API}/companies/${companyId}/oneclick/ios`, { headers: authHeaders() });
  if (handleUnauthorized(res)) throw new Error('Unauthorized');
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to get iOS one-click');
  return await res.blob();
}
