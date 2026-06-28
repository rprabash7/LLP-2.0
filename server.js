const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

const payments = new Map();

function id() {
  return crypto.randomBytes(6).toString('hex');
}

app.post('/api/create-payment', (req, res) => {
  const amount = Number(req.body.amount || 0);
  const orderId = id();
  payments.set(orderId, { status: 'pending', amount });
  res.json({ orderId, status: 'pending', amount });
});

app.post('/webhook/payment', (req, res) => {
  const { orderId, status } = req.body || {};
  if (orderId && payments.has(orderId)) {
    payments.set(orderId, { ...payments.get(orderId), status });
  }
  res.json({ ok: true });
});

app.get('/api/payment-status/:orderId', (req, res) => {
  const data = payments.get(req.params.orderId) || { status: 'pending', amount: 0 };
  res.json(data);
});

app.listen(PORT, () => console.log('Server on', PORT));