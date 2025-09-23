import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    // データベースエラーの処理
    if (error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: '既に存在するデータです' },
        { status: 409 }
      );
    }

    if (error.message.includes('foreign key')) {
      return NextResponse.json(
        { error: '関連するデータが見つかりません' },
        { status: 400 }
      );
    }

    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'データが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: '予期しないエラーが発生しました' },
    { status: 500 }
  );
}

export function validateRequiredFields(data: any, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new AppError(
      `必須フィールドが不足しています: ${missingFields.join(', ')}`,
      400,
      'MISSING_REQUIRED_FIELDS',
      { missingFields }
    );
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('パスワードは8文字以上である必要があります');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('パスワードには大文字が含まれている必要があります');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('パスワードには小文字が含まれている必要があります');
  }
  
  if (!/\d/.test(password)) {
    errors.push('パスワードには数字が含まれている必要があります');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
