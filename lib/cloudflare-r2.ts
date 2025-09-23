import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// 環境変数の検証
function validateR2EnvVars() {
  const requiredVars = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME', 'R2_PUBLIC_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`R2設定エラー: 以下の環境変数が設定されていません: ${missingVars.join(', ')}`);
  }
}

// 環境変数を検証してからクライアントを作成
validateR2EnvVars();

// Cloudflare R2クライアントの設定
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // R2では必須
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export interface UploadResult {
  url: string;
  key: string;
}

/**
 * ファイルをCloudflare R2にアップロード
 */
export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string
): Promise<UploadResult> {
  try {
    console.log('R2 upload attempt:', {
      bucket: BUCKET_NAME,
      key: key,
      contentType: contentType,
      fileSize: file.length,
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    });

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      // R2ではACLは不要（バケットレベルで設定）
    });

    await r2Client.send(command);
    
    // パブリックURLを生成
    const publicUrl = `${PUBLIC_URL}/${key}`;
    
    console.log('R2 upload successful:', { url: publicUrl, key });
    
    return {
      url: publicUrl,
      key: key,
    };
  } catch (error: any) {
    console.error('R2 upload failed:', {
      error: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode,
      bucket: BUCKET_NAME,
      key: key,
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    });
    
    // より詳細なエラーメッセージ
    if (error.code === 'InvalidAccessKeyId') {
      throw new Error('R2認証エラー: アクセスキーIDが無効です。環境変数R2_ACCESS_KEY_IDを確認してください。');
    } else if (error.code === 'SignatureDoesNotMatch') {
      throw new Error('R2認証エラー: シークレットアクセスキーが無効です。環境変数R2_SECRET_ACCESS_KEYを確認してください。');
    } else if (error.code === 'NoSuchBucket') {
      throw new Error(`R2認証エラー: バケット「${BUCKET_NAME}」が見つかりません。環境変数R2_BUCKET_NAMEを確認してください。`);
    } else if (error.code === 'AccessDenied') {
      throw new Error('R2認証エラー: アクセスが拒否されました。R2の権限設定を確認してください。');
    } else {
      throw new Error(`R2アップロードエラー: ${error.message || error}`);
    }
  }
}

/**
 * R2からファイルを削除
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('R2 delete failed:', error);
    throw new Error(`ファイルの削除に失敗しました: ${error}`);
  }
}

/**
 * 署名付きURLを生成（プライベートファイル用）
 */
export async function getSignedUrlForR2(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Signed URL generation failed:', error);
    throw new Error(`署名付きURLの生成に失敗しました: ${error}`);
  }
}

/**
 * ファイル名を安全に生成
 */
export function generateSafeFileName(originalName: string, prefix: string = ''): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');
  
  return `${prefix}${timestamp}-${randomString}-${baseName}.${extension}`;
}

/**
 * コンテンツタイプをファイル拡張子から判定
 */
export function getContentTypeFromFileName(fileName: string): string {
  const extension = fileName.toLowerCase().split('.').pop();
  
  const contentTypes: { [key: string]: string } = {
    // 画像
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    
    // 動画
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    '3gp': 'video/3gpp',
    '3gpp': 'video/3gpp',
    'asf': 'video/x-ms-asf',
    'mkv': 'video/x-matroska',
    'ogv': 'video/ogg',
    'ogg': 'video/ogg',
    'm4v': 'video/x-m4v',
    'mpeg': 'video/mpeg',
    'mpg': 'video/mpeg',
    'mpe': 'video/mpeg',
    'qt': 'video/quicktime',
    
    // その他
    'pdf': 'application/pdf',
    'txt': 'text/plain',
  };
  
  return contentTypes[extension || ''] || 'application/octet-stream';
}

// 環境変数の検証
export function validateR2Config(): void {
  const requiredEnvVars = [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'R2_PUBLIC_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`以下の環境変数が設定されていません: ${missingVars.join(', ')}`);
  }
}
