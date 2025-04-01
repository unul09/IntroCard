// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('세션 가져오기 실패:', error.message);
        return;
      }

      console.log('로그인 성공! 세션:', data?.session);

      router.replace('/'); // 로그인 성공 후 이동할 페이지
    };

    handleOAuthCallback();
  }, []);

  return <p className="p-6 text-center">로그인 처리 중입니다...</p>;
}
