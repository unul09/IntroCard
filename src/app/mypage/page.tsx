'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Card {
  id: number;
  url: string;
  name: string;
  intro: string;
}

export default function MyPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null); // 🔗 복사 상태
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, url, name, intro')
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
      .eq('auth_user_id', user.id); // 🔐 보안 체크

    if (error) {
      alert('삭제에 실패했어요 😢');
      console.error(error);
      return;
    }

    setCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const handleCopy = async (url: string) => {
    const fullUrl = `${window.location.origin}/profile/${url}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);

    setTimeout(() => {
      setCopiedUrl(null);
    }, 1500);
  };

  if (loading) return <p className="p-6 text-center">로딩 중...</p>;

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">내 명함 목록</h1>
        <button
          onClick={() => router.push('/')}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          ➕ 명함 추가하기
        </button>
      </div>

      <ul className="space-y-4">
        {cards.map((card) => (
          <li key={card.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold">{card.name}</h2>
            <p className="text-gray-600">{card.intro}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              <button
                onClick={() => router.push(`/profile/${card.url}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                보기
              </button>
              <button
                onClick={() => router.push(`/edit/${card.url}`)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                삭제
              </button>
              <button
                onClick={() => handleCopy(card.url)}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                {copiedUrl === card.url ? '복사됨!' : '링크 복사'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
