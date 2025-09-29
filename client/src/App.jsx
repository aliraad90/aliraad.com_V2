import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
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
          
          {/* Mobile menu button */}
          <button 
            className="mobile-menu-btn" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="nav">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/services" className={linkClass}>Services</NavLink>
            <NavLink to="/portfolio" className={linkClass}>Portfolio</NavLink>
            <NavLink to="/certifications" className={linkClass}>Certifications</NavLink>
            <NavLink to="/pricing" className={linkClass}>Pricing</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          </nav>
          
          {/* Mobile Navigation */}
          <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/portfolio">Portfolio</NavLink>
            <NavLink to="/certifications">Certifications</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
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
