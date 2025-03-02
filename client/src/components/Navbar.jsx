import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation
import { auth } from '../firebase'; // Import the auth object from Firebase configuration
import './Navbar.css';

const Navbar = ({ currentUser }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">Money Mountain</Link>
        <ul className="nav-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/accounts">Accounts</Link></li>
          <li><Link to="/investments">Investments</Link></li>
          <li><Link to="/planning">Planning</Link></li>
          <li><Link to="/support">Support</Link></li>
        </ul>
        <div className="nav-action">
          {currentUser ? (
            <button onClick={() => auth.signOut()} className="btn btn-primary">Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
