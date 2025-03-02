import React, { useState, useEffect } from 'react';
import { 
  fetchAccounts, 
  addAccount, 
  deleteAccount, 
  fetchTransactions, 
  deleteTransaction, 
  addTransactionAndUpdateBalance 
} from '../firestore';
import './Accounts.css';

const Accounts = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [newAccount, setNewAccount] = useState({ name: '', type: 'Checking', balance: '' });
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    accountId: '',
    payee: '',
    category: '',
    memo: '',
    outflow: '',
    inflow: '',
    cleared: false
  });

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchAccounts(currentUser.uid)
        .then(data => {
          setAccounts(data);
          if (data.length > 0 && !newTransaction.accountId) {
            setNewTransaction(prev => ({ ...prev, accountId: data[0].id }));
          }
        })
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
      .catch(error => console.error("Error fetching transactions:", error));
  };

  const handleDeleteAccount = (accountId) => {
    deleteAccount(currentUser.uid, accountId)
      .then(() => {
        const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
        setAccounts(updatedAccounts);
      })
      .catch(error => console.error("Error deleting account:", error));
  };

  const handleTransactionInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitTransaction = () => {
    if (!currentUser || !currentUser.uid) return;
    addTransactionAndUpdateBalance(currentUser.uid, newTransaction.accountId, newTransaction)
      .then(() => {
        fetchTransactions(currentUser.uid, newTransaction.accountId)
          .then(data => setTransactions(data))
          .catch(err => console.error("Error fetching transactions:", err));
        setShowTransactionModal(false);
        setNewTransaction({
          date: '',
          accountId: accounts.length > 0 ? accounts[0].id : '',
          payee: '',
          category: '',
          memo: '',
          outflow: '',
          inflow: '',
          cleared: false
        });
        fetchAccounts(currentUser.uid)
          .then(data => setAccounts(data))
          .catch(err => console.error("Error fetching accounts:", err));
      })
      .catch(err => console.error("Error adding transaction:", err));
  };

  // Group accounts: Assets (Checking, Savings, Investment, Other) and Liabilities (Loans, Other)
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
        <button className="btn btn-secondary" onClick={() => setShowAccountModal(true)}>Add Account Manually</button>
        <button className="btn btn-secondary" onClick={() => setShowTransactionModal(true)}>Add Transaction</button>
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

      {showTransactionModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowTransactionModal(false)}>&times;</span>
            <h3>Add Transaction</h3>
            <form className="add-transaction-form">
              <label>Date:</label>
              <input type="date" name="date" value={newTransaction.date} onChange={handleTransactionInputChange} />
              <label>Account:</label>
              <select name="accountId" value={newTransaction.accountId} onChange={handleTransactionInputChange}>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.account_name}</option>
                ))}
              </select>
              <label>Payee:</label>
              <input type="text" name="payee" placeholder="Payee" value={newTransaction.payee} onChange={handleTransactionInputChange} />
              <label>Category:</label>
              <input type="text" name="category" placeholder="Category" value={newTransaction.category} onChange={handleTransactionInputChange} />
              <label>Memo:</label>
              <input type="text" name="memo" placeholder="Memo" value={newTransaction.memo} onChange={handleTransactionInputChange} />
              <label>Outflow:</label>
              <input type="number" name="outflow" placeholder="Outflow" value={newTransaction.outflow} onChange={handleTransactionInputChange} />
              <label>Inflow:</label>
              <input type="number" name="inflow" placeholder="Inflow" value={newTransaction.inflow} onChange={handleTransactionInputChange} />
              <label>Cleared:</label>
              <input type="checkbox" name="cleared" checked={newTransaction.cleared} onChange={handleTransactionInputChange} />
              <button type="button" onClick={submitTransaction}>Submit Transaction</button>
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
                        <button className="btn btn-delete" onClick={() => handleDeleteTransaction(tx.id, selectedAccount.id)}>
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
                      <span className="account-name" style={{ cursor: "pointer" }} onClick={() => openTransactionsModal(account)}>
                        {account.account_name}
                      </span>
                      <span className="account-balance">{account.balance}</span>
                      <button className="btn btn-delete" onClick={() => handleDeleteAccount(account.id)}>
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
                      <span className="account-name" style={{ cursor: "pointer" }} onClick={() => openTransactionsModal(account)}>
                        {account.account_name}
                      </span>
                      <span className="account-balance">{account.balance}</span>
                      <button className="btn btn-delete" onClick={() => handleDeleteAccount(account.id)}>
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
    </main>
  );
};

export default Accounts;
