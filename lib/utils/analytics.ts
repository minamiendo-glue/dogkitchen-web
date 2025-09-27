// アクセス分析用のユーティリティ関数

interface TrackingData {
  type: 'page_view' | 'recipe_view' | 'search' | 'user_action';
  page_path?: string;
  page_title?: string;
  recipe_id?: string;
  search_query?: string;
  search_filters?: Record<string, any>;
  results_count?: number;
  action_type?: string;
  target_id?: string;
  target_type?: string;
  metadata?: Record<string, any>;
  view_duration?: number;
}

class Analytics {
  private sessionId: string;
  private startTime: number = Date.now();

  constructor() {
    // セッションIDを取得または生成
    this.sessionId = this.getSessionId();
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // ページビューを記録
  trackPageView(pagePath: string, pageTitle?: string) {
    this.track({
      type: 'page_view',
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
  }

  // レシピ閲覧を記録
  trackRecipeView(recipeId: string, viewDuration?: number) {
    this.track({
      type: 'recipe_view',
      recipe_id: recipeId,
      view_duration: viewDuration
    });
  }

  // 検索を記録
  trackSearch(searchQuery: string, searchFilters?: Record<string, any>, resultsCount?: number, pagePath?: string) {
    this.track({
      type: 'search',
      search_query: searchQuery,
      search_filters: searchFilters,
      results_count: resultsCount,
      page_path: pagePath || window.location.pathname
    });
  }

  // ユーザーアクションを記録
  trackUserAction(actionType: string, targetId?: string, targetType?: string, metadata?: Record<string, any>) {
    this.track({
      type: 'user_action',
      action_type: actionType,
      target_id: targetId,
      target_type: targetType,
      metadata: metadata
    });
  }

  // 共通のトラッキング処理
  private async track(data: TrackingData) {
    try {
      // セッションIDを追加
      const trackingData = {
        ...data,
        session_id: this.sessionId
      };

      // APIに送信（非同期、エラーを無視）
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trackingData)
      }).catch(error => {
        // エラーを無視（分析データの送信失敗はユーザー体験に影響しない）
        console.debug('Analytics tracking error:', error);
      });
    } catch (error) {
      // エラーを無視
      console.debug('Analytics tracking error:', error);
    }
  }

  // ページ滞在時間を計算
  getPageDuration(): number {
    return Date.now() - this.startTime;
  }

  // 新しいページの開始時間をリセット
  resetStartTime() {
    this.startTime = Date.now();
  }
}

// シングルトンインスタンス
export const analytics = new Analytics();

// Next.js用のページトラッキングフック
export function usePageTracking() {
  if (typeof window === 'undefined') return;

  // ページロード時のトラッキング
  const trackPageLoad = () => {
    analytics.trackPageView(window.location.pathname, document.title);
    analytics.resetStartTime();
  };

  // ページ離脱時のトラッキング
  const trackPageUnload = () => {
    const duration = analytics.getPageDuration();
    // ページビューとして再度記録（滞在時間付き）
    analytics.trackPageView(window.location.pathname, document.title);
  };

  // イベントリスナーを設定
  window.addEventListener('load', trackPageLoad);
  window.addEventListener('beforeunload', trackPageUnload);

  // クリーンアップ関数
  return () => {
    window.removeEventListener('load', trackPageLoad);
    window.removeEventListener('beforeunload', trackPageUnload);
  };
}

// レシピ閲覧時間を測定するフック
export function useRecipeTracking(recipeId: string) {
  if (typeof window === 'undefined') return;

  let startTime = Date.now();
  let isVisible = true;

  const trackViewStart = () => {
    startTime = Date.now();
    isVisible = true;
  };

  const trackViewEnd = () => {
    if (isVisible) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      if (duration > 0) {
        analytics.trackRecipeView(recipeId, duration);
      }
    }
    isVisible = false;
  };

  // ページの可視性変更を監視
  const handleVisibilityChange = () => {
    if (document.hidden) {
      trackViewEnd();
    } else {
      trackViewStart();
    }
  };

  // イベントリスナーを設定
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', trackViewEnd);

  // クリーンアップ関数
  return () => {
    trackViewEnd();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', trackViewEnd);
  };
}

// 検索機能用のトラッキング
export function trackSearch(searchQuery: string, filters?: Record<string, any>, resultsCount?: number) {
  analytics.trackSearch(searchQuery, filters, resultsCount);
}

// お気に入り機能用のトラッキング
export function trackFavorite(recipeId: string, action: 'add' | 'remove') {
  analytics.trackUserAction('recipe_favorite', recipeId, 'recipe', { action });
}

// シェア機能用のトラッキング
export function trackShare(recipeId: string, platform: string) {
  analytics.trackUserAction('recipe_share', recipeId, 'recipe', { platform });
}

// フィルター適用用のトラッキング
export function trackFilter(filters: Record<string, any>) {
  analytics.trackUserAction('filter_apply', null, 'filter', { filters });
}
