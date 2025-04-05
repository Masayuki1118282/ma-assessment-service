// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sendProposalEmail = require('./sendMail');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/send-proposal', async (req, res) => {
  try {
    const formData = req.body;
    await sendProposalEmail(formData);
    res.status(200).json({ message: '送信成功' });
  } catch (error) {
    console.error('❌ メール送信エラー:', error);
    res.status(500).json({ message: '送信エラー' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 サーバーが http://localhost:${PORT} で起動しました`);
});
