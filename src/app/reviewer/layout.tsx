import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Reviewer Portal - UBJH',
  description: 'University of Benin Journal of Humanities Reviewer Portal',
};

export default function ReviewerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider userType="reviewer">
      {children}
    </AuthProvider>
  );
}