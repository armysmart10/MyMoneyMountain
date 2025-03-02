import axios from 'axios';

const exchangePublicToken = async (publicToken) => {
  try {
    const response = await axios.post('/api/exchange_public_token', { public_token: publicToken });
    return response.data;
  } catch (error) {
    throw new Error('Failed to exchange public token');
  }
};

export { exchangePublicToken };
