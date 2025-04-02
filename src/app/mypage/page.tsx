'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Card {
  id: number;
  url: string;
  name: string;
  intro: string;
  image: string | null;
}

export default function MyPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, url, name, intro, image')
        .eq('auth_user_id', user.id);

      if (error) {
        console.error('명함 로딩 실패', error);
        return;
      }

      setCards(data || []);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (cardId: number) => {
    const ok = confirm('정말 이 명함을 삭제할까요? 되돌릴 수 없습니다!');
    if (!ok) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', cardId)
      .eq('auth_user_id', user.id);

    if (error) {
      alert('삭제에 실패했어요 😢');
      console.error(error);
      return;
    }

    setCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  if (loading) return <p className="p-6 text-center">로딩 중...</p>;

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">내 명함 목록</h1>
        <button
          onClick={() => router.push('/edit')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow"
        >
          ➕ 명함 추가하기
        </button>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <li
            key={card.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex gap-4">
              <img
                src={card.image || '/someone.png'}
                alt="thumbnail"
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-lg font-bold text-gray-900">{card.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">{card.intro}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => router.push(`/profile/${card.url}`)}
                className="bg-blue-800 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
              >
                보기
              </button>
              <button
                onClick={() => router.push(`/edit/${card.url}`)}
                className="bg-green-800 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
