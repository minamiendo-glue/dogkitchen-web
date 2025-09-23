# Cloudflare Stream 設定手順

## 1. Cloudflareアカウントの準備

### 1.1 アカウント作成
1. [Cloudflare](https://cloudflare.com)にアクセス
2. アカウントを作成（無料プランでも利用可能）
3. ダッシュボードにログイン

### 1.2 Streamの有効化
1. ダッシュボードの左サイドバーから「Stream」を選択
2. 「Get Started」をクリック
3. Streamプランを選択（無料プラン: 100分/月）

## 2. API認証情報の取得

### 2.1 API Tokenの作成
1. Cloudflareダッシュボードで「My Profile」→「API Tokens」
2. 「Create Token」をクリック
3. 「Custom token」を選択
4. 以下の権限を設定：
   - **Account**: `Cloudflare Stream:Edit`
   - **Zone Resources**: `Include All zones`
5. トークン名を入力（例: `dogkitchen-stream-api`）
6. 「Continue to summary」→「Create Token」
7. **重要**: トークンをコピーして安全に保管

### 2.2 Account IDの取得
1. ダッシュボードの右サイドバーで「Account ID」をコピー
2. または、任意のドメインの「Overview」ページで確認

## 3. 環境変数の設定

### 3.1 .env.localファイルの作成
プロジェクトルートに`.env.local`ファイルを作成：

```bash
# Cloudflare Stream設定
CLOUDFLARE_STREAM_API_TOKEN=your_actual_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_actual_account_id_here
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=your_actual_account_id_here
```

### 3.2 本番環境での設定
Vercel、Netlify等のホスティングサービスで環境変数を設定：

```bash
CLOUDFLARE_STREAM_API_TOKEN=your_actual_api_token_here
CLOUDFLARE_ACCOUNT_ID=your_actual_account_id_here
NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID=your_actual_account_id_here
```

## 4. 機能の確認

### 4.1 動画アップロード
1. 管理画面の「レシピ作成」ページにアクセス
2. 「メイン動画」セクションで動画ファイルをアップロード
3. アップロード完了後、動画IDが表示されることを確認

### 4.2 動画再生
1. レシピ詳細ページでアップロードした動画が再生されることを確認
2. 動画プレイヤーのコントロールが正常に動作することを確認

## 5. トラブルシューティング

### 5.1 よくあるエラー

#### 「Cloudflare Stream API credentials not configured」
- 環境変数が正しく設定されているか確認
- `.env.local`ファイルがプロジェクトルートにあるか確認
- サーバーを再起動

#### 「動画のアップロードに失敗しました」
- API Tokenの権限が正しく設定されているか確認
- Account IDが正しいか確認
- ファイルサイズが100MB以下か確認
- 動画形式が対応しているか確認（MP4, WebM, QuickTime）

#### 「動画の読み込みに失敗しました」
- `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID`が設定されているか確認
- ネットワーク接続を確認
- Cloudflare Streamダッシュボードで動画が正常にアップロードされているか確認

### 5.2 デバッグ方法

#### ログの確認
```bash
# 開発サーバーのログを確認
npm run dev

# ブラウザの開発者ツールでコンソールエラーを確認
```

#### APIの直接テスト
```bash
# 動画アップロードAPIのテスト
curl -X POST http://localhost:3000/api/cloudflare/stream/upload \
  -F "file=@test-video.mp4" \
  -F "type=main"
```

## 6. 料金について

### 6.1 無料プラン
- **ストリーミング**: 100分/月
- **ストレージ**: 100分/月
- **エンコーディング**: 100分/月

### 6.2 有料プラン
- **Starter**: $5/月（1,000分/月）
- **Growth**: $25/月（10,000分/月）
- **Business**: $125/月（100,000分/月）

### 6.3 使用量の確認
1. Cloudflareダッシュボードの「Stream」
2. 「Analytics」タブで使用量を確認
3. 必要に応じてプランをアップグレード

## 7. セキュリティ設定

### 7.1 本番環境での推奨設定
```javascript
// lib/cloudflare-stream.ts の設定
const uploadVideo = await cloudflareStream.uploadVideo(file, {
  maxDurationSeconds: 600,
  allowedOrigins: ['https://yourdomain.com'], // 特定ドメインのみ許可
  requireSignedURLs: true // 署名付きURLを要求
});
```

### 7.2 CORS設定
CloudflareダッシュボードでStreamの設定を確認し、適切なCORS設定を行う。

## 8. パフォーマンス最適化

### 8.1 動画の最適化
- 動画の解像度を適切に設定
- 長すぎる動画は分割する
- 必要に応じて動画の圧縮を行う

### 8.2 CDNの活用
Cloudflare Streamは自動的にCDNを使用するため、グローバルでの高速配信が可能。

## 9. 今後の拡張

### 9.1 機能追加の可能性
- 動画の自動字幕生成
- 動画の分析・統計
- 動画の自動タグ付け
- 動画の編集機能

### 9.2 他サービスとの連携
- Cloudinary（画像最適化）
- AWS S3（ファイルストレージ）
- データベース（メタデータ保存）

## 10. サポート

### 10.1 Cloudflareサポート
- [Cloudflare Stream Documentation](https://developers.cloudflare.com/stream/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Stream API Reference](https://developers.cloudflare.com/stream/api/)

### 10.2 問題報告
バグや問題が発生した場合は、以下の情報を含めて報告：
- エラーメッセージ
- ブラウザ情報
- ネットワーク状況
- 使用しているプラン
