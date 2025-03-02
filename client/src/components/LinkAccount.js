import React from 'react';
import { PlaidLink } from 'react-plaid-link';
import firebase from '../firebase';

function LinkAccount() {
  const onSuccess = (public_token, metadata) => {
    const functions = firebase.app().functions('us-central1'); // Adjust region if necessary
    const exchangeToken = functions.httpsCallable('api/exchange_public_token');

    exchangeToken({ public_token })
      .then((result) => {
        console.log('Access Token:', result.data.access_token);
        // Store access_token securely, perhaps in Firestore associated with the user
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <PlaidLink
      clientName="Your App"
      env="sandbox"
      product={['auth', 'transactions']}
      publicKey="your_public_key"
      onSuccess={onSuccess}
    >
      Connect a bank account
    </PlaidLink>
  );
}

export default LinkAccount;
