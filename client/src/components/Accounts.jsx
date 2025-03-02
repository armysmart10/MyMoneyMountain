import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
import { addAccount, fetchAccounts } from '../firestore';
import './Accounts.css';

const Accounts = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({ name: '', type: 'Checking', balance: '' });
  const [showModal, setShowModal] = useState(false);

  // Line 17: Use useEffect to fetch accounts when the component mounts
  useEffect(() => {
    if (currentUser) {
      console.log("Current user:", currentUser);
      if (currentUser.uid) {
        fetchAccounts(currentUser.uid).then(setAccounts);
      } else {
        console.error("User is authenticated but UID is missing.");
      }
    } else {
      console.error("User is not authenticated.");
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
  };

  // Line 26: Update handleAddAccount function
  const handleAddAccount = () => {
    if (!currentUser || !currentUser.uid) {
      console.error('User not logged in or uid is missing.');
      return;
    }
    addAccount(currentUser.uid, newAccount.name, newAccount.type, newAccount.balance);
    setAccounts([...accounts, newAccount]);
    setNewAccount({ name: '', type: 'Checking', balance: '' });
    setShowModal(false);
  };

  const groupedAccounts = {
    Assets: {
      Checking: [],
      Savings: [],
      Investment: [],
      Other: [],
    },
    Liabilities: {
      Loans: [],
      Other: [],
    },
  };

  accounts.forEach((account) => {
    if (groupedAccounts.Assets[account.account_type]) {
      groupedAccounts.Assets[account.account_type].push(account);
    } else if (groupedAccounts.Liabilities[account.account_type]) {
      groupedAccounts.Liabilities[account.account_type].push(account);
    }
  });

  return (
    <main className="accounts-container">
      <div className="account-buttons">
        <button className="btn btn-primary">Fake Plaid Link</button>
        <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
          Add Account Manually
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Add Account</h2>
            <form className="add-account-form">
              <input
                type="text"
                name="name"
                placeholder="Account Name"
                value={newAccount.name}
                onChange={handleInputChange}
              />
              <select name="type" value={newAccount.type} onChange={handleInputChange}>
                <option value="Checking">Checking</option>
                <option value="Savings">Savings</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
                <option value="Loans">Loans</option>
              </select>
              <input
                type="number"
                name="balance"
                placeholder="Balance"
                value={newAccount.balance}
                onChange={handleInputChange}
              />
              <button type="button" onClick={handleAddAccount}>
                Add Account
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="accounts-sections">
        <div className="accounts-column">
          <h2>Assets</h2>
          {Object.keys(groupedAccounts.Assets).map((type) => (
            <div key={type} className="accounts-group">
              <h3>{type}</h3>
              <div className="account-section">
                {groupedAccounts.Assets[type].length > 0 ? (
                  groupedAccounts.Assets[type].map((account, index) => (
                    <div key={index} className="account-item">
                      <span className="account-name">{account.account_name}</span>
                      <span className="account-balance">{account.balance}</span>
                    </div>
                  ))
                ) : (
                  <p>No {type} accounts.</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="accounts-column">
          <h2>Liabilities</h2>
          {Object.keys(groupedAccounts.Liabilities).map((type) => (
            <div key={type} className="accounts-group">
              <h3>{type}</h3>
              <div className="account-section">
                {groupedAccounts.Liabilities[type].length > 0 ? (
                  groupedAccounts.Liabilities[type].map((account, index) => (
                    <div key={index} className="account-item">
                      <span className="account-name">{account.account_name}</span>
                      <span className="account-balance">{account.balance}</span>
                    </div>
                  ))
                ) : (
                  <p>No {type} accounts.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Accounts;
