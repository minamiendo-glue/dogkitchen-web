# Stripe課金処理セットアップ手順

## 1. Stripeアカウントの設定

1. [Stripe Dashboard](https://dashboard.stripe.com/)にアクセス
2. アカウントを作成またはログイン
3. テストモードで開始

## 2. 環境変数の設定

`.env.local`ファイルに以下の環境変数を追加してください：

```env
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 環境変数の取得方法

1. **STRIPE_PUBLISHABLE_KEY**: Stripe Dashboard → Developers → API keys → Publishable key
2. **STRIPE_SECRET_KEY**: Stripe Dashboard → Developers → API keys → Secret key
3. **STRIPE_WEBHOOK_SECRET**: 後述のWebhook設定で取得

## 3. 価格設定の作成

1. Stripe Dashboard → Products → Create product
2. 以下の設定で作成：
   - Name: "プレミアムプラン"
   - Description: "愛犬の健康管理をサポートする全機能をご利用いただけます"
   - Pricing model: "Standard pricing"
   - Price: ¥500
   - Billing period: "Monthly"

3. 作成された価格IDを`lib/stripe.ts`の`PREMIUM_PLAN.priceId`に設定

## 4. Webhookの設定

1. Stripe Dashboard → Developers → Webhooks
2. "Add endpoint"をクリック
3. Endpoint URL: `http://localhost:3000/api/stripe/webhook`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Webhookシークレットをコピーして`.env.local`に設定

## 5. テストカード情報

テスト環境では以下のカード情報を使用できます：

- **成功**: 4242 4242 4242 4242
- **3D Secure認証**: 4000 0025 0000 3155
- **支払い失敗**: 4000 0000 0000 0002

## 6. 本番環境への移行

1. Stripe DashboardでLiveモードに切り替え
2. 新しいAPIキーを取得
3. 環境変数を本番用に更新
4. Webhookエンドポイントを本番URLに変更

## 注意事項

- テスト環境では実際の課金は発生しません
- 本番環境では必ず適切なセキュリティ設定を行ってください
- Webhookの設定は本番環境でも必須です




















