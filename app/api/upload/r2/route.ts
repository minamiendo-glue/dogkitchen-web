import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2, generateSafeFileName, getContentTypeFromFileName, validateR2Config } from '@/lib/cloudflare-r2';

export async function POST(request: NextRequest) {
  try {
    // R2設定の検証
    validateR2Config();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが指定されていません' },
        { status: 400 }
      );
    }

    // ファイルサイズの検証（500MB制限）
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'ファイルサイズが大きすぎます（最大500MB）' },
        { status: 400 }
      );
    }

    // ファイルタイプの検証（MIMEタイプと拡張子の両方をチェック）
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/x-flv',
      'video/3gpp',
      'video/x-ms-asf',
      'video/x-matroska',
      'video/ogg',
      'video/x-m4v',
      'video/mpeg'
    ];

    const contentType = getContentTypeFromFileName(file.name);
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov', 'avi', 'wmv', 'flv', '3gp', '3gpp', 'asf', 'mkv', 'ogv', 'ogg', 'm4v', 'mpeg', 'mpg', 'mpe', 'qt'];
    
    if (!allowedTypes.includes(contentType) && 
        !supportedExtensions.includes(fileExtension || '')) {
      return NextResponse.json(
        { error: 'サポートされていないファイル形式です。対応形式: 画像（JPG, PNG, GIF, WebP）、動画（MP4, WebM, MOV, AVI, WMV, FLV, 3GP, ASF, MKV, OGV, M4V, MPEG等）' },
        { status: 400 }
      );
    }

    // ファイルをBufferに変換
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 安全なファイル名を生成
    const fileName = generateSafeFileName(file.name, `${category}/`);
    
    // R2にアップロード
    const result = await uploadToR2(fileBuffer, fileName, contentType);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      fileName: file.name,
      size: file.size,
      contentType: contentType,
    });

  } catch (error) {
    console.error('R2 upload error:', error);
    return NextResponse.json(
      { error: 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();
    
    if (!key) {
      return NextResponse.json(
        { error: '削除するファイルのキーが指定されていません' },
        { status: 400 }
      );
    }

    const { deleteFromR2 } = await import('@/lib/cloudflare-r2');
    await deleteFromR2(key);

    return NextResponse.json({
      success: true,
      message: 'ファイルが削除されました',
    });

  } catch (error) {
    console.error('R2 delete error:', error);
    return NextResponse.json(
      { error: 'ファイルの削除に失敗しました' },
      { status: 500 }
    );
  }
}
