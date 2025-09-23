import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function GET(request: NextRequest) {
  try {
    // 環境変数の検証
    const requiredVars = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];
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

    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || 'recipes/thumbnails/';
    const maxKeys = parseInt(searchParams.get('maxKeys') || '50');

    // バケット内のファイル一覧を取得
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
      Prefix: prefix,
      MaxKeys: maxKeys,
    });
    
    const response = await r2Client.send(command);
    
    const files = response.Contents?.map(obj => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
      publicUrl: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${obj.Key}`
    })) || [];
    
    return NextResponse.json({
      success: true,
      message: 'R2ファイル一覧取得成功',
      config: {
        bucketName: process.env.R2_BUCKET_NAME,
        prefix: prefix,
        maxKeys: maxKeys
      },
      files: files,
      totalCount: files.length,
      hasMore: response.IsTruncated
    });

  } catch (error: any) {
    console.error('R2 files list failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode
    }, { status: 500 });
  }
}
