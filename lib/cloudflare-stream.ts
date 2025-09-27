export interface StreamVideo {
  uid: string;
  thumbnail: string;
  readyToStream: boolean;
  status: {
    state: string;
    pctComplete: string;
    errorReasonCode: string;
    errorReasonText: string;
  };
  meta: {
    name: string;
    duration: number;
    size: number;
    width: number;
    height: number;
  };
  created: string;
  modified: string;
  requireSignedURLs: boolean;
  allowedOrigins: string[];
  uploaded: string;
  uploadExpiry: string;
  maxSizeBytes: number;
  maxDurationSeconds: number;
  duration: number;
  input: {
    width: number;
    height: number;
    duration: number;
  };
  playback: {
    hls: string;
    dash: string;
  };
}

export interface StreamUploadResponse {
  success: boolean;
  errors: any[];
  messages: any[];
  result: StreamVideo;
}

export interface StreamListResponse {
  success: boolean;
  errors: any[];
  messages: any[];
  result: {
    video: StreamVideo[];
    range: string;
    total: number;
  };
}

export class CloudflareStream {
  private apiToken: string;
  private accountId: string;
  private baseUrl: string;

  constructor() {
    this.apiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN || '';
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream`;
    
    if (!this.apiToken || !this.accountId) {
      console.error('Cloudflare Stream API credentials not configured:', {
        hasApiToken: !!this.apiToken,
        hasAccountId: !!this.accountId,
        accountId: this.accountId
      });
      throw new Error('Cloudflare Stream API credentials not configured. Please check CLOUDFLARE_STREAM_API_TOKEN and CLOUDFLARE_ACCOUNT_ID environment variables.');
    }
  }

  /**
   * 動画ファイルをアップロード
   */
  async uploadVideo(file: File, options?: {
    maxDurationSeconds?: number;
    allowedOrigins?: string[];
    requireSignedURLs?: boolean;
    watermark?: string;
  }): Promise<StreamVideo> {
    const formData = new FormData();
    formData.append('file', file);
    
    // デフォルト設定
    const maxDurationSeconds = options?.maxDurationSeconds || 600; // 10分
    const allowedOrigins = options?.allowedOrigins || ['*'];
    const requireSignedURLs = options?.requireSignedURLs || false;
    
    formData.append('maxDurationSeconds', maxDurationSeconds.toString());
    formData.append('allowedOrigins', JSON.stringify(allowedOrigins));
    formData.append('requireSignedURLs', requireSignedURLs.toString());
    
    if (options?.watermark) {
      formData.append('watermark', options.watermark);
    }

    try {
      console.log('Stream upload attempt:', {
        baseUrl: this.baseUrl,
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type,
        hasApiToken: !!this.apiToken,
        accountId: this.accountId
      });

      // トークンの形式を確認して適切な認証方法を選択
      let authHeader = '';
      if (this.apiToken.startsWith('Bearer ')) {
        authHeader = this.apiToken;
      } else if (this.apiToken.startsWith('Token ')) {
        authHeader = this.apiToken;
      } else {
        // プレフィックスがない場合はBearerを追加
        authHeader = `Bearer ${this.apiToken}`;
      }
      
      console.log('Using auth header for upload:', authHeader.substring(0, 20) + '...');
      
      // 複数の認証方法を試す
      const authHeaders = [
        { 'Authorization': authHeader },
        { 'Authorization': `Token ${this.apiToken}` },
        { 'X-Auth-Key': this.apiToken },
        { 'X-Auth-Email': process.env.CLOUDFLARE_EMAIL || '', 'X-Auth-Key': this.apiToken }
      ];

      let response;
      let authMethod = '';
      
      for (const headers of authHeaders) {
        try {
          console.log('Trying auth method for upload:', Object.keys(headers));
          response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
              ...headers
            } as unknown as HeadersInit,
            body: formData
          });
          
          if (response.ok) {
            authMethod = Object.keys(headers).join(', ');
            break;
          } else {
            console.log(`Upload auth method failed: ${Object.keys(headers).join(', ')} - ${response.status}`);
          }
        } catch (error) {
          console.log(`Upload auth method error: ${Object.keys(headers).join(', ')} - ${error}`);
        }
      }

      console.log('Stream API response:', {
        status: response?.status,
        statusText: response?.statusText,
        ok: response?.ok,
        authMethod: authMethod
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
        throw new Error(`動画のアップロードに失敗しました: ${errorMessage} (認証方法: ${authMethod})`);
      }

      const result: StreamUploadResponse = await response.json();
      console.log('Stream API success response:', result);
      
      if (!result.success) {
        const errorMessage = result.errors?.[0]?.message || '不明なエラー';
        console.error('Stream API returned success=false:', result);
        throw new Error(`動画のアップロードに失敗しました: ${errorMessage}`);
      }

      return result.result;
    } catch (error) {
      console.error('Cloudflare Stream upload error:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        baseUrl: this.baseUrl,
        hasApiToken: !!this.apiToken,
        accountId: this.accountId
      });
      throw error;
    }
  }

  /**
   * 動画の詳細情報を取得
   */
  async getVideo(videoId: string): Promise<StreamVideo> {
    try {
      const response = await fetch(`${this.baseUrl}/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`動画の取得に失敗しました: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`動画の取得に失敗しました: ${result.errors?.[0]?.message || '不明なエラー'}`);
      }

      return result.result;
    } catch (error) {
      console.error('Cloudflare Stream get video error:', error);
      throw error;
    }
  }

  /**
   * 動画一覧を取得
   */
  async listVideos(options?: {
    search?: string;
    limit?: number;
    cursor?: string;
    asc?: boolean;
  }): Promise<{ videos: StreamVideo[]; total: number; cursor?: string }> {
    try {
      const params = new URLSearchParams();
      
      if (options?.search) params.append('search', options.search);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.cursor) params.append('cursor', options.cursor);
      if (options?.asc !== undefined) params.append('asc', options.asc.toString());

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`動画一覧の取得に失敗しました: ${response.statusText}`);
      }

      const result: StreamListResponse = await response.json();
      
      if (!result.success) {
        throw new Error(`動画一覧の取得に失敗しました: ${result.errors?.[0]?.message || '不明なエラー'}`);
      }

      return {
        videos: result.result.video,
        total: result.result.total,
        cursor: result.result.range
      };
    } catch (error) {
      console.error('Cloudflare Stream list videos error:', error);
      throw error;
    }
  }

  /**
   * 動画を削除
   */
  async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`動画の削除に失敗しました: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Cloudflare Stream delete video error:', error);
      throw error;
    }
  }

  /**
   * 動画のプレイバックURLを生成
   */
  getPlaybackUrl(videoId: string, type: 'hls' | 'dash' | 'iframe' = 'hls'): string {
    if (type === 'iframe') {
      return `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/iframe`;
    }
    
    return `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/manifest/video.${type}`;
  }

  /**
   * 動画のサムネイルURLを生成
   */
  getThumbnailUrl(videoId: string, options?: {
    width?: number;
    height?: number;
    time?: number; // 秒
  }): string {
    const params = new URLSearchParams();
    
    if (options?.width) params.append('width', options.width.toString());
    if (options?.height) params.append('height', options.height.toString());
    if (options?.time) params.append('time', options.time.toString());
    
    const queryString = params.toString();
    return `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg${queryString ? `?${queryString}` : ''}`;
  }

  /**
   * 動画のアップロード進捗をチェック
   */
  async checkUploadProgress(videoId: string): Promise<{
    ready: boolean;
    progress: number;
    error?: string;
  }> {
    try {
      const video = await this.getVideo(videoId);
      
      return {
        ready: video.readyToStream,
        progress: parseFloat(video.status.pctComplete),
        error: video.status.errorReasonText || undefined
      };
    } catch (error) {
      console.error('Check upload progress error:', error);
      return {
        ready: false,
        progress: 0,
        error: error instanceof Error ? error.message : '不明なエラー'
      };
    }
  }

  /**
   * アカウント情報を取得
   */
  async getAccount(): Promise<{ id: string; name: string } | null> {
    try {
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.accountId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`アカウント情報の取得に失敗しました: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`アカウント情報の取得に失敗しました: ${result.errors?.[0]?.message || '不明なエラー'}`);
      }

      return {
        id: result.result.id,
        name: result.result.name
      };
    } catch (error) {
      console.error('Cloudflare Stream get account error:', error);
      return null;
    }
  }
}

// シングルトンインスタンス（遅延初期化）
let cloudflareStreamInstance: CloudflareStream | null = null;

export function getCloudflareStream(): CloudflareStream {
  if (!cloudflareStreamInstance) {
    try {
      cloudflareStreamInstance = new CloudflareStream();
    } catch (error) {
      console.error('Failed to initialize CloudflareStream:', error);
      throw error;
    }
  }
  return cloudflareStreamInstance;
}

// 後方互換性のため
export const cloudflareStream = {
  get instance() {
    return getCloudflareStream();
  }
};
