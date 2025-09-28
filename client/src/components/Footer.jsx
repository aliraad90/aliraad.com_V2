import React, { useEffect, useState } from 'react';
import { loadContent } from '../utils/content.js';

export default function Footer() {
  const [site, setSite] = useState(null);
  useEffect(() => {
    (async () => {
      try { setSite(await loadContent('site.json')); } catch {}
    })();
  }, []);

  return (
    <footer className="card" style={{ marginTop: 24, padding: 16 }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          {site?.email && (
            <a href={`mailto:${site.email}`} className="btn" style={{ fontSize: 12 }}>Email</a>
          )}
          {site?.phone && (
            <a href={`tel:${site.phone.replace(/\s+/g, '')}`} className="btn" style={{ fontSize: 12 }}>Call</a>
          )}
          {site?.phone && (
            <a href={`https://wa.me/${site.phone.replace(/\D+/g, '')}`} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 12 }}>WhatsApp</a>
          )}
          {site?.linkedin && (
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 12 }}>LinkedIn</a>
          )}
          {site?.credly && (
            <a href={site.credly} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 12 }}>Verify on Credly</a>
          )}
        </div>
        <div className="muted" style={{ fontSize: 12 }}>
          {site?.footerNote || '© Ali Raad Hussein'}
        </div>
      </div>
    </footer>
  );
}
