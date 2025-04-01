// app/login/page.tsx
'use client';

import LoginButton from '@/components/LoginButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="text-gray-600">Google로 로그인해서 명함을 만들고 수정해보세요!</p>
        <LoginButton />
      </div>
    </div>
  );
}
