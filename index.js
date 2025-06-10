const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.FINNHUB_API_KEY || 'YOUR_API_KEY'; // Optional: or hardcode here

app.get('/api/stock', async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: 'symbol required' });

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});