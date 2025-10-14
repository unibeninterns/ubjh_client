"use client";

import { AuthProvider } from '@/contexts/AuthContext';

export default function ReviewerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider userType="reviewer">
      {children}
    </AuthProvider>
  );
}