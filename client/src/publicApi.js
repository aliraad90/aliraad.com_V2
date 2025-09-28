const API = '/api/public';

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
  const res = await fetch(`${API}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to send message');
  return res.json();
}
