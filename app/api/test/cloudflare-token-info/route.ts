import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 環境変数の検証
    const requiredVars = ['CLOUDFLARE_STREAM_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: '環境変数が設定されていません',
        missingVars: missingVars
      }, { status: 400 });
    }

    const apiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN!;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
    
    console.log('Environment variables check:', {
      hasApiToken: !!apiToken,
      tokenLength: apiToken?.length,
      tokenPrefix: apiToken?.substring(0, 15) + '...',
      tokenSuffix: '...' + apiToken?.substring(apiToken.length - 10),
      hasAccountId: !!accountId,
      accountId: accountId,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('CLOUDFLARE'))
    });
    
    // トークンの形式を確認
    let authHeader = '';
    if (apiToken.startsWith('Bearer ')) {
      authHeader = apiToken;
    } else if (apiToken.startsWith('Token ')) {
      authHeader = apiToken;
    } else {
      authHeader = `Bearer ${apiToken}`;
    }
    
    console.log('Auth header format:', {
      originalToken: apiToken?.substring(0, 20) + '...',
      authHeader: authHeader.substring(0, 25) + '...',
      headerLength: authHeader.length
    });
    
    // トークンの詳細分析
    const tokenAnalysis = {
      length: apiToken.length,
      hasHyphens: apiToken.includes('-'),
      hasUnderscores: apiToken.includes('_'),
      hasSpaces: apiToken.includes(' '),
      startsWithLetter: /^[a-zA-Z]/.test(apiToken),
      startsWithNumber: /^[0-9]/.test(apiToken),
      containsSpecialChars: /[^a-zA-Z0-9\-_]/.test(apiToken),
      segments: apiToken.split('-').length,
      firstSegment: apiToken.split('-')[0],
      lastSegment: apiToken.split('-').pop()
    };
    
    console.log('Token analysis:', tokenAnalysis);

    // 複数のエンドポイントと認証方法を試す
    const endpoints = [
      { name: 'Token Verify', url: 'https://api.cloudflare.com/client/v4/user/tokens/verify' },
      { name: 'User Info', url: 'https://api.cloudflare.com/client/v4/user' },
      { name: 'Account Info', url: `https://api.cloudflare.com/client/v4/accounts/${accountId}` },
      { name: 'Stream Videos', url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream` }
    ];
    
    const authMethods = [
      { name: 'Bearer Token', header: authHeader },
      { name: 'Token Prefix', header: `Token ${apiToken}` },
      { name: 'X-Auth-Key', header: `X-Auth-Key: ${apiToken}` },
      { name: 'X-Auth-Email + X-Auth-Key', header: `X-Auth-Email: ${process.env.CLOUDFLARE_EMAIL || ''}, X-Auth-Key: ${apiToken}` }
    ];
    
    let response;
    let successfulAuthMethod = '';
    let successfulEndpoint = '';
    
    for (const endpoint of endpoints) {
      console.log(`\n=== Testing endpoint: ${endpoint.name} ===`);
      
      for (const method of authMethods) {
        try {
          console.log(`Trying auth method: ${method.name}`);
          
          let headers: any = {
            'Content-Type': 'application/json'
          };
          
          if (method.name === 'X-Auth-Key') {
            headers['X-Auth-Key'] = apiToken;
          } else if (method.name === 'X-Auth-Email + X-Auth-Key') {
            headers['X-Auth-Email'] = process.env.CLOUDFLARE_EMAIL || '';
            headers['X-Auth-Key'] = apiToken;
          } else {
            headers['Authorization'] = method.header.includes('Bearer') ? method.header : `Bearer ${apiToken}`;
          }
          
          console.log('Request headers:', headers);
          
          response = await fetch(endpoint.url, {
            method: 'GET',
            headers: headers
          });
          
          console.log(`${endpoint.name} + ${method.name} response:`, {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
          });
          
          if (response.ok) {
            successfulAuthMethod = method.name;
            successfulEndpoint = endpoint.name;
            break;
          } else {
            let errorData;
            try {
              errorData = await response.json();
            } catch (parseError) {
              errorData = { error: 'Failed to parse error response', status: response.status };
            }
            console.error(`${endpoint.name} + ${method.name} failed:`, {
              status: response.status,
              statusText: response.statusText,
              error: errorData
            });
          }
        } catch (error) {
          console.error(`${endpoint.name} + ${method.name} error:`, error);
        }
      }
      
      if (response && response.ok) {
        break;
      }
    }

    console.log('Final token info response:', {
      status: response?.status,
      statusText: response?.statusText,
      ok: response?.ok,
      successfulAuthMethod: successfulAuthMethod,
      successfulEndpoint: successfulEndpoint
    });

    if (!response || !response.ok) {
      let errorMessage = response ? `HTTP ${response.status}: ${response.statusText}` : 'No response received';
      try {
        if (response) {
          const errorData = await response.json();
          console.error('Token info error response:', errorData);
          errorMessage = errorData.errors?.[0]?.message || errorData.message || errorMessage;
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        status: response?.status || 500,
        successfulAuthMethod: successfulAuthMethod,
        successfulEndpoint: successfulEndpoint,
        tokenAnalysis: tokenAnalysis,
        config: {
          accountId: accountId,
          hasApiToken: !!apiToken,
          tokenLength: apiToken?.length,
          tokenPrefix: apiToken?.substring(0, 10) + '...',
          authHeader: authHeader.substring(0, 20) + '...'
        }
      }, { status: response?.status || 500 });
    }

    const tokenData = await response.json();
    console.log('Token info success:', tokenData);

    // トークンの権限を確認
    const permissions = tokenData.result?.permissions || [];
    const hasStreamPermission = permissions.some((p: any) => 
      p.permission === 'com.cloudflare.api.account.cloudflare-stream' ||
      p.permission === 'com.cloudflare.api.account.stream' ||
      p.permission?.includes('stream')
    );

    return NextResponse.json({
      success: true,
      message: 'トークン情報取得成功',
      successfulAuthMethod: successfulAuthMethod,
      successfulEndpoint: successfulEndpoint,
      tokenAnalysis: tokenAnalysis,
      tokenInfo: {
        id: tokenData.result?.id,
        name: tokenData.result?.name,
        status: tokenData.result?.status,
        expires_on: tokenData.result?.expires_on,
        issued_on: tokenData.result?.issued_on,
        not_before: tokenData.result?.not_before
      },
      permissions: permissions,
      hasStreamPermission: hasStreamPermission,
      config: {
        accountId: accountId,
        hasApiToken: !!apiToken,
        tokenLength: apiToken?.length,
        authHeader: authHeader.substring(0, 20) + '...'
      }
    });

  } catch (error: any) {
    console.error('Token info check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      config: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        hasApiToken: !!process.env.CLOUDFLARE_STREAM_API_TOKEN
      }
    }, { status: 500 });
  }
}
