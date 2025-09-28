import React from 'react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div>
      <h3>Checkout canceled</h3>
      <p>Your checkout was canceled. You can choose another plan or try again.</p>
      <p>
        Go back to <Link to="/pricing">Pricing</Link> or <Link to="/contact">Contact us</Link> if you need help.
      </p>
    </div>
  );
}
