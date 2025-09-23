import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

export async function GET(request: NextRequest) {
  try {
    // 環境変数の検証
    const requiredVars = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME', 'R2_PUBLIC_URL'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: '環境変数が設定されていません',
        missingVars: missingVars
      }, { status: 400 });
    }

    // R2クライアントの作成
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    });

    // バケット一覧を取得して接続をテスト
    const command = new ListBucketsCommand({});
    const response = await r2Client.send(command);
    
    const bucketExists = response.Buckets?.some(bucket => bucket.Name === process.env.R2_BUCKET_NAME);
    
    return NextResponse.json({
      success: true,
      message: 'R2接続成功',
      config: {
        accountId: process.env.R2_ACCOUNT_ID,
        bucketName: process.env.R2_BUCKET_NAME,
        publicUrl: process.env.R2_PUBLIC_URL,
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      },
      buckets: response.Buckets?.map(bucket => ({
        name: bucket.Name,
        isTargetBucket: bucket.Name === process.env.R2_BUCKET_NAME
      })),
      targetBucketExists: bucketExists
    });

  } catch (error: any) {
    console.error('R2 connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode,
      details: {
        accountId: process.env.R2_ACCOUNT_ID,
        bucketName: process.env.R2_BUCKET_NAME,
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      }
    }, { status: 500 });
  }
}
