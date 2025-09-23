import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest } from 'next/server';

export interface UploadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

/**
 * ファイルを保存する
 */
export async function saveFile(
  file: File,
  directory: string,
  fileName?: string
): Promise<UploadResult> {
  try {
    // ファイル名を生成（指定されていない場合）
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const finalFileName = fileName || `${timestamp}.${fileExtension}`;
    
    // ファイルパスを構築
    const uploadDir = join(process.cwd(), 'public', 'uploads', directory);
    const filePath = join(uploadDir, finalFileName);
    
    // ディレクトリが存在しない場合は作成
    await mkdir(uploadDir, { recursive: true });
    
    // ファイルを保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // 公開URLを返す
    const publicPath = `/uploads/${directory}/${finalFileName}`;
    
    return {
      success: true,
      filePath: publicPath,
      fileName: finalFileName
    };
  } catch (error) {
    console.error('ファイル保存エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ファイルの保存に失敗しました'
    };
  }
}

/**
 * ファイルの種類を検証する
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * ファイルサイズを検証する
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * FormDataからファイルを取得する
 */
export function getFileFromFormData(formData: FormData, fieldName: string): File | null {
  const file = formData.get(fieldName);
  return file instanceof File ? file : null;
}

/**
 * 画像ファイルの種類をチェック
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * 動画ファイルの種類をチェック
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * ファイル名から安全なファイル名を生成
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // 特殊文字をアンダースコアに置換
    .replace(/_+/g, '_') // 連続するアンダースコアを1つに
    .replace(/^_|_$/g, ''); // 先頭と末尾のアンダースコアを削除
}
