import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Success() {
  const qs = new URLSearchParams(useLocation().search);
  const plan = qs.get('plan');
  return (
    <div>
      <h3>Thank you!</h3>
      <p>Your purchase was successful{plan ? ` for plan ${plan}` : ''}. We will activate your subscription shortly.</p>
      <p>
        You can now <Link to="/login">log in</Link> or <Link to="/pricing">view plans</Link>.
      </p>
    </div>
  );
}
