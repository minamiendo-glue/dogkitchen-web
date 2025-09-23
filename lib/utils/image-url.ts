/**
 * R2画像URLを新しいパブリック開発URLに変換する
 */
export function convertR2ImageUrl(url: string): string {
  if (!url) return url;
  
  // 古いR2のURLパターンを検出
  const oldR2Pattern = /https:\/\/1da531377a6fe6d969f5c2b84e4a3eda\.r2\.cloudflarestorage\.com\/dogkitchen-videos\/(.+)/;
  const match = url.match(oldR2Pattern);
  
  if (match) {
    // 新しいパブリック開発URLに変換
    const filePath = match[1];
    return `https://pub-cfe9dbdc66fe4ac2a608873ba0acfdc4.r2.dev/${filePath}`;
  }
  
  // 変換不要な場合はそのまま返す
  return url;
}

/**
 * 画像URLがR2のURLかどうかを判定
 */
export function isR2ImageUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('r2.cloudflarestorage.com') || url.includes('r2.dev');
}

/**
 * 画像URLの有効性をチェック（R2のURLの場合）
 */
export function isValidR2ImageUrl(url: string): boolean {
  if (!isR2ImageUrl(url)) return true; // R2以外のURLは有効とみなす
  
  // 新しいパブリック開発URLの場合は有効
  if (url.includes('pub-cfe9dbdc66fe4ac2a608873ba0acfdc4.r2.dev')) {
    return true;
  }
  
  // 古いR2のURLの場合は無効
  if (url.includes('1da531377a6fe6d969f5c2b84e4a3eda.r2.cloudflarestorage.com')) {
    return false;
  }
  
  return true;
}
