import React from 'react';

export default function Portfolio() {
  return (
    <div className="stack" style={{ padding: '24px 0' }}>
      {/* 1) HERO INTRO */}
      <section className="card" style={{ padding: 20 }}>
        <div className="stack">
          <div className="h2" style={{ fontWeight: 700 }}>Ali Raad Hussein</div>
          <div className="section-subtitle">Freelance IT Consultant | Network & System Administrator | PMP‑Certified Project Manager</div>
          <p className="muted" style={{ margin: 0, maxWidth: 900 }}>
            IT professional with 12+ years of experience spanning network engineering, systems administration, and
            project leadership. I help organizations design
            secure networks, modernize infrastructure, and execute projects with measurable outcomes.
          </p>
        </div>
      </section>

      {/* 2) KEY SERVICES */}
      <section className="card" style={{ padding: 20 }}>
        <div className="section-title">Key Services</div>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="h3" style={{ fontWeight: 700 }}>Network Design & Optimization</div>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
              <li>Cisco, MikroTik, Routing Protocols, OSPF, EIGRP, Etc</li>
              <li>Firewalls, VPNs, secure access</li>
              <li>Monitoring and performance tuning</li>
            </ul>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="h3" style={{ fontWeight: 700 }}>System Administration</div>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
              <li>Windows Server, Microsoft 365</li>
              <li>VMware, virtualization, backups/DR</li>
              <li>Active Directory, DNS, DHCP, GPO</li>
            </ul>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="h3" style={{ fontWeight: 700 }}>Cybersecurity Solutions</div>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
              <li>Fortinet, Microsoft Security</li>
              <li>Firewall policy & hardening, VPNs</li>
              <li>Security baselines & monitoring</li>
            </ul>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="h3" style={{ fontWeight: 700 }}>Cloud Solutions</div>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
              <li>Azure, AWS, Google Cloud</li>
              <li>Hybrid connectivity, identity/IAM</li>
              <li>Migrations & cost governance</li>
            </ul>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="h3" style={{ fontWeight: 700 }}>Project Management</div>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
              <li>IT projects, documentation, PMO</li>
              <li>Team leadership (5–30 staff)</li>
              <li>PMP‑certified execution</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3) FEATURED PROJECTS / CASE STUDIES */}
      <section className="card" style={{ padding: 20 }}>
        <div className="section-title">Featured Projects & Case Studies</div>
        <div className="stack" style={{ marginTop: 12 }}>
          {/* Siemens */}
          <div className="card" style={{ padding: 16 }}>
            <div className="h3" style={{ fontWeight: 700 }}>Siemens Energy — Maisan Power Plant</div>
            <div className="muted">IT Network & System Administrator</div>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
              <li>Administered SPPA‑T3000 (Omnivise‑T3000) system</li>
              <li>Designed and implemented a secure IT network</li>
              <li>Reduced downtime using monitoring tools (PRTG, SolarWinds)</li>
            </ul>
          </div>
          {/* Al-Riyadh */}
          <div className="card" style={{ padding: 16 }}>
            <div className="h3" style={{ fontWeight: 700 }}>Al‑Riyadh Cables Company</div>
            <div className="muted">Network Administrator</div>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
              <li>Led IT team to upgrade infrastructure</li>
              <li>Improved data protection via new security protocols</li>
            </ul>
          </div>
          {/* SOSi / KBR / Uruk */}
          <div className="card" style={{ padding: 16 }}>
            <div className="h3" style={{ fontWeight: 700 }}>SOSi International / KBR / Uruk Contracting</div>
            <div className="muted">Network/IT Operations</div>
            <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
              <li>Managed IT operations for international clients</li>
              <li>Supervised 5–30 staff members</li>
              <li>Reduced network downtime by ~20%</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4) CERTIFICATIONS SHOWCASE */}
      <section className="card" style={{ padding: 20 }}>
        <div className="section-title">Certifications</div>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {[
            'PMP — PMI',
            'CCNP ENCOR 350‑401',
            'CCNA 200‑125',
            'MikroTik MTCNA',
            'MikroTik MTCRE',
            'Microsoft MCSA/MCSE',
            'Siemens Omnivise‑T3000 Admin',
            'Fortinet NSE 1 & 2',
          ].map((c, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div className="h3" style={{ fontWeight: 700 }}>{c}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5) TESTIMONIALS / REFERENCES */}
      <section className="card" style={{ padding: 20 }}>
        <div className="section-title">Testimonials / References</div>
        <p className="muted" style={{ marginTop: 8 }}>References available upon request. Short testimonials can be added here.</p>
      </section>
    </div>
  );
}
