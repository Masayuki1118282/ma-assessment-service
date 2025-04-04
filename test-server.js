// テスト用のダミーデータ
const dummyPartnerLogos = [
  {
    name: "M&Aパートナーズ",
    logo: "partner-logo-1.svg"
  },
  {
    name: "企業価値研究所",
    logo: "partner-logo-2.svg"
  },
  {
    name: "事業承継コンサルティング",
    logo: "partner-logo-3.svg"
  }
];

// ダミー画像の作成
function createDummyImages() {
  const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80">
    <rect width="200" height="80" fill="#f0f0f0"/>
    <text x="100" y="40" font-family="Arial" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#555">
      LOGO
    </text>
  </svg>
  `;

  const heroSvgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="500" height="400" viewBox="0 0 500 400">
    <rect width="500" height="400" fill="#f7f9fc"/>
    <circle cx="250" cy="150" r="100" fill="#e0e5ec"/>
    <rect x="150" y="280" width="200" height="100" fill="#d0d5dc"/>
    <text x="250" y="200" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#2D5BFF">
      企業価値査定
    </text>
    <text x="250" y="330" font-family="Arial" font-size="18" text-anchor="middle" dominant-baseline="middle" fill="#1A2B3C">
      AI分析
    </text>
  </svg>
  `;

  const benefitsSvgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#f7f9fc"/>
    <circle cx="200" cy="100" r="70" fill="#e0e5ec"/>
    <path d="M160,100 L190,130 L240,80" stroke="#2D5BFF" stroke-width="8" fill="none"/>
    <rect x="100" y="200" width="200" height="50" fill="#d0d5dc"/>
    <text x="200" y="230" font-family="Arial" font-size="18" text-anchor="middle" dominant-baseline="middle" fill="#1A2B3C">
      安心・安全
    </text>
  </svg>
  `;

  // ディレクトリの作成
  const fs = require('fs');
  if (!fs.existsSync('./assets')) {
    fs.mkdirSync('./assets');
  }

  // SVGファイルの保存
  fs.writeFileSync('./assets/hero-image.svg', heroSvgContent);
  fs.writeFileSync('./assets/benefits-image.svg', benefitsSvgContent);
  
  // パートナーロゴの保存
  dummyPartnerLogos.forEach((partner, index) => {
    fs.writeFileSync(`./assets/${partner.logo}`, svgContent);
  });

  console.log('ダミー画像の作成が完了しました');
}

// テスト用のサーバー起動
function startTestServer() {
  const express = require('express');
  const app = express();
  const PORT = 3000;

  // 静的ファイルの提供
  app.use(express.static('./'));
  
  // APIエンドポイントのモック
  app.use(express.json());
  
  // 査定APIのモック
  app.post('/api/valuation', (req, res) => {
    const data = req.body;
    
    // 簡易的な査定計算
    const operatingProfit = parseFloat(data.operatingProfit) || 0;
    const depreciation = parseFloat(data.depreciation) || 0;
    const totalAssets = parseFloat(data.totalAssets) || 0;
    const totalLiabilities = parseFloat(data.totalLiabilities) || 0;
    
    // 業界別マルチプルの簡易設定
    const industryMultiples = {
      '製造業': { min: 4, max: 6 },
      '小売業': { min: 3, max: 5 },
      'サービス業': { min: 5, max: 8 },
      'IT・通信': { min: 6, max: 10 },
      'その他': { min: 4, max: 6 }
    };
    
    const multiple = industryMultiples[data.industry] || { min: 4, max: 6 };
    const netAssets = totalAssets - totalLiabilities;
    const ebitda = operatingProfit + depreciation;
    
    const minValuation = Math.max(0, Math.round((ebitda * multiple.min) + netAssets));
    const maxValuation = Math.max(0, Math.round((ebitda * multiple.max) + netAssets));
    
    // レスポンスの送信
    setTimeout(() => {
      res.json({
        success: true,
        assessmentId: Math.floor(Math.random() * 1000) + 1,
        valuation: {
          min: minValuation,
          max: maxValuation,
          industryAverage: 40000,
          multiple: multiple
        }
      });
    }, 1000); // 1秒の遅延を追加してリアルな感じに
  });
  
  // リード情報保存APIのモック
  app.post('/api/leads', (req, res) => {
    setTimeout(() => {
      res.json({
        success: true,
        leadId: Math.floor(Math.random() * 1000) + 1
      });
    }, 1000);
  });
  
  // サーバー起動
  app.listen(PORT, () => {
    console.log(`テストサーバーが起動しました: http://localhost:${PORT}`);
  });
}

// メイン実行関数
async function main() {
  try {
    // 必要なパッケージのインストール
    const { execSync } = require('child_process');
    console.log('必要なパッケージをインストールしています...');
    execSync('npm init -y && npm install express');
    
    // ダミー画像の作成
    console.log('ダミー画像を作成しています...');
    createDummyImages();
    
    // テストサーバーの起動
    console.log('テストサーバーを起動しています...');
    startTestServer();
    
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// スクリプトの実行
main();
