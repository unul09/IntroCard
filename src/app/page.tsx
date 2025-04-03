// ❌ 'use client' 제거 (서버 컴포넌트)
import ClientButtons from '@/components/ClientButtons';
import ClientEditWrapper from '@/components/ClientEditWrapper';
import ProfileCard from '@/components/ProfileCard';
import HistorySection from '@/components/HistorySection';
import { fetchUserByUrl, fetchUserHistory } from '@/lib/queries';
import Link from 'next/link';

export default async function LandingPage() {
  const introUrl = 'IntroCard';
  const { data: user, error: userError } = await fetchUserByUrl(introUrl);

  if (userError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>프로필을 찾을 수 없어요 😞</p>
      </div>
    );
  }

  const { data: history } = await fetchUserHistory(user.id);

  const grouped = (history ?? []).reduce((acc, cur) => {
    acc[cur.area] = cur.content;
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="min-h-[calc(100vh-6rem)] flex justify-center items-start pt-[100px] overflow-hidden relative">
      <div
        id="introcard"
        className="p-12 flex gap-[80px] border border-black/10 bg-white text-black rounded-[10px] shadow-[8px_8px_20px_10px_rgba(0,0,0,0.2)]"
      >
        <ProfileCard
          image={user.image}
          phone={user.phone}
          email={user.email}
          github={user.github}
          insta={user.insta}
          velog={user.velog}
        />

        <div className="max-w-[800px] flex flex-col">
          <h1 className="text-[48px] font-semibold mb-2">{user.name}</h1>
          <p className="whitespace-pre-line text-2xl mb-6 leading-[1.5]">
            {user.intro || '소개가 없습니다.'}
          </p>
          <hr className="mb-6 border-gray-300" />
          <HistorySection groupedHistory={grouped} />

          <div className="flex flex-col items-start gap-2 mt-6">
            <p className="text-sm">👇 <strong>지금 바로 시작해보세요!</strong></p>
            <Link
              href="/mypage"
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow hover:bg-blue-700 transition"
            >
              Create My IntroCard
            </Link>
          </div>
        </div>
      </div>

      {/* 클라이언트 컴포넌트는 그대로 */}
      <ClientButtons targetId="introcard" />
      <ClientEditWrapper ownerId={user.auth_user_id} url={introUrl} />
    </div>
  );
}
