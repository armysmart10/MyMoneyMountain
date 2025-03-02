import React, { useState, useEffect } from 'react';
import { fetchAccounts, deleteAccount, fetchTransactions, deleteTransaction, addAccount } from '../firestore';
import './Accounts.css';

const Accounts = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({ name: '', type: 'Checking', balance: '' });
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchAccounts(currentUser.uid)
        .then(data => setAccounts(data))
        .catch(err => console.error("Error fetching accounts:", err));
    }
  }, [currentUser]);

  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
  };

  const handleAddAccount = () => {
    if (!currentUser || !currentUser.uid) {
      console.error('User not logged in or uid is missing.');
      return;
    }
    addAccount(currentUser.uid, newAccount.name, newAccount.type, newAccount.balance)
      .then(docId => {
        const updatedAccounts = [...accounts, { ...newAccount, id: docId }];
        setAccounts(updatedAccounts);
        setNewAccount({ name: '', type: 'Checking', balance: '' });
        setShowAccountModal(false);
      })
      .catch(error => console.error("Error adding account:", error));
  };

  const openTransactionsModal = (account) => {
    setSelectedAccount(account);
    fetchTransactions(currentUser.uid, account.id)
      .then(data => {
        setTransactions(data);
        setShowTransactionsModal(true);
      })
      .catch(err => console.error("Error fetching transactions:", err));
  };

  const handleDeleteTransaction = (transactionId, accountId) => {
    deleteTransaction(currentUser.uid, accountId, transactionId)
      .then(() => {
        fetchTransactions(currentUser.uid, accountId)
          .then(data => setTransactions(data))
          .catch(err => console.error("Error fetching transactions:", err));
      })
      .catch(error => console.error("Error deleting transaction:", error));
  };

  const handleDeleteAccount = (accountId) => {
    deleteAccount(currentUser.uid, accountId)
      .then(() => {
        const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
        setAccounts(updatedAccounts);
      })
      .catch(error => console.error("Error deleting account:", error));
  };

  const groupedAssets = {
    Checking: accounts.filter(acc => acc.account_type === 'Checking'),
    Savings: accounts.filter(acc => acc.account_type === 'Savings'),
    Investment: accounts.filter(acc => acc.account_type === 'Investment'),
    Other: accounts.filter(acc => acc.account_type === 'Other'),
  };
  const groupedLiabilities = {
    Loans: accounts.filter(acc => acc.account_type === 'Loans'),
    Other: accounts.filter(acc => acc.account_type === 'Other'),
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

      {showAccountModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAccountModal(false)}>&times;</span>
            <h2>Add Account</h2>
            <form className="add-account-form">
              <input type="text" name="name" placeholder="Account Name" value={newAccount.name} onChange={handleAccountInputChange} />
              <select name="type" value={newAccount.type} onChange={handleAccountInputChange}>
                <option value="Checking">Checking</option>
                <option value="Savings">Savings</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
                <option value="Loans">Loans</option>
              </select>
              <input type="number" name="balance" placeholder="Balance" value={newAccount.balance} onChange={handleAccountInputChange} />
              <button type="button" onClick={handleAddAccount}>Add Account</button>
            </form>
          </div>
        </div>
      )}

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
                        <button className="btn btn-delete" onClick={() => handleDeleteTransaction(tx.id, selectedAccount.id)}>Delete</button>
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
                      <span className="account-name" onClick={() => setShowTransactionsModal(true) || openTransactionsModal(account)} style={{ cursor: "pointer" }}>
                        {account.account_name}
                      </span>
                      <span className="account-balance">{account.balance}</span>
                      <button className="btn btn-delete" onClick={() => handleDeleteAccount(account.id)}>Delete</button>
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
                      <span className="account-name" onClick={() => setShowTransactionsModal(true) || openTransactionsModal(account)} style={{ cursor: "pointer" }}>
                        {account.account_name}
                      </span>
                      <span className="account-balance">{account.balance}</span>
                      <button className="btn btn-delete" onClick={() => handleDeleteAccount(account.id)}>Delete</button>
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
