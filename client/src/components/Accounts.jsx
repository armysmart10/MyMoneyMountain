import React, { useState, useEffect } from 'react';
import { fetchAccounts, deleteAccount, fetchTransactions } from '../firestore';
import './Accounts.css';

const Accounts = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  
  // State and modal to show transactions for a selected account
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Fetch accounts from Firestore when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchAccounts(currentUser.uid).then(data => {
        setAccounts(data);
      }).catch(err => console.error("Error fetching accounts:", err));
    }
  }, [currentUser]);

  const handleDeleteAccount = (accountId) => {
    if (!currentUser || !currentUser.uid) {
      console.error("User not authenticated");
      return;
    }
    deleteAccount(currentUser.uid, accountId)
      .then(() => {
        const updated = accounts.filter(acc => acc.id !== accountId);
        setAccounts(updated);
      })
      .catch(error => console.error("Error deleting account:", error));
  };

  // Called when a user clicks on an account's name.
  const openTransactionsModal = (account) => {
    setSelectedAccount(account);
    if (currentUser && currentUser.uid && account.id) {
      fetchTransactions(currentUser.uid, account.id)
        .then(data => {
          setTransactions(data);
          setShowTransactionsModal(true);
        })
        .catch(error => console.error("Error fetching transactions:", error));
    }
  };

  // Group accounts into two sets: Assets and Liabilities.  
  // For this example, assume:
  //   • Assets: accounts with types Checking, Savings, Investment, Other
  //   • Liabilities: accounts with type Loans
  const groupedAssets = {
    Checking: accounts.filter(acc => acc.account_type === 'Checking'),
    Savings: accounts.filter(acc => acc.account_type === 'Savings'),
    Investment: accounts.filter(acc => acc.account_type === 'Investment'),
    Other: accounts.filter(acc => acc.account_type === 'Other'),
  };
  const groupedLiabilities = {
    Loans: accounts.filter(acc => acc.account_type === 'Loans'),
    // you can add more liability groups here if needed
  };

  return (
    <main className="accounts-container">
      <h2>Accounts</h2>
      <div className="account-buttons">
        <button className="btn btn-primary">Fake Plaid Link</button>
        <button className="btn btn-secondary" onClick={() => setShowAccountModal(true)}>
          Add Account Manually
        </button>
      </div>

      {/* The modal for adding accounts is omitted for brevity since you're focusing on transactions,
          but you could add similar modal code here if needed. */}
      
      <div className="accounts-sections">
        <div className="accounts-column">
          <h2>Assets</h2>
          {Object.keys(groupedAssets).map(type => (
            <div key={type} className="accounts-group">
              <h3>{type}</h3>
              <div className="account-section">
                {groupedAssets[type].length > 0 ? (
                  groupedAssets[type].map(account => (
                    <div key={account.id} className="account-item">
                      <span 
                        className="account-name" 
                        style={{cursor: 'pointer'}} 
                        onClick={() => openTransactionsModal(account)}>
                        {account.account_name}
                      </span>
                      <span className="account-balance">{account.balance}</span>
                      <button 
                        className="btn btn-delete" 
                        onClick={() => handleDeleteAccount(account.id)}>
                        Delete
                      </button>
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
          {Object.keys(groupedLiabilities).map(type => (
            <div key={type} className="accounts-group">
              <h3>{type}</h3>
              <div className="account-section">
                {groupedLiabilities[type].length > 0 ? (
                  groupedLiabilities[type].map(account => (
                    <div key={account.id} className="account-item">
                      <span 
                        className="account-name" 
                        style={{cursor: 'pointer'}} 
                        onClick={() => openTransactionsModal(account)}>
                        {account.account_name}
                      </span>
                      <span className="account-balance">{account.balance}</span>
                      <button 
                        className="btn btn-delete" 
                        onClick={() => handleDeleteAccount(account.id)}>
                        Delete
                      </button>
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

      {showTransactionsModal && selectedAccount && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowTransactionsModal(false)}>&times;</span>
            <h3>Transactions for {selectedAccount.account_name}</h3>
            {transactions.length > 0 ? (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Payee</th>
                    <th>Category</th>
                    <th>Memo</th>
                    <th>Inflow</th>
                    <th>Outflow</th>
                    <th>Cleared</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td>{tx.payee}</td>
                      <td>{tx.category}</td>
                      <td>{tx.memo}</td>
                      <td>{tx.inflow}</td>
                      <td>{tx.outflow}</td>
                      <td>{tx.cleared ? "Yes" : "No"}</td>
                      <td>
                        <button 
                          className="btn btn-delete" 
                          onClick={() => handleDeleteTransaction(tx.id, selectedAccount.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No transactions found.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Accounts;
