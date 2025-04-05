// api/send-proposal.js
const sendProposalEmail = require('../backend/sendMail');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    await sendProposalEmail(data);
    res.status(200).json({ message: '送信成功' });
  } catch (error) {
    console.error('❌ メール送信エラー:', error);
    res.status(500).json({ message: '送信失敗', error: error.toString() });
  }
};
