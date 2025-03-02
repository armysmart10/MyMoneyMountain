import React, { useState, useEffect } from 'react';
import { fetchAccounts, addTransaction } from '../firestore';
import './Budget.css';

const Budget = ({ currentUser }) => {
  const [accounts, setAccounts] = useState([]);
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      fetchAccounts(currentUser.uid).then((data) => {
        setAccounts(data);
        if (data.length > 0) {
          setNewTransaction(prev => ({ ...prev, accountId: data[0].id }));
        }
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitTransaction = () => {
    if (!currentUser || !currentUser.uid) {
      console.error("User not logged in.");
      return;
    }
    addTransaction(currentUser.uid, newTransaction.accountId, newTransaction)
      .then(() => {
        setShowModal(false);
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
      })
      .catch(error => {
        console.error("Error adding transaction:", error);
      });
  };

  return (
    <main className="budget-container">
      <h2>Budget</h2>
      <div className="budget-buttons">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Transaction
        </button>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h3>Add Transaction</h3>
            <form className="add-transaction-form">
              <label>Date:</label>
              <input type="date" name="date" value={newTransaction.date} onChange={handleInputChange} />
              <label>Account:</label>
              <select name="accountId" value={newTransaction.accountId} onChange={handleInputChange}>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.account_name}</option>
                ))}
              </select>
              <label>Payee:</label>
              <input type="text" name="payee" placeholder="Payee" value={newTransaction.payee} onChange={handleInputChange} />
              <label>Category:</label>
              <input type="text" name="category" placeholder="Category" value={newTransaction.category} onChange={handleInputChange} />
              <label>Memo:</label>
              <input type="text" name="memo" placeholder="Memo" value={newTransaction.memo} onChange={handleInputChange} />
              <label>Outflow:</label>
              <input type="number" name="outflow" placeholder="Outflow" value={newTransaction.outflow} onChange={handleInputChange} />
              <label>Inflow:</label>
              <input type="number" name="inflow" placeholder="Inflow" value={newTransaction.inflow} onChange={handleInputChange} />
              <label>Cleared:</label>
              <input type="checkbox" name="cleared" checked={newTransaction.cleared} onChange={handleInputChange} />
              <button type="button" onClick={submitTransaction}>Submit Transaction</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Budget;
