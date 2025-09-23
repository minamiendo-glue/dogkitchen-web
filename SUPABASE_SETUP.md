# Supabase設定手順

## 1. Supabaseプロジェクトの作成

### 1.1 アカウント作成
1. [Supabase](https://supabase.com)にアクセス
2. GitHubアカウントでサインアップ（推奨）
3. ダッシュボードにログイン

### 1.2 プロジェクト作成
1. 「New Project」をクリック
2. プロジェクト設定：
   - **Name**: `dogkitchen-web`
   - **Database Password**: 強力なパスワードを設定
   - **Region**: `Asia Northeast (Tokyo)` を選択
3. 「Create new project」をクリック
4. プロジェクトの初期化完了まで待機（約2分）

## 2. データベーススキーマの設定

### 2.1 SQLエディタでスキーマを実行
1. ダッシュボードの左サイドバーから「SQL Editor」を選択
2. 「New query」をクリック
3. `supabase-schema.sql`の内容をコピー&ペースト
4. 「Run」をクリックして実行

### 2.2 テーブルの確認
1. 左サイドバーから「Table Editor」を選択
2. 以下のテーブルが作成されていることを確認：
   - `users`
   - `dog_profiles`
   - `recipes`
   - `favorite_recipes`

## 3. 認証設定

### 3.1 Authentication設定
1. 左サイドバーから「Authentication」→「Settings」を選択
2. **Site URL**を設定：
   - 開発環境: `http://localhost:3001`
   - 本番環境: `https://yourdomain.com`
3. **Redirect URLs**を設定：
   - `http://localhost:3001/auth/callback`
   - `https://yourdomain.com/auth/callback`

### 3.2 Email設定（オプション）
1. 「Authentication」→「Settings」→「SMTP Settings」
2. 独自のSMTPサーバーを使用する場合は設定
3. デフォルトではSupabaseのSMTPを使用

## 4. 環境変数の設定

### 4.1 API Keysの取得
1. 左サイドバーから「Settings」→「API」を選択
2. 以下の値をコピー：
   - **Project URL**
   - **anon public** key
   - **service_role** key（⚠️ 秘密キー）

### 4.2 .env.localファイルの更新
```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# 既存の設定（NextAuth.jsは削除予定）
# NEXTAUTH_URL=http://localhost:3001
# NEXTAUTH_SECRET=your_nextauth_secret_here

# Cloudflare Stream設定（維持）
CLOUDFLARE_STREAM_API_TOKEN=your_stream_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# Stripe設定（維持）
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

## 5. Row Level Security (RLS) の確認

### 5.1 ポリシーの確認
1. 「Table Editor」で各テーブルを選択
2. 「RLS」タブでポリシーが有効になっていることを確認
3. 以下のポリシーが設定されていることを確認：
   - ユーザーは自分のデータのみアクセス可能
   - レシピは公開されたもののみ誰でも閲覧可能

### 5.2 テスト用ユーザーの作成
1. 「Authentication」→「Users」を選択
2. 「Add user」をクリック
3. テスト用ユーザーを作成：
   - Email: `test@example.com`
   - Password: `password123`

## 6. 動作確認

### 6.1 開発サーバーの起動
```bash
npm run dev
```

### 6.2 認証機能のテスト
1. ブラウザで `http://localhost:3001/register` にアクセス
2. 新規ユーザー登録をテスト
3. メール確認（開発環境ではコンソールで確認）
4. ログイン機能をテスト

### 6.3 データベース接続の確認
1. 管理画面でレシピ作成をテスト
2. データがSupabaseに保存されることを確認
3. レシピ一覧でデータが表示されることを確認

## 7. トラブルシューティング

### 7.1 よくあるエラー

#### 「Invalid API key」
- 環境変数が正しく設定されているか確認
- `.env.local`ファイルがプロジェクトルートにあるか確認
- サーバーを再起動

#### 「Row Level Security policy violation」
- RLSポリシーが正しく設定されているか確認
- ユーザーがログインしているか確認
- ポリシーの条件を確認

#### 「Failed to fetch」
- Supabase URLが正しいか確認
- ネットワーク接続を確認
- CORS設定を確認

### 7.2 デバッグ方法

#### Supabaseダッシュボードでの確認
1. 「Logs」でエラーログを確認
2. 「Table Editor」でデータの状態を確認
3. 「Authentication」でユーザーの状態を確認

#### ブラウザの開発者ツール
1. NetworkタブでAPIリクエストを確認
2. Consoleタブでエラーメッセージを確認
3. Applicationタブでローカルストレージを確認

## 8. 本番環境への移行

### 8.1 本番用プロジェクトの作成
1. 新しいSupabaseプロジェクトを作成
2. 同じスキーマを適用
3. 本番用の環境変数を設定

### 8.2 ドメイン設定
1. 「Authentication」→「Settings」で本番ドメインを設定
2. CORS設定を更新
3. SSL証明書の確認

### 8.3 バックアップ設定
1. 「Settings」→「Database」でバックアップを設定
2. 定期的なバックアップを有効化
3. 復旧手順を確認

## 9. パフォーマンス最適化

### 9.1 インデックスの確認
```sql
-- インデックスの使用状況を確認
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### 9.2 クエリの最適化
- 適切なWHERE句の使用
- LIMIT句の活用
- JOINの最適化

### 9.3 キャッシュの活用
- Supabaseの自動キャッシュ機能
- フロントエンドでのキャッシュ実装

## 10. セキュリティチェック

### 10.1 定期的な確認項目
- [ ] RLSポリシーが適切に設定されている
- [ ] サービスロールキーが適切に管理されている
- [ ] 不要なAPIエンドポイントが公開されていない
- [ ] ユーザー入力の検証が適切に行われている

### 10.2 セキュリティアップデート
- Supabaseのアップデートを定期的に確認
- セキュリティパッチの適用
- 脆弱性の監視


