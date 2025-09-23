import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-for-development';

export interface AdminUser {
  userId: string;
  username: string;
  role: string;
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  // Authorizationヘッダーからトークンを取得
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Cookieからトークンを取得
  const token = request.cookies.get('admin_token')?.value;
  if (token) {
    return token;
  }

  return null;
}

export function requireAdminAuth(handler: (request: NextRequest, adminUser: AdminUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const token = getAdminTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const adminUser = verifyAdminToken(token);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 401 }
      );
    }

    return handler(request, adminUser);
  };
}
