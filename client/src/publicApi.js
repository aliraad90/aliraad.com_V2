const API = `${(import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')}/public`;
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '';

export async function getPlans() {
  const res = await fetch(`${API}/plans`);
  if (!res.ok) throw new Error('Failed to load plans');
  return res.json();
}

export async function createCheckout(payload) {
  const res = await fetch(`${API}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Checkout failed');
  return res.json();
}

export async function sendContact(payload) {
  // If a third-party endpoint is configured (e.g., Formspree/Getform), use it client-side.
  if (CONTACT_ENDPOINT) {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    // Many services return 200/201 with a JSON body; some return 302/redirects. Handle both.
    if (res.ok) {
      try { return await res.json(); } catch { return { ok: true }; }
    }
    // Try to parse JSON error; fallback to text
    try {
      const err = await res.json();
      throw new Error(err.error || err.message || 'Failed to send message');
    } catch (_) {
      const txt = await res.text();
      throw new Error(txt || 'Failed to send message');
    }
  }
  // Default: use our backend route
  const res = await fetch(`${API}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to send message');
  return res.json();
}
