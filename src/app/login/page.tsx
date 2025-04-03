'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`, // ✅ 로그인 후 돌아올 경로
          },
        });
      }
    })();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>구글 로그인 중입니다...</p>
    </div>
  );
}
