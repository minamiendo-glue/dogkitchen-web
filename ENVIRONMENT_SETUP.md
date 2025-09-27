# 環境変数設定ガイド

## 開発環境 (.env.local)

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Stripe Configuration (テストキー)
STRIPE_PUBLISHABLE_KEY=pk_test_テスト公開キー
STRIPE_SECRET_KEY=sk_test_テスト秘密キー
STRIPE_WEBHOOK_SECRET=whsec_テストWebhookシークレット
```

## 本番環境 (.env.production)

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-key

# Stripe Configuration (本番キー)
STRIPE_PUBLISHABLE_KEY=pk_live_本番公開キー
STRIPE_SECRET_KEY=sk_live_本番秘密キー
STRIPE_WEBHOOK_SECRET=whsec_本番Webhookシークレット
```

## 設定手順

### 開発環境
1. `.env.local`ファイルを編集
2. テストキーを設定
3. `npm run dev`で開発サーバー起動

### 本番環境
1. `.env.production`ファイルを作成
2. 本番キーを設定
3. デプロイ時に環境変数を設定

## 注意事項

- テストキー: `pk_test_` / `sk_test_` で始まる
- 本番キー: `pk_live_` / `sk_live_` で始まる
- 本番キーは絶対に公開しない
- 各環境で異なるWebhookエンドポイントを設定

## Stripe Dashboard設定

### テストモード
- Webhook URL: `http://localhost:3000/api/stripe/webhook`
- 価格設定: テスト用の価格を作成

### 本番モード
- Webhook URL: `https://your-domain.com/api/stripe/webhook`
- 価格設定: 本番用の価格を作成






















