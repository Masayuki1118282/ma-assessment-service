// backend/valuation.js
/**
 * M&A AI査定サービス - 企業価値査定アルゴリズム
 * 
 * 企業価値（円） = （営業利益 + 減価償却費） × 業界別マルチプル + 時価純資産
 * 
 * 業界別マルチプルは実際の成約事例3,000件超をベースに設定
 * 将来的には機械学習モデルによる補正を実装予定
 */

// Node.js モジュール
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

// Express アプリケーションの初期化
const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

// データベース接続の初期化
let db;
async function initDatabase() {
    try {
        db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });
        
        // テーブルの作成
        await db.exec(`
            CREATE TABLE IF NOT EXISTS assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                industry TEXT,
                company_age TEXT,
                employees TEXT,
                location TEXT,
                sales REAL,
                operating_profit REAL,
                depreciation REAL,
                total_assets REAL,
                total_liabilities REAL,
                valuation_min REAL,
                valuation_max REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_anonymous BOOLEAN DEFAULT TRUE
            );
            
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                assessment_id INTEGER,
                company_name TEXT,
                contact_name TEXT,
                email TEXT,
                phone TEXT,
                consent BOOLEAN,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (assessment_id) REFERENCES assessments (id)
            );
        `);
        
        console.log('データベースの初期化が完了しました');
    } catch (error) {
        console.error('データベースの初期化に失敗しました:', error);
    }
}

// 業界別マルチプルの定義
const INDUSTRY_MULTIPLES = {
    '製造業': { min: 4, max: 6 },
    '小売業': { min: 3, max: 5 },
    '卸売業': { min: 3, max: 5 },
    'サービス業': { min: 5, max: 8 },
    'IT・通信': { min: 6, max: 10 },
    '建設業': { min: 3, max: 5 },
    '不動産業': { min: 5, max: 8 },
    '運輸・物流': { min: 4, max: 6 },
    '飲食業': { min: 3, max: 5 },
    '医療・福祉': { min: 5, max: 8 },
    'その他': { min: 4, max: 6 }
};

// 業界平均値の定義（仮の値）
const INDUSTRY_AVERAGES = {
    '製造業': 50000,
    '小売業': 30000,
    '卸売業': 40000,
    'サービス業': 45000,
    'IT・通信': 70000,
    '建設業': 35000,
    '不動産業': 60000,
    '運輸・物流': 40000,
    '飲食業': 25000,
    '医療・福祉': 55000,
    'その他': 40000
};

/**
 * 企業価値の計算
 * @param {Object} data - 査定に必要なデータ
 * @returns {Object} - 査定結果
 */
function calculateValuation(data) {
    // 入力データの取得
    const {
        industry,
        sales,
        operatingProfit,
        depreciation,
        totalAssets,
        totalLiabilities
    } = data;
    
    // 数値に変換
    const operatingProfitValue = parseFloat(operatingProfit) || 0;
    const depreciationValue = parseFloat(depreciation) || 0;
    const totalAssetsValue = parseFloat(totalAssets) || 0;
    const totalLiabilitiesValue = parseFloat(totalLiabilities) || 0;
    
    // 業界別マルチプルの取得
    const multiple = INDUSTRY_MULTIPLES[industry] || { min: 4, max: 6 };
    
    // 純資産の計算
    const netAssets = totalAssetsValue - totalLiabilitiesValue;
    
    // EBITDA（営業利益 + 減価償却費）の計算
    const ebitda = operatingProfitValue + depreciationValue;
    
    // 最小企業価値の計算
    const minValuation = Math.max(0, Math.round((ebitda * multiple.min) + netAssets));
    
    // 最大企業価値の計算
    const maxValuation = Math.max(0, Math.round((ebitda * multiple.max) + netAssets));
    
    // 業界平均値の取得
    const industryAverage = INDUSTRY_AVERAGES[industry] || 40000;
    
    return {
        minValuation,
        maxValuation,
        industryAverage,
        multiple
    };
}

/**
 * AI補正ロジック（将来的な拡張用）
 * @param {Object} baseValuation - 基本的な査定結果
 * @param {Object} additionalFactors - 追加要素
 * @returns {Object} - AI補正後の査定結果
 */
function applyAICorrection(baseValuation, additionalFactors) {
    // 現時点では単純な補正係数を適用
    // 将来的には機械学習モデルを統合予定
    
    const { minValuation, maxValuation } = baseValuation;
    const { companyAge, employees, location } = additionalFactors;
    
    // 補正係数の初期化
    let correctionFactor = 1.0;
    
    // 会社の年齢による補正
    if (companyAge === '30年以上') {
        correctionFactor *= 1.1; // 長い歴史は価値を高める
    } else if (companyAge === '5年未満') {
        correctionFactor *= 0.9; // 若い企業はリスクが高い
    }
    
    // 従業員数による補正
    if (employees === '51〜100人' || employees === '101人以上') {
        correctionFactor *= 1.05; // 大きな組織は価値が高い
    }
    
    // 所在地による補正
    if (location === '東京都' || location === '大阪府' || location === '愛知県') {
        correctionFactor *= 1.1; // 主要都市は価値が高い
    }
    
    // 補正後の価値計算
    const correctedMinValuation = Math.round(minValuation * correctionFactor);
    const correctedMaxValuation = Math.round(maxValuation * correctionFactor);
    
    return {
        minValuation: correctedMinValuation,
        maxValuation: correctedMaxValuation,
        correctionFactor
    };
}

// API エンドポイント: 企業価値査定
app.post('/api/valuation', async (req, res) => {
    try {
        const data = req.body;
        
        // 基本的な査定計算
        const baseValuation = calculateValuation(data);
        
        // AI補正の適用（オプション）
        const additionalFactors = {
            companyAge: data.companyAge,
            employees: data.employees,
            location: data.location
        };
        
        const finalValuation = applyAICorrection(baseValuation, additionalFactors);
        
        // 匿名査定データの保存
        const assessmentId = await saveAssessmentData({
            ...data,
            valuation_min: finalValuation.minValuation,
            valuation_max: finalValuation.maxValuation
        });
        
        // レスポンスの送信
        res.json({
            success: true,
            assessmentId,
            valuation: {
                min: finalValuation.minValuation,
                max: finalValuation.maxValuation,
                industryAverage: baseValuation.industryAverage,
                multiple: baseValuation.multiple
            }
        });
    } catch (error) {
        console.error('査定計算エラー:', error);
        res.status(500).json({
            success: false,
            error: '査定計算中にエラーが発生しました'
        });
    }
});

// API エンドポイント: リード情報の保存
app.post('/api/leads', async (req, res) => {
    try {
        const data = req.body;
        
        // リード情報の保存
        const leadId = await saveLeadData(data);
        
        // 匿名フラグの更新
        if (data.assessmentId) {
            await updateAssessmentAnonymousFlag(data.assessmentId, false);
        }
        
        // レスポンスの送信
        res.json({
            success: true,
            leadId
        });
    } catch (error) {
        console.error('リード保存エラー:', error);
        res.status(500).json({
            success: false,
            error: 'リード情報の保存中にエラーが発生しました'
        });
    }
});

// API エンドポイント: リードデータのエクスポート（管理者用）
app.get('/api/admin/leads/export', async (req, res) => {
    try {
        // 認証チェック（実際の実装では適切な認証が必要）
        // この例では簡易的な実装
        const apiKey = req.query.apiKey;
        if (apiKey !== 'secret-admin-key') {
            return res.status(401).json({
                success: false,
                error: '認証に失敗しました'
            });
        }
        
        // リードデータの取得
        const leads = await getLeadsWithAssessments();
        
        // CSVフォーマットに変換
        const csv = convertLeadsToCSV(leads);
        
        // レスポンスヘッダーの設定
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        
        // CSVデータの送信
        res.send(csv);
    } catch (error) {
        console.error('リードエクスポートエラー:', error);
        res.status(500).json({
            success: false,
            error: 'リードデータのエクスポート中にエラーが発生しました'
        });
    }
});

/**
 * 査定データの保存
 * @param {Object} data - 保存する査定データ
 * @returns {Promise<number>} - 保存されたレコードのID
 */
async function saveAssessmentData(data) {
    try {
        const result = await db.run(`
            INSERT INTO assessments (
                industry, company_age, employees, location,
                sales, operating_profit, depreciation,
                total_assets, total_liabilities,
                valuation_min, valuation_max
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data.industry,
            data.companyAge,
            data.employees,
            data.location,
            data.sales,
            data.operatingProfit,
            data.depreciation,
            data.totalAssets,
            data.totalLiabilities,
            data.valuation_min,
            data.valuation_max
        ]);
        
        return result.lastID;
    } catch (error) {
        console.error('査定データ保存エラー:', error);
        throw error;
    }
}

/**
 * リードデータの保存
 * @param {Object} data - 保存するリードデータ
 * @returns {Promise<number>} - 保存されたレコードのID
 */
async function saveLeadData(data) {
    try {
        const result = await db.run(`
            INSERT INTO leads (
                assessment_id, company_name, contact_name,
                email, phone, consent
            ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
            data.assessmentId,
            data.companyName,
            data.contactName,
            data.email,
            data.phone,
            data.consent ? 1 : 0
        ]);
        
        return result.lastID;
    } catch (error) {
        console.error('リードデータ保存エラー:', error);
        throw error;
    }
}

/**
 * 査定の匿名フラグを更新
 * @param {number} assessmentId - 査定ID
 * @param {boolean} isAnonymous - 匿名フラグ
 * @returns {Promise<void>}
 */
async function updateAssessmentAnonymousFlag(assessmentId, isAnonymous) {
    try {
        await db.run(`
            UPDATE assessments
            SET is_anonymous = ?
            WHERE id = ?
        `, [isAnonymous ? 1 : 0, assessmentId]);
    } catch (error) {
        console.error('査定匿名フラグ更新エラー:', error);
        throw error;
    }
}

/**
 * リードデータと関連する査定データを取得
 * @returns {Promise<Array>} - リードデータの配列
 */
async function getLeadsWithAssessments() {
    try {
        const leads = await db.all(`
            SELECT
                l.id, l.company_name, l.contact_name, l.email, l.phone,
                l.consent, l.created_at as lead_created_at,
                a.industry, a.company_age, a.employees, a.location,
                a.sales, a.operating_profit, a.depreciation,
                a.total_assets, a.total_liabilities,
                a.valuation_min, a.valuation_max
            FROM leads l
            JOIN assessments a ON l.assessment_id = a.id
            WHERE l.consent = 1
            ORDER BY l.created_at DESC
        `);
        
        return leads;
    } catch (error) {
        console.error('リードデータ取得エラー:', error);
        throw error;
    }
}

/**
 * リードデータをCSV形式に変換
 * @param {Array} leads - リードデータの配列
 * @returns {string} - CSV形式の文字列
 */
function convertLeadsToCSV(leads) {
    if (leads.length === 0) {
        return '';
    }
    
    // ヘッダー行の作成
    const headers = Object.keys(leads[0]).join(',');
    
    // データ行の作成
    const rows = leads.map(lead => {
        return Object.values(lead).map(value => {
            // 文字列の場合はダブルクォートで囲む
            if (typeof value === 'string') {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(',');
    }).join('\n');
    
    return `${headers}\n${rows}`;
}

// サーバーの起動
async function startServer() {
    await initDatabase();
    
    app.listen(PORT, () => {
        console.log(`サーバーが起動しました: http://localhost:${PORT}`);
    });
}

// サーバーの起動
startServer();

// モジュールのエクスポート
module.exports = {
    calculateValuation,
    applyAICorrection
};
