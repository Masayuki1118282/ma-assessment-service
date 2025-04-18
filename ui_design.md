# M&A AI査定WEBサービス UI/UXデザイン設計書

## 全体デザインコンセプト

### カラースキーム
- **メインカラー**: #2D5BFF（ブルー） - 信頼性・専門性を表現
- **アクセントカラー**: #FF6B2D（オレンジ） - CTAボタンやハイライト要素に使用
- **ベースカラー**: #FFFFFF（白）、#F7F9FC（薄いグレー） - 背景色
- **テキストカラー**: #1A2B3C（濃紺）、#5A6B7C（グレー） - 本文・補足テキスト

### タイポグラフィ
- **見出し**: Noto Sans JP Bold - サイズ: 32px〜48px
- **サブ見出し**: Noto Sans JP Medium - サイズ: 24px〜28px
- **本文**: Noto Sans JP Regular - サイズ: 16px
- **小見出し・補足**: Noto Sans JP Light - サイズ: 14px

### デザイン要素
- 角丸要素（border-radius: 8px）を基調
- 影効果（box-shadow）で立体感を演出
- アイコンは線画ベースのシンプルなデザイン
- 余白を十分に取り、視認性と可読性を確保

## セクション別レイアウト設計

### 1. ファーストビュー（FV）

#### デスクトップレイアウト
- **構成**: 左右2カラム（左:テキスト 右:イメージ）
- **高さ**: 画面高さの80%程度
- **要素配置**:
  - 左側（幅50%）: ロゴ、メインキャッチ、サブキャッチ、CTAボタン
  - 右側（幅50%）: 企業ビルとAIのイラスト/画像

#### モバイルレイアウト
- **構成**: 上下構成（上:テキスト 下:イメージ）
- **高さ**: 画面高さの90%程度
- **要素配置**:
  - 上部: ロゴ、メインキャッチ、サブキャッチ
  - 中央: CTAボタン（幅90%）
  - 下部: イラスト/画像（縮小版）

#### デザイン詳細
- **背景**: グラデーション（#F7F9FC → #FFFFFF）
- **メインキャッチ**: 「あなたの会社、いくらで売れるか知っていますか？」（フォントサイズ: デスクトップ48px、モバイル32px）
- **サブキャッチ**: 「匿名・無料・3分で完了。後継者がいなくても安心の第一歩」（フォントサイズ: デスクトップ24px、モバイル18px）
- **CTAボタン**: 「今すぐAI査定をはじめる」（背景色: #FF6B2D、テキスト色: #FFFFFF、パディング: 16px 32px、フォントサイズ: 18px）
- **イラスト**: ビジネスビルとAI分析をイメージしたイラスト

### 2. サービスの3ステップ（ステップブロック）

#### デスクトップレイアウト
- **構成**: 横並び3カラム
- **高さ**: 固定高さ（400px程度）
- **要素配置**:
  - 上部: セクションタイトル「たった3ステップで企業価値がわかる」
  - 中央: 3つのステップを横並びで表示
  - 各ステップ: アイコン、ステップ番号、タイトル、説明文

#### モバイルレイアウト
- **構成**: 縦並び
- **高さ**: 可変（コンテンツに合わせる）
- **要素配置**:
  - 上部: セクションタイトル
  - 下部: 3つのステップを縦に並べて表示

#### デザイン詳細
- **背景**: 白（#FFFFFF）
- **セクションタイトル**: フォントサイズ32px、中央揃え
- **ステップボックス**: 
  - 背景: 白（#FFFFFF）
  - 枠線: なし
  - 影効果: box-shadow: 0 4px 12px rgba(0,0,0,0.05)
- **ステップ番号**: 円形（直径40px）、背景色: #2D5BFF、テキスト色: #FFFFFF
- **アイコン**: 線画スタイル、サイズ64px×64px
- **ステップタイトル**: フォントサイズ20px、フォント: Noto Sans JP Medium
- **説明文**: フォントサイズ16px、フォント: Noto Sans JP Regular、行間1.5

### 3. ベネフィット・安心感ブロック

#### デスクトップレイアウト
- **構成**: 左右2カラム（左:イメージ 右:テキスト）
- **高さ**: 固定高さ（500px程度）
- **要素配置**:
  - 左側（幅40%）: 安心感を表現するイラスト/画像
  - 右側（幅60%）: セクションタイトル、ベネフィットリスト

#### モバイルレイアウト
- **構成**: 上下構成（上:イメージ 下:テキスト）
- **高さ**: 可変（コンテンツに合わせる）
- **要素配置**:
  - 上部: イラスト/画像（縮小版）
  - 下部: セクションタイトル、ベネフィットリスト

#### デザイン詳細
- **背景**: 薄いグレー（#F7F9FC）
- **セクションタイトル**: 「安心して利用できる3つの理由」（フォントサイズ: 32px）
- **ベネフィットリスト**:
  - チェックマーク: ✓（色: #2D5BFF）
  - 各項目: アイコン付きの箇条書き
  - フォントサイズ: 18px
  - 項目間隔: 24px
- **イラスト**: 盾や鍵などのセキュリティを表現するイラスト

### 4. 査定フォーム（ステップ1）

#### デスクトップレイアウト
- **構成**: カード形式のフォーム
- **幅**: 画面幅の60%程度（最大800px）
- **要素配置**:
  - 上部: フォームタイトル、説明文
  - 中央: 入力フィールド（2列構成）
  - 下部: 進行ボタン

#### モバイルレイアウト
- **構成**: カード形式のフォーム（縦長）
- **幅**: 画面幅の90%程度
- **要素配置**:
  - 上部: フォームタイトル、説明文
  - 中央: 入力フィールド（1列構成）
  - 下部: 進行ボタン

#### デザイン詳細
- **背景**: 白（#FFFFFF）
- **カード**: 
  - 背景: 白（#FFFFFF）
  - 枠線: 1px solid #E0E5EC
  - 角丸: border-radius: 12px
  - 影効果: box-shadow: 0 8px 24px rgba(0,0,0,0.08)
- **フォームタイトル**: 「企業情報を入力してください」（フォントサイズ: 24px）
- **説明文**: 「決算書をお手元にご用意ください」（フォントサイズ: 16px、色: #5A6B7C）
- **入力フィールド**:
  - ラベル: フォントサイズ14px、色: #5A6B7C
  - 入力欄: 高さ48px、枠線: 1px solid #D0D5DC、角丸: border-radius: 6px
  - フォーカス時: 枠線: 2px solid #2D5BFF
- **進行ボタン**: 「次へ進む」（背景色: #2D5BFF、テキスト色: #FFFFFF、パディング: 14px 28px、フォントサイズ: 16px）

### 5. 査定結果ページ（ステップ2）

#### デスクトップレイアウト
- **構成**: カード形式の結果表示
- **幅**: 画面幅の70%程度（最大900px）
- **要素配置**:
  - 上部: 結果タイトル
  - 中央: 金額表示、グラフ/チャート
  - 下部: 説明文、CTAフォーム

#### モバイルレイアウト
- **構成**: カード形式の結果表示（縦長）
- **幅**: 画面幅の90%程度
- **要素配置**:
  - 上部: 結果タイトル
  - 中央: 金額表示、グラフ/チャート（縮小版）
  - 下部: 説明文、CTAフォーム

#### デザイン詳細
- **背景**: 薄いグレー（#F7F9FC）
- **結果カード**: 
  - 背景: 白（#FFFFFF）
  - 枠線: なし
  - 角丸: border-radius: 12px
  - 影効果: box-shadow: 0 8px 24px rgba(0,0,0,0.08)
- **結果タイトル**: 「AI査定結果」（フォントサイズ: 28px）
- **金額表示**:
  - フォントサイズ: 48px
  - フォント: Noto Sans JP Bold
  - 色: #2D5BFF
- **グラフ/チャート**: 横バーチャート（業界平均との比較）
- **説明文**: 「この価格は3,000件以上のM&A成約データから導き出されました」（フォントサイズ: 16px）
- **CTAフォーム**:
  - タイトル: 「提案を受け取りたい方は会社名・連絡先を入力してください」（フォントサイズ: 18px）
  - 入力フィールド: 会社名、担当者名、メールアドレス、電話番号
  - 同意チェックボックス: 「M&A会社からの提案を受け取ることに同意します」
  - 送信ボタン: 「提案を受け取る」（背景色: #FF6B2D、テキスト色: #FFFFFF）

### 6. FAQセクション

#### デスクトップレイアウト
- **構成**: アコーディオン形式
- **幅**: 画面幅の80%程度（最大1000px）
- **要素配置**:
  - 上部: セクションタイトル
  - 中央: FAQ項目（アコーディオン）

#### モバイルレイアウト
- **構成**: アコーディオン形式（縦長）
- **幅**: 画面幅の90%程度
- **要素配置**:
  - 上部: セクションタイトル
  - 中央: FAQ項目（アコーディオン）

#### デザイン詳細
- **背景**: 白（#FFFFFF）
- **セクションタイトル**: 「よくある質問」（フォントサイズ: 32px）
- **FAQ項目**:
  - 背景: 薄いグレー（#F7F9FC）
  - 角丸: border-radius: 8px
  - 質問部分: パディング: 16px、フォントサイズ: 18px、フォント: Noto Sans JP Medium
  - 回答部分: パディング: 16px 16px 24px 16px、フォントサイズ: 16px、フォント: Noto Sans JP Regular
  - アイコン: 「+」（閉じている状態）、「-」（開いている状態）

### 7. フッター

#### デスクトップレイアウト
- **構成**: 横並び3カラム
- **高さ**: 固定高さ（200px程度）
- **要素配置**:
  - 左側: 運営会社ロゴ、会社情報
  - 中央: リンク集（プライバシーポリシー、特商法表記など）
  - 右側: 提携M&Aコンサル会社ロゴ

#### モバイルレイアウト
- **構成**: 縦並び
- **高さ**: 可変（コンテンツに合わせる）
- **要素配置**:
  - 上部: 運営会社ロゴ、会社情報
  - 中央: リンク集
  - 下部: 提携M&Aコンサル会社ロゴ

#### デザイン詳細
- **背景**: 濃紺（#1A2B3C）
- **テキスト色**: 白（#FFFFFF）
- **リンク色**: 薄いグレー（#D0D5DC）
- **リンクホバー色**: 白（#FFFFFF）
- **運営会社情報**: フォントサイズ: 14px、行間1.5
- **コピーライト**: フォントサイズ: 12px、色: #8A9BAC

## レスポンシブデザイン対応

### ブレイクポイント
- **モバイル**: 〜767px
- **タブレット**: 768px〜991px
- **デスクトップ**: 992px〜

### モバイル対応ポイント
- CTAボタンは画面下部に固定表示（position: fixed）
- フォーム入力は1ステップずつ表示（マルチステップ方式）
- 画像・イラストは縮小表示
- フォントサイズを全体的に小さく調整
- 余白を適切に調整（狭く）

### タブレット対応ポイント
- 2カラムレイアウトを基本とする
- フォームは横幅80%程度に設定
- CTAボタンは固定表示せず、コンテンツ内に配置

## インタラクション設計

### スクロールアニメーション
- 各セクションが画面内に入ったときにフェードイン
- ステップブロックは順番に表示（遅延アニメーション）

### フォームインタラクション
- フィールドフォーカス時の視覚的フィードバック
- 入力エラー時のインラインバリデーション
- ステップ間の滑らかな遷移アニメーション

### CTAボタン
- ホバー時の拡大エフェクト（transform: scale(1.05)）
- クリック時の押し込みエフェクト（transform: scale(0.98)）

### 査定結果表示
- 数値のカウントアップアニメーション
- グラフの描画アニメーション

## アクセシビリティ対応
- 十分なコントラスト比の確保（WCAG AAレベル以上）
- キーボードナビゲーション対応
- スクリーンリーダー対応（適切なaria属性の使用）
- フォーカス可視化の徹底
