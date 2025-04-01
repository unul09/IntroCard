// ✅ ProfilePage: 사용자 전체 정보 + 히스토리 조회
import { supabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';
import { use } from 'react';

export default function Page(props: { params: Promise<{ url: string }> }) {
    const { url } = use(props.params);
  
    // 1. 사용자 정보 조회
    const { data: user, error: userError } = use(
      supabaseServer
        .from('users')
        .select('id, name, intro, email, image, github, insta')
        .eq('url', url)
        .single()
    );
  
    // 2. 사용자 정보가 없다면 에러 반환
    if (userError || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          <p>프로필을 찾을 수 없어요 😢</p>
        </div>
      );
    }
  
    // 3. 사용자 정보가 있을 때만 history 조회
    const { data: history, error: historyError } = use(
      supabaseServer
        .from('history')
        .select('area, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">{user.name}</h1>
        {user.intro && <p className="text-gray-700 text-center mb-2">{user.intro}</p>}
        {user.email && <p className="text-sm text-gray-600">📧 {user.email}</p>}
        {user.github && <p className="text-sm text-gray-600">🐱 GitHub: {user.github}</p>}
        {user.insta && <p className="text-sm text-gray-600">📸 Instagram: {user.insta}</p>}
        {user.image && (
          <img
            src={user.image}
            alt="profile"
            className="w-24 h-24 mx-auto mt-4 rounded-full object-cover"
          />
        )}

        <hr className="my-4" />
        <h2 className="text-xl font-semibold">히스토리</h2>
        {history && history.length > 0 ? (
          <ul className="mt-2 space-y-2 text-sm">
            {history.map((item, idx) => (
              <li key={idx} className="border rounded p-2">
                <p className="text-gray-800 font-medium">📍 {item.area}</p>
                <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                <p className="text-xs text-right text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">히스토리 정보가 없습니다.</p>
        )}

        <Link
          href={`/edit/${url}`}
          className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded text-center w-full"
        >
          수정하기
        </Link>
      </div>
    </div>
  );
}
