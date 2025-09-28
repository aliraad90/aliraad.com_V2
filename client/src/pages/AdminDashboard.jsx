import React, { useEffect, useState } from 'react';
import { listCompanies, createCompany, updateCompanyStatus, listClients } from '../api.js';

export default function AdminDashboard() {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '', contact_email: '', plan: '' });
  const [status, setStatus] = useState('');
  const [clients, setClients] = useState([]);

  async function refresh() {
    try {
      const [c, cl] = await Promise.all([listCompanies(), listClients()]);
      setCompanies(c);
      setClients(cl);
    } catch (e) {
      // Likely 401 -> api.js will redirect; show temporary status
      setStatus(e.message || 'Please login to continue');
    }
  }

  useEffect(() => { refresh(); }, []);

  async function submit(e) {
    e.preventDefault();
    setStatus('Creating...');
    try {
      const res = await createCompany(form);
      setStatus(`Created company. Company login: ${res.companyLogin.email} / ${res.companyLogin.password}. VPN user: ${res.vpn.username}`);
      setForm({ name: '', contact_email: '', plan: '' });
      await refresh();
    } catch (e) {
      setStatus(e.message);
    }
  }

  async function toggle(c) {
    const updated = await updateCompanyStatus(c.id, { enabled: !c.enabled });
    setCompanies((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
  }

  return (
    <div className="container stack">
      <section className="card" style={{ padding: 20 }}>
        <div className="stack" style={{ maxWidth: 520 }}>
          <div className="section-title">Create Company</div>
          <form onSubmit={submit} className="stack">
            <div className="stack">
              <label className="label">Name</label>
              <input className="input" placeholder="Acme Inc." value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="stack">
              <label className="label">Contact Email</label>
              <input className="input" placeholder="ops@acme.com" value={form.contact_email} onChange={(e)=>setForm({ ...form, contact_email: e.target.value })} />
            </div>
            <div className="stack">
              <label className="label">Plan</label>
              <input className="input" placeholder="pro" value={form.plan} onChange={(e)=>setForm({ ...form, plan: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
          {status && <div className="muted">{status}</div>}
        </div>
      </section>

      <section className="card" style={{ padding: 20 }}>
        <div className="section-title">Companies</div>
        <div className="stack" style={{ marginTop: 12 }}>
          {companies.length === 0 && <div className="muted">No companies yet.</div>}
          {companies.map((c) => (
            <div key={c.id} className="row" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
              <div className="row" style={{ gap: 10 }}>
                <b style={{ width: 220 }}>{c.name}</b>
                <span className="muted">{c.plan || '—'}</span>
              </div>
              <div className="row" style={{ gap: 10 }}>
                <span>{c.enabled ? 'Enabled' : 'Disabled'}</span>
                <button className="btn" onClick={() => toggle(c)}>{c.enabled ? 'Disable' : 'Enable'}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: 20 }}>
        <div className="section-title">Connected Clients</div>
        <div className="stack" style={{ marginTop: 12 }}>
          {clients.length === 0 && <div className="muted">No clients connected.</div>}
          {clients.map((cl, idx) => (
            <div key={idx} className="row" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
              <div className="row" style={{ gap: 12 }}>
                <b>{cl.name}</b>
                <span className="muted">{cl.ip}</span>
              </div>
              <div className="row" style={{ gap: 12 }}>
                <span className="muted">{cl.uptime}</span>
                <b>{cl.status}</b>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
