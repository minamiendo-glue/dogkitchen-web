'use client';

import { useState, useEffect } from 'react';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maxFileSize: number;
  maxVideoSize: number;
  sessionTimeout: number;
  loginAttempts: number;
  enableTwoFactor: boolean;
  enableIpRestriction: boolean;
  allowedIps: string[];
  featuredVideo: {
    src: string;
  };
  aboutVideo: {
    src: string;
    title: string;
  };
}

interface ServiceStatus {
  supabase: {
    connected: boolean;
    status: string;
    details: any;
  };
  cloudflare: {
    r2: {
      connected: boolean;
      status: string;
      details: any;
    };
    stream: {
      connected: boolean;
      status: string;
      details: any;
    };
  };
}

interface SystemStats {
  totalUsers: number;
  totalRecipes: number;
  publishedRecipes: number;
  draftRecipes: number;
  todayRecipes: number;
  todayUsers: number;
  systemHealth: {
    database: string;
    lastChecked: string;
  };
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'system' | 'security' | 'services' | 'external' | 'logs'>('system');
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'DOG KITCHEN',
    siteDescription: '愛犬のためのヘルシーレシピサイト',
    maintenanceMode: false,
    maintenanceMessage: '現在メンテナンス中です。しばらくお待ちください。',
    maxFileSize: 10,
    maxVideoSize: 500,
    sessionTimeout: 30,
    loginAttempts: 5,
    enableTwoFactor: false,
    enableIpRestriction: false,
    allowedIps: [],
    featuredVideo: {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    aboutVideo: {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      title: "DOG KITCHEN コンセプト動画"
    }
  });
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
    checkServiceStatus();
    fetchSystemStats();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      
      if (response.ok && data.success && data.settings) {
        setSettings(data.settings);
      } else {
        console.error('設定の取得に失敗:', data.error || '不明なエラー');
        // エラーの場合はデフォルト設定を使用
        setSettings({
          siteName: 'DOG KITCHEN',
          siteDescription: '愛犬のためのヘルシーレシピサイト',
          maintenanceMode: false,
          maintenanceMessage: '現在メンテナンス中です。しばらくお待ちください。',
          maxFileSize: 10,
          maxVideoSize: 500,
          sessionTimeout: 30,
          loginAttempts: 5,
          enableTwoFactor: false,
          enableIpRestriction: false,
          allowedIps: [],
          featuredVideo: {
            src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          aboutVideo: {
            src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            title: "DOG KITCHEN コンセプト動画"
          }
        });
      }
    } catch (error) {
      console.error('設定の取得に失敗:', error);
      // エラーの場合はデフォルト設定を使用
      setSettings({
        siteName: 'DOG KITCHEN',
        siteDescription: '愛犬のためのヘルシーレシピサイト',
        maintenanceMode: false,
        maintenanceMessage: '現在メンテナンス中です。しばらくお待ちください。',
        maxFileSize: 10,
        maxVideoSize: 500,
        sessionTimeout: 30,
        loginAttempts: 5,
        enableTwoFactor: false,
        enableIpRestriction: false,
        allowedIps: [],
        featuredVideo: {
          src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        },
        aboutVideo: {
          src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          title: "DOG KITCHEN コンセプト動画"
        }
      });
    }
  };

  const checkServiceStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings/services');
      const data = await response.json();
      setServiceStatus(data);
    } catch (error) {
      console.error('サービス状態の確認に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('/api/admin/settings/stats');
      const data = await response.json();
      if (data.success) {
        setSystemStats(data.stats);
      }
    } catch (error) {
      console.error('統計データの取得に失敗:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        alert(data.message || '設定を保存しました');
      } else {
        alert(`保存に失敗しました: ${data.error || '不明なエラー'}`);
      }
    } catch (error) {
      console.error('設定の保存に失敗:', error);
      alert('設定の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addAllowedIp = () => {
    const ip = prompt('許可するIPアドレスを入力してください:');
    if (ip && !settings.allowedIps.includes(ip)) {
      setSettings(prev => ({
        ...prev,
        allowedIps: [...prev.allowedIps, ip]
      }));
    }
  };

  const removeAllowedIp = (ip: string) => {
    setSettings(prev => ({
      ...prev,
      allowedIps: prev.allowedIps.filter(allowedIp => allowedIp !== ip)
    }));
  };

  const tabs = [
    { id: 'system', name: 'システム基本設定', icon: '⚙️' },
    { id: 'security', name: 'セキュリティ設定', icon: '🔒' },
    { id: 'services', name: 'サービス状態確認', icon: '🔗' },
    { id: 'external', name: '外部サービス設定', icon: '🌐' },
    { id: 'logs', name: 'ログ・監視', icon: '📊' }
  ] as const;

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">システム設定</h1>
        <p className="mt-2 text-gray-600">
          システムの基本設定、セキュリティ設定、外部サービス連携の管理を行います
        </p>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="bg-white shadow rounded-lg">
        {activeTab === 'system' && (
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-6">システム基本設定</h3>
            
            <div className="space-y-6">
              {/* サイト基本情報 */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                    サイト名
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    value={settings.siteName || ''}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                    サイト説明
                  </label>
                  <input
                    type="text"
                    id="siteDescription"
                    value={settings.siteDescription || ''}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* メンテナンスモード */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">メンテナンスモード</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                      メンテナンスモードを有効にする
                    </label>
                  </div>
                  {settings.maintenanceMode && (
                    <div>
                      <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700">
                        メンテナンスメッセージ
                      </label>
                      <textarea
                        id="maintenanceMessage"
                        rows={3}
                        value={settings.maintenanceMessage || ''}
                        onChange={(e) => handleSettingChange('maintenanceMessage', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ファイルサイズ制限 */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">ファイルサイズ制限</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="maxFileSize" className="block text-sm font-medium text-gray-700">
                      画像ファイル最大サイズ (MB)
                    </label>
                    <input
                      type="number"
                      id="maxFileSize"
                      value={settings.maxFileSize || 10}
                      onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxVideoSize" className="block text-sm font-medium text-gray-700">
                      動画ファイル最大サイズ (MB)
                    </label>
                    <input
                      type="number"
                      id="maxVideoSize"
                      value={settings.maxVideoSize || 500}
                      onChange={(e) => handleSettingChange('maxVideoSize', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* おすすめ動画設定 */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">おすすめ動画設定</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="featuredVideoUpload" className="block text-sm font-medium text-gray-700">
                      動画ファイルをアップロード
                    </label>
                    <input
                      type="file"
                      id="featuredVideoUpload"
                      accept="video/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('type', 'featured-video');
                            
                            const response = await fetch('/api/upload/r2', {
                              method: 'POST',
                              body: formData,
                            });
                            
                            const data = await response.json();
                            if (data.success && data.url) {
                              handleSettingChange('featuredVideo', {
                                src: data.url
                              });
                              alert('動画のアップロードが完了しました');
                            } else {
                              alert('動画のアップロードに失敗しました');
                            }
                          } catch (error) {
                            console.error('動画アップロードエラー:', error);
                            alert('動画のアップロードに失敗しました');
                          }
                        }
                      }}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      対応形式: MP4, WebM, MOV, AVI (最大{settings.maxVideoSize}MB)
                    </p>
                  </div>
                  
                  {settings.featuredVideo?.src && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        現在の動画
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="w-full max-w-md aspect-video">
                          <video
                            src={settings.featuredVideo.src}
                            controls
                            className="w-full h-full object-cover rounded-lg"
                            preload="metadata"
                          >
                            お使いのブラウザは動画タグをサポートしていません。
                          </video>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          動画URL: {settings.featuredVideo.src}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Aboutページ動画設定 */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Aboutページ動画設定</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="aboutVideoTitle" className="block text-sm font-medium text-gray-700">
                      動画タイトル
                    </label>
                    <input
                      type="text"
                      id="aboutVideoTitle"
                      value={settings.aboutVideo?.title || ''}
                      onChange={(e) => handleSettingChange('aboutVideo', {
                        ...settings.aboutVideo,
                        title: e.target.value
                      })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="DOG KITCHEN コンセプト動画"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="aboutVideoUpload" className="block text-sm font-medium text-gray-700">
                      動画ファイルをアップロード
                    </label>
                    <input
                      type="file"
                      id="aboutVideoUpload"
                      accept="video/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('type', 'about-video');
                            
                            const response = await fetch('/api/upload/r2', {
                              method: 'POST',
                              body: formData,
                            });
                            
                            const data = await response.json();
                            if (data.success && data.url) {
                              handleSettingChange('aboutVideo', {
                                ...settings.aboutVideo,
                                src: data.url
                              });
                              alert('動画のアップロードが完了しました');
                            } else {
                              alert('動画のアップロードに失敗しました');
                            }
                          } catch (error) {
                            console.error('動画アップロードエラー:', error);
                            alert('動画のアップロードに失敗しました');
                          }
                        }
                      }}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      対応形式: MP4, WebM, MOV, AVI (最大{settings.maxVideoSize}MB)
                    </p>
                  </div>
                  
                  {settings.aboutVideo?.src && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        現在の動画
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="w-full max-w-md aspect-video">
                          <video
                            src={settings.aboutVideo.src}
                            controls
                            className="w-full h-full object-cover rounded-lg"
                            preload="metadata"
                          >
                            お使いのブラウザは動画タグをサポートしていません。
                          </video>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          動画URL: {settings.aboutVideo.src}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-6">セキュリティ設定</h3>
            
            <div className="space-y-6">
              {/* セッション設定 */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">セッション設定</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                      セッションタイムアウト (分)
                    </label>
                    <input
                      type="number"
                      id="sessionTimeout"
                      value={settings.sessionTimeout || 30}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="loginAttempts" className="block text-sm font-medium text-gray-700">
                      ログイン試行回数制限
                    </label>
                    <input
                      type="number"
                      id="loginAttempts"
                      value={settings.loginAttempts || 5}
                      onChange={(e) => handleSettingChange('loginAttempts', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 二要素認証 */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">二要素認証</h4>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableTwoFactor"
                    checked={settings.enableTwoFactor}
                    onChange={(e) => handleSettingChange('enableTwoFactor', e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableTwoFactor" className="ml-2 block text-sm text-gray-900">
                    二要素認証を有効にする
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  管理者ログイン時にSMSまたはアプリによる認証を要求します
                </p>
              </div>

              {/* IP制限 */}
              <div className="border-t pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">IPアドレス制限</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableIpRestriction"
                      checked={settings.enableIpRestriction}
                      onChange={(e) => handleSettingChange('enableIpRestriction', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableIpRestriction" className="ml-2 block text-sm text-gray-900">
                      IPアドレス制限を有効にする
                    </label>
                  </div>
                  
                  {settings.enableIpRestriction && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          許可するIPアドレス
                        </label>
                        <button
                          type="button"
                          onClick={addAllowedIp}
                          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          追加
                        </button>
                      </div>
                      <div className="space-y-2">
                        {settings.allowedIps.map((ip, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm font-mono">{ip}</span>
                            <button
                              type="button"
                              onClick={() => removeAllowedIp(ip)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              削除
                            </button>
                          </div>
                        ))}
                        {settings.allowedIps.length === 0 && (
                          <p className="text-sm text-gray-500">許可するIPアドレスが設定されていません</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-6">サービス状態確認</h3>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-lg text-gray-600">サービス状態を確認中...</div>
              </div>
            ) : serviceStatus ? (
              <div className="space-y-6">
                {/* Supabase */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Supabase</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      serviceStatus.supabase.connected 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {serviceStatus.supabase.connected ? '接続中' : '接続エラー'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{serviceStatus.supabase.status}</p>
                </div>

                {/* Cloudflare R2 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Cloudflare R2</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      serviceStatus.cloudflare.r2.connected 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {serviceStatus.cloudflare.r2.connected ? '接続中' : '接続エラー'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{serviceStatus.cloudflare.r2.status}</p>
                </div>

                {/* Cloudflare Stream */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Cloudflare Stream</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      serviceStatus.cloudflare.stream.connected 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {serviceStatus.cloudflare.stream.connected ? '接続中' : '接続エラー'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{serviceStatus.cloudflare.stream.status}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={checkServiceStatus}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    再確認
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                サービス状態の取得に失敗しました
              </div>
            )}
          </div>
        )}

        {activeTab === 'external' && (
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-6">外部サービス設定</h3>
            
            <div className="space-y-6">
              {/* Supabase設定 */}
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Supabase設定</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">データベースURL</label>
                    <p className="mt-1 text-sm text-gray-600 font-mono">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">サービスキー</label>
                    <p className="mt-1 text-sm text-gray-600 font-mono">
                      {process.env.SUPABASE_SERVICE_ROLE_KEY ? '設定済み' : '未設定'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cloudflare設定 */}
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Cloudflare設定</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">R2ストレージ</h5>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">アカウントID</label>
                        <p className="mt-1 text-sm text-gray-600 font-mono">
                          {process.env.R2_ACCOUNT_ID ? '設定済み' : '未設定'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">バケット名</label>
                        <p className="mt-1 text-sm text-gray-600 font-mono">
                          {process.env.R2_BUCKET_NAME || '未設定'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Stream API</h5>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">アカウントID</label>
                        <p className="mt-1 text-sm text-gray-600 font-mono">
                          {process.env.CLOUDFLARE_ACCOUNT_ID ? '設定済み' : '未設定'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">APIトークン</label>
                        <p className="mt-1 text-sm text-gray-600 font-mono">
                          {process.env.CLOUDFLARE_STREAM_API_TOKEN ? '設定済み' : '未設定'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 設定の更新 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">設定の更新について</h4>
                <p className="text-sm text-yellow-700">
                  外部サービスの設定は環境変数（.env.local）で管理されています。
                  設定を変更する場合は、サーバーを再起動してください。
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-6">ログ・監視</h3>
            
            <div className="space-y-6">
              {/* システム統計 */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">総ユーザー数</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {systemStats?.totalUsers || '-'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">総レシピ数</p>
                      <p className="text-2xl font-bold text-green-900">
                        {systemStats?.totalRecipes || '-'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">今日の新規レシピ</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {systemStats?.todayRecipes || '-'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-red-600">下書きレシピ</p>
                      <p className="text-2xl font-bold text-red-900">
                        {systemStats?.draftRecipes || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* アクセスログ */}
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">最近のアクセスログ</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 text-center">
                    アクセスログ機能は開発中です
                  </p>
                </div>
              </div>

              {/* エラーログ */}
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">エラーログ</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 text-center">
                    エラーログ機能は開発中です
                  </p>
                </div>
              </div>

              {/* システムリソース */}
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">システムリソース</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>CPU使用率</span>
                      <span>-</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>メモリ使用率</span>
                      <span>-</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>ディスク使用率</span>
                      <span>-</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ログエクスポート */}
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={fetchSystemStats}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  統計更新
                </button>
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  ログエクスポート
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  統計レポート
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 保存ボタン */}
        {activeTab !== 'services' && activeTab !== 'external' && activeTab !== 'logs' && (
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              {saving ? '保存中...' : '設定を保存'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
