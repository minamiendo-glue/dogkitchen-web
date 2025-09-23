'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!hasChecked) {
      checkAuth();
      setHasChecked(true);
    }
  }, [hasChecked]);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
  }, []);

  // 定期的にトークンの有効期限をチェック（5分間隔）
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('admin_token');
      if (token && adminUser) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (payload.exp && payload.exp < currentTime) {
            // トークンが期限切れの場合、自動ログアウト
            console.log('Token expired during session, auto-logout');
            logout();
          }
        } catch (error) {
          console.error('Token validation error:', error);
          logout();
        }
      }
    }, 5 * 60 * 1000); // 5分間隔

    return () => clearInterval(interval);
  }, [adminUser, logout]);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('admin_token');
      const userData = localStorage.getItem('admin_user');

      if (!token || !userData) {
        setAdminUser(null);
        setIsLoading(false);
        return false;
      }

      // JWTトークンの有効期限をチェック
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          // トークンが期限切れの場合
          console.log('Token expired, logging out');
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setAdminUser(null);
          setIsLoading(false);
          return false;
        }
      } catch (jwtError) {
        console.error('JWT parsing error:', jwtError);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAdminUser(null);
        setIsLoading(false);
        return false;
      }

      // ユーザーデータを先に設定（オフライン対応）
      try {
        const user = JSON.parse(userData);
        setAdminUser(user);
      } catch (parseError) {
        console.error('User data parse error:', parseError);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAdminUser(null);
        setIsLoading(false);
        return false;
      }

      // トークンの有効性をサーバーで確認（バックグラウンドで実行）
      try {
        const response = await fetch('/api/admin/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // トークンが無効な場合、ローカルストレージをクリア
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setAdminUser(null);
          return false;
        }
      } catch (networkError) {
        console.warn('Network error during auth verification:', networkError);
        // ネットワークエラーの場合は、ローカルデータを信頼する
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      // エラーの場合もローカルストレージをクリア
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setAdminUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const login = (token: string, user: AdminUser) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    setAdminUser(user);
  };

  const isAuthenticated = !!adminUser;

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
