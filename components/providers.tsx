'use client';

import { AuthProvider } from './auth/supabase-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}





