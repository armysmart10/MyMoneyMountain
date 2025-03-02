import React, { useEffect } from 'react';
import './Accounts.css';

const Accounts = () => {
  useEffect(() => {
    console.log("Accounts component mounted");
  }, []);

  return (
    <main className="accounts-container">
      <h2>Accounts Page</h2>
      <p>Link your bank accounts to view transactions and manage your finances.</p>
    </main>
  );
};

export default Accounts;
