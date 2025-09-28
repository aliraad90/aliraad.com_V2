import React, { useEffect, useState } from 'react';
import { downloadConfig, listClients, downloadOneClickWindows, downloadOneClickIOS } from '../api.js';

export default function CompanyDashboard() {
  const [companyId, setCompanyId] = useState('');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Decode JWT to get companyId
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.companyId) setCompanyId(payload.companyId);
      }
    } catch {}
  }, []);

  async function doDownload() {
    if (!companyId) return;
    const blob = await downloadConfig(companyId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vpn-config.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function refreshClients() {
    const cl = await listClients();
    setClients(cl);
  }

  async function oneClickWindows() {
    if (!companyId) return;
    const blob = await downloadOneClickWindows(companyId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oneclick-win.ps1';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function oneClickIOS() {
    if (!companyId) return;
    const blob = await downloadOneClickIOS(companyId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vpn-ios.mobileconfig';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container stack">
      <section className="card" style={{ padding: 20 }}>
        <div className="stack" style={{ maxWidth: 560 }}>
          <div>
            <div className="section-title">Download Config</div>
            <div className="muted">Get your VPN client configuration file</div>
          </div>
          <div className="stack">
            <label className="label">Company ID</label>
            <input className="input" placeholder="Enter Company ID" value={companyId} onChange={(e)=>setCompanyId(e.target.value)} />
            {!companyId && <div className="muted">Tip: Login as a company user to auto-fill your Company ID.</div>}
          </div>
          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={doDownload} disabled={!companyId}>Download Config (TXT)</button>
            <button className="btn" onClick={oneClickWindows} disabled={!companyId}>One-Click Connect (Windows)</button>
            <button className="btn" onClick={oneClickIOS} disabled={!companyId}>One-Click Connect (iOS)</button>
          </div>
        </div>
      </section>

      <section className="card" style={{ padding: 20 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="section-title">Connected Clients</div>
          <button className="btn" onClick={refreshClients}>Refresh</button>
        </div>
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
