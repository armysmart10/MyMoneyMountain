// client/src/components/Logout.js
import React from 'react';
import { auth } from '../firebase';

function Logout() {
  const handleLogout = () => {
    auth.signOut().then(() => {
      alert('Logged out successfully');
    });
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
