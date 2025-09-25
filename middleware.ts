import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Basic認証の設定
  const basicAuth = request.headers.get('authorization');
  const url = request.nextUrl;

  // 本番環境でのみBasic認証を適用
  if (process.env.NODE_ENV === 'production') {
    // Basic認証の認証情報を環境変数から取得
    const validUser = process.env.BASIC_AUTH_USER;
    const validPass = process.env.BASIC_AUTH_PASSWORD;
    
    // Basic認証が設定されていない場合はスキップ
    if (!validUser || !validPass) {
      return NextResponse.next();
    }

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (user === validUser && pwd === validPass) {
        return NextResponse.next();
      }
    }

    // 認証が必要な場合
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  // セキュリティヘッダーの追加
  const response = NextResponse.next();
  
  // セキュリティヘッダーを追加
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};