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
    
    // 複数のエンドポイントを試す
    const endpoints = [
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/videos`,
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/embed`,
      `https://api.cloudflare.com/client/v4/user/tokens/verify`
    ];
    
    const baseUrl = endpoints[0]; // 最初のエンドポイントを使用

    console.log('Stream API test config:', {
      accountId: accountId,
      baseUrl: baseUrl,
      hasApiToken: !!apiToken,
      tokenLength: apiToken?.length,
      tokenPrefix: apiToken?.substring(0, 10) + '...',
      tokenSuffix: '...' + apiToken?.substring(apiToken.length - 10),
      tokenFormat: apiToken?.startsWith('Bearer ') ? 'Bearer format' : 
                   apiToken?.startsWith('Token ') ? 'Token format' : 
                   apiToken?.includes('-') ? 'Custom format' : 'Unknown format'
    });

    // まずトークンの検証を試す
    let response;
    let authMethod = '';
    let workingEndpoint = '';
    
    // トークン検証エンドポイントを試す
    const tokenVerifyUrl = `https://api.cloudflare.com/client/v4/user/tokens/verify`;
    console.log('Testing token verification endpoint:', tokenVerifyUrl);
    
    // トークンの形式を確認して適切な認証方法を選択
    let authHeader = '';
    if (apiToken.startsWith('Bearer ')) {
      authHeader = apiToken;
    } else if (apiToken.startsWith('Token ')) {
      authHeader = apiToken;
    } else {
      // プレフィックスがない場合はBearerを追加
      authHeader = `Bearer ${apiToken}`;
    }
    
    console.log('Using auth header:', authHeader.substring(0, 20) + '...');
    
    try {
      response = await fetch(tokenVerifyUrl, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Token verification response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (response.ok) {
        authMethod = 'Bearer Token';
        workingEndpoint = tokenVerifyUrl;
        const tokenData = await response.json();
        console.log('Token verification success:', tokenData);
      } else {
        const errorData = await response.json();
        console.error('Token verification failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
      }
    } catch (error) {
      console.error('Token verification error:', error);
    }
    
    // トークン検証が成功した場合、Stream APIを試す
    if (response && response.ok) {
      console.log('Token is valid, testing Stream API endpoints...');
      
      for (const endpoint of endpoints) {
        try {
          console.log('Testing endpoint:', endpoint);
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`Endpoint ${endpoint} response:`, {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
          });
          
          if (response.ok) {
            workingEndpoint = endpoint;
            break;
          } else {
            const errorData = await response.json();
            console.error(`Endpoint ${endpoint} failed:`, errorData);
          }
        } catch (error) {
          console.error(`Endpoint ${endpoint} error:`, error);
        }
      }
    }

    console.log('Stream API test response:', {
      status: response?.status,
      statusText: response?.statusText,
      ok: response?.ok,
      authMethod: authMethod,
      workingEndpoint: workingEndpoint
    });

    if (!response || !response.ok) {
      let errorMessage = `HTTP ${response?.status || 'Unknown'}: ${response?.statusText || 'Unknown error'}`;
      try {
        if (response) {
          const errorData = await response.json();
          console.error('Stream API error response:', errorData);
          errorMessage = errorData.errors?.[0]?.message || errorData.message || errorMessage;
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        status: response?.status || 500,
        authMethod: authMethod,
        workingEndpoint: workingEndpoint,
        config: {
          accountId: accountId,
          baseUrl: baseUrl,
          hasApiToken: !!apiToken
        }
      }, { status: response?.status || 500 });
    }

    const result = await response.json();
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.errors?.[0]?.message || 'Stream API returned success=false',
        config: {
          accountId: accountId,
          baseUrl: baseUrl,
          hasApiToken: !!apiToken
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Stream API接続成功',
      authMethod: authMethod,
      workingEndpoint: workingEndpoint,
      config: {
        accountId: accountId,
        baseUrl: baseUrl,
        hasApiToken: !!apiToken
      },
      videoCount: result.result?.total || 0
    });

  } catch (error: any) {
    console.error('Stream API connection test failed:', error);
    
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
