const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');


const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const PLAID_CLIENT_ID = '67755355491dca001bd3009a';
const PLAID_SECRET = '9f389e8dce2098eea8a862c9f57c8b';
const PLAID_ENV = 'sandbox'; // 'sandbox', 'development', or 'production'

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      // Optionally specify 'Plaid-Version' if needed
    },
  },
});

const client = new PlaidApi(configuration);

app.post('/exchange_public_token', async (req, res) => {
    const { public_token } = req.body;
    try {
      const tokenResponse = await client.itemPublicTokenExchange({
        public_token: public_token,
      });
      const access_token = tokenResponse.data.access_token;
      const item_id = tokenResponse.data.item_id;
  
      // TODO: Store access_token and item_id securely
      res.json({ access_token, item_id });
    } catch (error) {
      console.error('Error exchanging public token:', error.response.data);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
