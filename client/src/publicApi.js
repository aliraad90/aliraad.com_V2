const API = `${(import.meta.env.VITE_API_URL || 'https://cycxagu4nx62zdw2bpexc56xh40iliuw.lambda-url.us-east-1.on.aws/api').replace(/\/$/, '')}`;
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '';

export async function getPlans() {
  // Plans functionality removed for personal website
  return { plans: [] };
}

export async function createCheckout(payload) {
  // Checkout functionality removed for personal website
  throw new Error('Checkout not available');
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
  
  // Use our Lambda backend route
  const { name, phone, email, message } = payload || {};
  const contactData = {
    name,
    email,
    subject: phone ? `Contact from ${name} (${phone})` : `Contact from ${name}`,
    message
  };
  
  const res = await fetch(`${API}/companies/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to send message');
  }
  
  return res.json();
}
