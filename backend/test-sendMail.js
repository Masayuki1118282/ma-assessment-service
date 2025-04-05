const sendProposalEmail = require('./sendMail');

const dummyData = {
  company: 'テスト株式会社',
  name: 'テスト太郎',
  email: 'test@example.com',
  phone: '090-1234-5678',
  consent: true
};

sendProposalEmail(dummyData)
  .then(() => console.log('📩 テストメール送信成功'))
  .catch(err => console.error('❌ メール送信失敗:', err));
