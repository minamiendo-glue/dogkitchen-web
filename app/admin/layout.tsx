'use client';

import { AdminAuthProvider } from '@/contexts/admin-auth-context';
import { AdminAuthGuard } from '@/components/admin/admin-auth-guard';
import { AdminLayout } from '@/components/admin/admin-layout';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  
  // ログインページの場合は認証確認を行わない
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminAuthProvider>
      <AdminAuthGuard>
        <AdminLayout>
          {children}
        </AdminLayout>
      </AdminAuthGuard>
    </AdminAuthProvider>
  );
}
