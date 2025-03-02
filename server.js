const express = require('express');
const bodyParser = require('body-parser');
const plaid = require('plaid');

const app = express();
app.use(bodyParser.json());

const plaidClient = new plaid.Client({
  clientID: '67755355491dca001bd3009a',
  secret: '9f389e8dce2098eea8a862c9f57c8b',
  env: plaid.environments.sandbox, // Use the appropriate environment
});

app.post('/api/create_link_token', async (req, res) => {
  try {
    const linkTokenResponse = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: 'user-id',
      },
      client_name: 'Your App Name',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(linkTokenResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
