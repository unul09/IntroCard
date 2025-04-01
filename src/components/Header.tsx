'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') setUser(session?.user ?? null);
      if (event === 'SIGNED_OUT') setUser(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <header className="w-full border-b p-4 flex justify-between items-center">
      <h1
        onClick={() => router.push('/')}
        className="text-xl font-bold cursor-pointer"
      >
        💳 IntroCard
      </h1>

      {user ? (
        <div className="flex flex-col items-end gap-1">
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/mypage')}
              className="px-4 py-1 bg-blue-600 text-white rounded"
            >
              마이페이지
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-gray-700 text-white rounded"
            >
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-1 bg-green-600 text-white rounded"
        >
          Google로 로그인
        </button>
      )}
    </header>
  );
}
