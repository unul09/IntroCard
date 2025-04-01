'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    })();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!/^[a-zA-Z0-9_]+$/.test(url)) {
      alert('URL은 영문, 숫자, 밑줄(_)만 사용할 수 있어요.');
      return;
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('url', url)
      .single();

    if (existing) {
      alert('이미 존재하는 URL이에요 😢');
      return;
    }

    const { error } = await supabase.from('users').insert({
      url,
      auth_user_id: user.id,
    });

    if (error) {
      alert('생성 실패 😢');
      console.error(error);
      return;
    }

    router.push(`/edit/${url}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <p className="p-6 text-center">로딩 중...</p>;

  return (
    <div className="min-h-screen p-6">
      {/* 상단 로그아웃 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">명함 만들기</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          로그아웃
        </button>
      </div>

      {/* 명함 생성 폼 */}
      <div className="flex items-center justify-center">
        <form onSubmit={handleCreate} className="space-y-4 w-full max-w-sm">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="원하는 URL을 입력하세요 (예: kimdev)"
            className="w-full p-2 border rounded"
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">
            생성하기
          </button>
        </form>
      </div>
    </div>
  );
}
