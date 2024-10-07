import { Suspense } from 'react';
import AuthCheck from '@/components/auth-check';
import LoginForm from '@/components/login-form';
import Dashboard from '@/components/dashboard';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCheck fallback={<LoginForm />}>
        <Dashboard />
      </AuthCheck>
    </Suspense>
  );
}