'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };

    fetchUser();

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
    router.push('/');
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
    <header className="w-full bg-white shadow-md px-8 py-3 flex justify-between items-center">
      {/* 로고 + 서브텍스트 */}
      <div
        className="flex flex-col cursor-pointer"
        onClick={() => router.push('/')}
      >
        <h1 className="text-xl font-bold leading-tight">IntroCard</h1>
        <p className="text-sm text-gray-400 -mt-1">Meet me in one glance.</p>
      </div>

      {/* 로그인 여부에 따라 버튼 분기 */}
      {user ? (
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <span>{user.email}</span>
          <button
            onClick={() => router.push('/mypage')}
            className="px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            My Page
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
          >
            Log out
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition"
        >
          Start with Google
        </button>
      )}
    </header>
  );
}
