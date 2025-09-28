import React, { useEffect, useState } from 'react';
import { loadContent } from '../utils/content.js';

export default function Certifications() {
  const [site, setSite] = useState(null);
  useEffect(() => {
    (async () => {
      try { setSite(await loadContent('site.json')); } catch {}
    })();
  }, []);
  const certs = [
    { vendor: 'PMI', name: 'PMP' },
    { vendor: 'Cisco', name: 'CCNP' },
    { vendor: 'Cisco', name: 'CCNA' },
    { vendor: 'Microsoft', name: 'MCSA/MCSE' },
    { vendor: 'MikroTik', name: 'MTCNA / MTCRE' },
    { vendor: 'Siemens', name: 'Omnivise‑T3000 Admin' },
    { vendor: 'Fortinet', name: 'Fortinet (various)' },
  ];
  return (
    <div className="stack" style={{ padding: '24px 0' }}>
      <section className="stack card" style={{ padding: 20 }}>
        <div className="section-title">Certifications</div>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {certs.map((c, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div className="h3" style={{ fontWeight: 700 }}>{c.name}</div>
              <div className="muted">{c.vendor}</div>
            </div>
          ))}
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <a
            className="btn"
            href={site?.credly || 'https://www.credly.com/users/ali-hussein.ee75d7b8/badges#credly'}
            target="_blank" rel="noreferrer"
            style={{ fontSize: 12 }}
          >
            Verify on Credly
          </a>
        </div>
      </section>
    </div>
  );
}
