# M&A AI査定WEBサービス 要件分析

## サービス概要
匿名・無料で利用できるM&A査定サービスで、直近の決算書をもとにAIが企業価値（売却想定価格）を即時算出します。査定結果ページで「実名＋オプトイン」を取得し、M&Aコンサル会社に販売・連携する仕組みです。入力内容に応じて、実際の成約事例3,000件超をベースにしたマルチプル法で価格を提示します。

## 機能要件

### 査定ロジック
- 企業価値（円） = （営業利益 + 減価償却費） × 業界別マルチプル + 時価純資産
- 営業利益・減価償却費・純資産は、直近1期分の決算書データをもとにユーザーが入力
- 業界別マルチプルは固定値で設定（将来的にはAIで補正可能）

### UI/UX・画面構成
1. **ランディングページ（LP）**
   - ファーストビュー：キャッチコピー、サブコピー、CTAボタン
   - ステップ解説セクション：3ステップの流れ
   - メリット訴求セクション：ユーザーメリットと利用ケース
   - 査定フォーム：ステップ入力方式
   - 査定結果ページ：推定売却価格と提案受取りCTA
   - FAQセクション：よくある質問と回答
   - フッター：運営会社情報、プライバシーポリシー、特商法表記

2. **フォーム設計**
   - 業種選択（プルダウン）
   - 売上入力（数値）
   - 営業利益入力（数値）
   - 減価償却費入力（任意、数値）
   - 総資産入力（数値）
   - 総負債入力（数値）

3. **査定結果表示**
   - 推定売却価格（範囲表示）
   - 信頼性補強メッセージ
   - 実名・連絡先入力フォーム（オプトイン）

### データ処理
- 匿名データの一時保存と処理
- オプトイン情報（会社名・連絡先・売却意向）の取得と保存
- M&Aコンサル会社へのリード情報提供機能（CSV出力またはCRM連携）

## 技術スタック選定

### フロントエンド
- **HTML5/CSS3/JavaScript**: 基本的なウェブ技術
- **Bootstrap 5**: レスポンシブデザインのフレームワーク
- **jQuery**: DOM操作とアニメーション
- **Chart.js**: 査定結果のグラフ表示（オプション）

### バックエンド
- **Node.js**: サーバーサイドJavaScript
- **Express**: Webアプリケーションフレームワーク
- **SQLite**: 軽量データベース（プロトタイプ用）

### デプロイ
- 静的ファイルホスティング（HTML/CSS/JS部分）
- サーバーレス関数（査定ロジック部分）

## 開発ロードマップ

### フェーズ1: 基本設計と準備（現在）
- 要件分析と整理
- 技術スタック選定
- プロジェクト構造設計

### フェーズ2: フロントエンド開発
- LPデザイン実装
- フォーム設計と実装
- レスポンシブ対応

### フェーズ3: バックエンド開発
- 査定ロジック実装
- データベース設計と実装
- API設計と実装

### フェーズ4: 統合とテスト
- フロントエンドとバックエンドの統合
- 機能テスト
- パフォーマンス最適化

### フェーズ5: コンテンツ作成と最終調整
- コピーライティング
- FAQ・プライバシーポリシー作成
- 最終調整

### フェーズ6: デプロイと納品
- サービスのデプロイ
- ドキュメント作成
- 納品準備
