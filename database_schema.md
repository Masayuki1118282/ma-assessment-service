# M&A AI査定サービス データベーススキーマ設計

## 概要
M&A AI査定サービスのデータベーススキーマは、匿名査定データの保存、リード情報の管理、および管理者向け機能をサポートするように設計されています。

## データベース選択
- 開発環境: SQLite（軽量で設定が簡単）
- 本番環境: PostgreSQL（スケーラビリティとパフォーマンスに優れている）

## テーブル構造

### 1. assessments（査定データ）テーブル
匿名で行われた査定情報を保存します。

```sql
CREATE TABLE assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    industry TEXT,                  -- 業種
    company_age TEXT,               -- 創業年数
    employees TEXT,                 -- 従業員数
    location TEXT,                  -- 所在地
    sales REAL,                     -- 年間売上高（万円）
    operating_profit REAL,          -- 営業利益（万円）
    depreciation REAL,              -- 減価償却費（万円）
    total_assets REAL,              -- 総資産（万円）
    total_liabilities REAL,         -- 総負債（万円）
    valuation_min REAL,             -- 最小企業価値（万円）
    valuation_max REAL,             -- 最大企業価値（万円）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 作成日時
    is_anonymous BOOLEAN DEFAULT TRUE                -- 匿名フラグ
);
```

### 2. leads（リード情報）テーブル
提案を受け取りたいユーザーの連絡先情報を保存します。

```sql
CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_id INTEGER,          -- 関連する査定ID
    company_name TEXT,              -- 会社名
    contact_name TEXT,              -- 担当者名
    email TEXT,                     -- メールアドレス
    phone TEXT,                     -- 電話番号
    consent BOOLEAN,                -- 提案受け取り同意
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 作成日時
    FOREIGN KEY (assessment_id) REFERENCES assessments (id)
);
```

### 3. ma_companies（M&A会社）テーブル
提携M&A会社の情報を管理します。

```sql
CREATE TABLE ma_companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT,              -- 会社名
    contact_email TEXT,             -- 連絡先メール
    api_key TEXT,                   -- API連携用キー
    is_active BOOLEAN DEFAULT TRUE, -- アクティブ状態
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 作成日時
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- 更新日時
);
```

### 4. lead_distributions（リード配信）テーブル
M&A会社へのリード情報配信状況を記録します。

```sql
CREATE TABLE lead_distributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,                -- リードID
    ma_company_id INTEGER,          -- M&A会社ID
    status TEXT,                    -- 配信状態（pending, sent, viewed）
    sent_at TIMESTAMP,              -- 配信日時
    viewed_at TIMESTAMP,            -- 閲覧日時
    FOREIGN KEY (lead_id) REFERENCES leads (id),
    FOREIGN KEY (ma_company_id) REFERENCES ma_companies (id)
);
```

### 5. admin_users（管理者）テーブル
サービス管理者のアカウント情報を管理します。

```sql
CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,           -- ユーザー名
    password_hash TEXT,             -- パスワードハッシュ
    email TEXT UNIQUE,              -- メールアドレス
    is_active BOOLEAN DEFAULT TRUE, -- アクティブ状態
    last_login TIMESTAMP,           -- 最終ログイン日時
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 作成日時
);
```

### 6. industry_multiples（業界別マルチプル）テーブル
業界ごとの評価倍率を管理します。AIモデルの学習に使用します。

```sql
CREATE TABLE industry_multiples (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    industry TEXT UNIQUE,           -- 業種
    min_multiple REAL,              -- 最小倍率
    max_multiple REAL,              -- 最大倍率
    avg_multiple REAL,              -- 平均倍率
    sample_count INTEGER,           -- サンプル数
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 最終更新日時
);
```

### 7. valuation_history（査定履歴）テーブル
AIモデルの学習用に匿名化された査定履歴を保存します。

```sql
CREATE TABLE valuation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    industry TEXT,                  -- 業種
    company_size TEXT,              -- 企業規模
    ebitda REAL,                    -- EBITDA
    net_assets REAL,                -- 純資産
    valuation REAL,                 -- 査定額
    multiple_used REAL,             -- 使用倍率
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 作成日時
);
```

## インデックス設計

```sql
-- 査定テーブルのインデックス
CREATE INDEX idx_assessments_industry ON assessments(industry);
CREATE INDEX idx_assessments_created_at ON assessments(created_at);

-- リードテーブルのインデックス
CREATE INDEX idx_leads_assessment_id ON leads(assessment_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- リード配信テーブルのインデックス
CREATE INDEX idx_lead_distributions_lead_id ON lead_distributions(lead_id);
CREATE INDEX idx_lead_distributions_ma_company_id ON lead_distributions(ma_company_id);
CREATE INDEX idx_lead_distributions_status ON lead_distributions(status);
```

## データアクセス制御

### 匿名データの自動削除ポリシー
匿名で行われた査定データは、セキュリティとプライバシー保護のため、一定期間後に自動的に削除されます。

```sql
-- 30日以上経過した匿名査定データを削除するトリガー
CREATE TRIGGER delete_old_anonymous_assessments
AFTER INSERT ON assessments
BEGIN
    DELETE FROM assessments 
    WHERE is_anonymous = TRUE 
    AND datetime(created_at) < datetime('now', '-30 days');
END;
```

### データアクセス権限
- 匿名ユーザー: 査定機能のみアクセス可能
- リードユーザー: 自身の査定結果とリード情報にアクセス可能
- M&A会社: 同意を得たリード情報のみアクセス可能
- 管理者: すべてのデータにアクセス可能

## データフロー

1. **匿名査定フロー**
   - ユーザーが匿名で査定を実行
   - `assessments`テーブルに匿名フラグ付きでデータ保存
   - 査定結果をユーザーに表示

2. **リード獲得フロー**
   - ユーザーが連絡先情報を入力し提案を希望
   - `leads`テーブルにリード情報を保存
   - `assessments`テーブルの匿名フラグをFALSEに更新

3. **リード配信フロー**
   - 管理者がリード情報を確認
   - 提携M&A会社にリード情報を配信
   - `lead_distributions`テーブルに配信状況を記録

4. **AI学習データ収集フロー**
   - 匿名化された査定データを`valuation_history`テーブルに保存
   - 業界別の統計データを`industry_multiples`テーブルに集計
   - AIモデルの定期的な再学習に使用

## データバックアップ戦略

1. **定期バックアップ**
   - 日次の完全バックアップ
   - 時間単位の増分バックアップ

2. **バックアップ保持ポリシー**
   - 日次バックアップ: 30日間保持
   - 週次バックアップ: 3ヶ月間保持
   - 月次バックアップ: 1年間保持

3. **災害復旧計画**
   - 地理的に分散したバックアップストレージ
   - 復旧手順の文書化と定期的なテスト

## セキュリティ対策

1. **データ暗号化**
   - 保存データの暗号化（特に個人情報）
   - 通信の暗号化（HTTPS）

2. **アクセス制御**
   - ロールベースのアクセス制御
   - 最小権限の原則に基づく権限設定

3. **監査ログ**
   - データベースアクセスの監査ログ記録
   - 管理者操作の監査証跡

## 将来の拡張性

1. **AIモデル統合**
   - 業界別マルチプルの自動更新
   - 機械学習モデルによる査定精度の向上

2. **CRM連携**
   - 主要CRMシステムとのAPI連携
   - リードデータの自動同期

3. **分析ダッシュボード**
   - 業界別の査定統計
   - リードコンバージョン率の分析
