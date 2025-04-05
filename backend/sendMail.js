// backend/sendMail.js
const nodemailer = require('nodemailer');

async function sendProposalEmail(data) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sozoosns@gmail.com',
      pass: 'euhpobbaufnrlhpl' // ← アプリパスワード（16桁）
    }
  });

  const mailOptions = {
    from: 'sozoosns@gmail.com',
    to: 'mirai.1118@icloud.com',
    subject: '【M&A提案希望】新しい連絡先が届きました',
    text: `
📩 M&A AI査定 フォーム入力内容

【会社名】 ${data.companyName || '（未入力）'}
【担当者名】 ${data.contactName || '（未入力）'}
【メールアドレス】 ${data.email || '（未入力）'}
【電話番号】 ${data.phone || '（未入力）'}

▼ 基本情報
【業種】 ${data.industry || '（未入力）'}
【創業年数】 ${data.companyAge || '（未入力）'}
【従業員数】 ${data.employees || '（未入力）'}
【所在地】 ${data.location || '（未入力）'}

▼ 財務情報（単位：万円）
【年間売上高】 ${data.sales || '（未入力）'}
【営業利益】 ${data.operatingProfit || '（未入力）'}
【減価償却費】 ${data.depreciation || '（未入力）'}
【総資産】 ${data.totalAssets || '（未入力）'}
【総負債】 ${data.totalLiabilities || '（未入力）'}

▼ AIによる査定結果（自動算出）
【想定企業価値】 ${data.valuationMin || '???'} 万円 〜 ${data.valuationMax || '???'} 万円

【提案の同意】 ${data.consent ? 'はい' : 'いいえ'}

---
このメールはAIによって自動生成されました。
（M&A AI査定サービスより）
    `
  };

  await transporter.sendMail(mailOptions);
  console.log('✅ メール送信完了（AI査定付き）');
}

module.exports = sendProposalEmail;
