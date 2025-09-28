import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Footer from './components/Footer.jsx';

export default function App() {
  const nav = useNavigate();
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    nav('/login');
  }
  const linkClass = ({ isActive }) => ` ${isActive ? 'active' : ''}`;
  return (
    <div>
      <header className="header">
        <div className="container header-inner">
          <div className="brand">
            <div>
              <div style={{ fontFamily: 'Sora, Inter, sans-serif', fontWeight: 700, letterSpacing: '.3px' }}>ALI RAAD HUSSEIN</div>
              <div className="muted" style={{ fontSize: 12 }}>IT Freelancer | Senior Network & System Enginner | PMP</div>
            </div>
          </div>
          <nav className="nav">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/services" className={linkClass}>Services</NavLink>
            <NavLink to="/portfolio" className={linkClass}>Portfolio</NavLink>
            <NavLink to="/certifications" className={linkClass}>Certifications</NavLink>
            <NavLink to="/pricing" className={linkClass}>Pricing</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
