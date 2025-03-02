import React, { useState, useEffect } from 'react';
import { PlaidLink } from 'react-plaid-link';
import { exchangePublicToken } from '../plaid'; // Function to exchange public token
import './Accounts.css';

const Accounts = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [assets, setAssets] = useState({
    checking: [{ name: 'Bank of America', balance: '$2,500' }],
    savings: [{ name: 'Ally Bank', balance: '$10,000' }],
    investment: [{ name: 'Robinhood', balance: '$5,000' }],
    other: [{ name: 'Cash', balance: '$500' }],
  });

  const [liabilities, setLiabilities] = useState({
    debts: [{ name: 'Student Loan', balance: '$15,000' }],
    other: [{ name: 'Credit Card', balance: '$2,000' }],
  });

  const onSuccess = (publicToken, metadata) => {
    exchangePublicToken(publicToken).then((response) => {
      console.log('Access token:', response.accessToken);
    }).catch((error) => {
      console.error('Error exchanging public token:', error);
    });
  };

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch('/api/create_link_token', { method: 'POST' });
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
      }
    };

    createLinkToken();
  }, []);

  return (
    <main className="accounts-container">
      <div className="account-buttons">
        {linkToken && (
          <PlaidLink
            token={linkToken}
            onSuccess={onSuccess}
          >
            <button className="btn btn-primary">Link with Plaid</button>
          </PlaidLink>
        )}
        <button className="btn btn-secondary">Add Manually</button>
      </div>
      <div className="accounts-columns">
        <div className="accounts-column">
          <h3>Assets</h3>
          <div className="account-section">
            <h4>Checking</h4>
            <ul>
              {assets.checking.map((account, index) => (
                <li key={index}>{account.name}: {account.balance}</li>
              ))}
            </ul>
          </div>
          <div className="account-section">
            <h4>Savings</h4>
            <ul>
              {assets.savings.map((account, index) => (
                <li key={index}>{account.name}: {account.balance}</li>
              ))}
            </ul>
          </div>
          <div className="account-section">
            <h4>Investment</h4>
            <ul>
              {assets.investment.map((account, index) => (
                <li key={index}>{account.name}: {account.balance}</li>
              ))}
            </ul>
          </div>
          <div className="account-section">
            <h4>Other</h4>
            <ul>
              {assets.other.map((account, index) => (
                <li key={index}>{account.name}: {account.balance}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="accounts-column">
          <h3>Liabilities</h3>
          <div className="account-section">
            <h4>Debts</h4>
            <ul>
              {liabilities.debts.map((account, index) => (
                <li key={index}>{account.name}: {account.balance}</li>
              ))}
            </ul>
          </div>
          <div className="account-section">
            <h4>Other</h4>
            <ul>
              {liabilities.other.map((account, index) => (
                <li key={index}>{account.name}: {account.balance}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Accounts;
