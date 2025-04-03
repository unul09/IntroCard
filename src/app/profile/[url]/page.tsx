import { use } from 'react';
import ClientButtons from '@/components/ClientButtons';
import ClientEditWrapper from '@/components/ClientEditWrapper';
import ProfileCard from '@/components/ProfileCard';
import ClientProfileCard from '@/components/ClientProfileCard';
import HistorySection from '@/components/HistorySection';
import { fetchUserByUrl, fetchUserHistory } from '@/lib/queries';

export default function Page(props: { params: Promise<{ url: string }> }) {
  const { url } = use(props.params);

  const { data: user, error: userError } = use(fetchUserByUrl(url));

  if (userError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>프로필을 찾을 수 없어요 😞</p>
      </div>
    );
  }

  const { data: history } = use(fetchUserHistory(user.id));

  const grouped = (history ?? []).reduce((acc, cur) => {
    acc[cur.area] = cur.content;
    return acc;
  }, {} as Record<string, string[]>);

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    alert(`${label}가 복사되었습니다!`);
  };

  const openInNewTab = (url?: string | null) => {
    if (!url) return;
    const validUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(validUrl, '_blank');
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex justify-center items-start pt-[100px] overflow-hidden relative">
      <div
        id="introcard"
        className="p-12 flex gap-[80px] border border-black/10 bg-white text-black rounded-[10px] shadow-[8px_8px_20px_10px_rgba(0,0,0,0.2)]"
      >
        <ClientProfileCard
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
        </div>
      </div>

      <ClientButtons targetId="introcard" />
      <ClientEditWrapper ownerId={user.auth_user_id} url={url} />
    </div>
  );
}
