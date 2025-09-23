'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/supabase-provider';

interface NavigationProps {
  currentPage?: string;
}

export function Navigation({ currentPage }: NavigationProps) {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8">
        <Link 
          href="/" 
          className={`font-medium transition-colors duration-200 ${
            currentPage === 'home' 
              ? 'text-red-500' 
              : 'text-gray-700 hover:text-red-500'
          }`}
        >
          ホーム
        </Link>
        <Link 
          href="/about" 
          className={`font-medium transition-colors duration-200 ${
            currentPage === 'about' 
              ? 'text-red-500' 
              : 'text-gray-700 hover:text-red-500'
          }`}
        >
          DOG KITCHENとは
        </Link>
        <Link 
          href="/premium" 
          className={`font-medium transition-colors duration-200 ${
            currentPage === 'premium' 
              ? 'text-red-500' 
              : 'text-gray-700 hover:text-red-500'
          }`}
        >
          プレミアム機能
        </Link>
        <Link 
          href="/blog/articles" 
          className={`font-medium transition-colors duration-200 ${
            currentPage === 'blog' 
              ? 'text-red-500' 
              : 'text-gray-700 hover:text-red-500'
          }`}
        >
          記事
        </Link>
        <Link 
          href="/blog/features" 
          className={`font-medium transition-colors duration-200 ${
            currentPage === 'features' 
              ? 'text-red-500' 
              : 'text-gray-700 hover:text-red-500'
          }`}
        >
          特集
        </Link>
        <Link 
          href="/faq" 
          className={`font-medium transition-colors duration-200 ${
            currentPage === 'faq' 
              ? 'text-red-500' 
              : 'text-gray-700 hover:text-red-500'
          }`}
        >
          よくある質問
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <Link 
              href="/mypage" 
              className={`font-medium transition-colors duration-200 ${
                currentPage === 'mypage' 
                  ? 'text-red-500' 
                  : 'text-gray-700 hover:text-red-500'
              }`}
            >
              マイページ
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-200"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
          >
            ログイン
          </Link>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="メニューを開く"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1.5">
          {isMobileMenuOpen ? (
            <div className="w-5 h-5 relative">
              <div className="absolute top-1/2 left-1/2 w-5 h-1 bg-current transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
              <div className="absolute top-1/2 left-1/2 w-5 h-1 bg-current transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
            </div>
          ) : (
            <>
              <div className="w-5 h-1 bg-current rounded-full"></div>
              <div className="w-5 h-1 bg-current rounded-full"></div>
              <div className="w-5 h-1 bg-current rounded-full"></div>
            </>
          )}
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu} />
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 h-auto max-h-[calc(100vh-4rem)] w-64 bg-white shadow-lg overflow-hidden rounded-lg">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-2 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">🐕</span>
                  </div>
                  <h2 className="text-sm font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    DOG KITCHEN
                  </h2>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  aria-label="メニューを閉じる"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-2 space-y-1">
                  <Link
                    href="/faq"
                    onClick={closeMobileMenu}
                    className={`block px-2 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      currentPage === 'faq' 
                        ? 'bg-red-50 text-red-500 border-l-2 border-red-500' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ❓ よくある質問
                  </Link>
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className={`block px-2 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      currentPage === 'home' 
                        ? 'bg-red-50 text-red-500 border-l-2 border-red-500' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    🏠 ホーム
                  </Link>
                  <Link
                    href="/about"
                    onClick={closeMobileMenu}
                    className={`block px-2 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      currentPage === 'about' 
                        ? 'bg-red-50 text-red-500 border-l-2 border-red-500' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ℹ️ DOG KITCHENとは
                  </Link>
                  <Link
                    href="/premium"
                    onClick={closeMobileMenu}
                    className={`block px-2 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      currentPage === 'premium' 
                        ? 'bg-red-50 text-red-500 border-l-2 border-red-500' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    💎 プレミアム機能
                  </Link>
                  <Link
                    href="/blog/articles"
                    onClick={closeMobileMenu}
                    className={`block px-2 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      currentPage === 'blog' 
                        ? 'bg-red-50 text-red-500 border-l-2 border-red-500' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    📝 記事
                  </Link>
                  <Link
                    href="/blog/features"
                    onClick={closeMobileMenu}
                    className={`block px-2 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      currentPage === 'features' 
                        ? 'bg-red-50 text-red-500 border-l-2 border-red-500' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ✨ 特集
                  </Link>
                  
                  {user ? (
                    <>
                      <Link
                        href="/mypage"
                        onClick={closeMobileMenu}
                        className={`block px-2 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                          currentPage === 'mypage' 
                            ? 'bg-red-50 text-red-500 border-l-2 border-red-500' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        👤 マイページ
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-2 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        🚪 ログアウト
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="block px-2 py-2 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 text-center"
                    >
                      🔑 ログイン
                    </Link>
                  )}
                </nav>

                {/* Additional Mobile Menu Items */}
                <div className="border-t border-gray-200 p-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    その他
                  </h3>
                  <nav className="space-y-2">
                    <Link
                      href="/search"
                      onClick={closeMobileMenu}
                      className="block px-2 py-1 text-xs text-gray-600 hover:text-red-500 transition-colors duration-200"
                    >
                      🔍 レシピ検索
                    </Link>
                  </nav>
                </div>

                {/* SNS Links for Mobile */}
                <div className="border-t border-gray-200 p-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    SNS
                  </h3>
                  <div className="flex justify-center space-x-4">
                    <a 
                      href="https://www.instagram.com/paw._._.spoon/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-red-500 transition-colors duration-200"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.youtube.com/@paw__spoon" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-red-500 transition-colors duration-200"
                      aria-label="YouTube"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://paw-spoon.com/shop" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-red-500 transition-colors duration-200"
                      aria-label="ECサイト"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="border-t border-gray-200 p-2 flex-shrink-0">
                <p className="text-xs text-gray-500 text-center">
                  &copy; 2024 DOG KITCHEN. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

