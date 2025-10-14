"use client";

import { AuthProvider } from '@/contexts/AuthContext';

export default function AuthorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider userType="author">
      {children}
    </AuthProvider>
  );
}