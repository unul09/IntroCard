import { use } from 'react';
import ClientButtons from '@/components/ClientButtons';
import ClientEditWrapper from '@/components/ClientEditWrapper';
import ProfileCard from '@/components/ProfileCard';
import HistorySection from '@/components/HistorySection';
import { fetchUserByUrl, fetchUserHistory } from '@/lib/queries';


export default function Page(props: { params: Promise<{ url: string }> }) {
  const { url } = use(props.params);

  const { data: user, error: userError } = use(fetchUserByUrl(url));

  if (userError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: '#666' }}>
        <p>프로필을 찾을 수 없어요 😞</p>
      </div>
    );
  }

  const { data: history } = use(fetchUserHistory(user.id));

  const grouped = (history ?? []).reduce((acc, cur) => {
    if (!acc[cur.area]) acc[cur.area] = [];
    acc[cur.area].push(cur.content);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="min-h-[calc(100vh-6rem)] flex justify-center items-start pt-[100px] overflow-hidden relative">
      <div
        id="introcard"
        className="p-12 flex gap-[80px]"
        style={{
          border: '1px solid rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
          color: '#000000',
          borderRadius: '10px',
          boxShadow: '8px 8px 20px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <ProfileCard
  image={user.image}
  phone={user.phone}
  email={user.email}
  github={user.github}
  insta={user.insta}
  velog={user.velog}
/>

        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 600, marginBottom: '0.5rem' }}>{user.name}</h1>
          <p className="whitespace-pre-line" style={{ fontSize: '24px', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            {user.intro || '소개가 없습니다.'}
          </p>
          <hr style={{ marginBottom: '1.5rem', borderColor: '#d1d5db' }} />

          <HistorySection groupedHistory={grouped} />

        </div>
      </div>

      <ClientButtons targetId="introcard" />
      <ClientEditWrapper ownerId={user.auth_user_id} url={url} />

    </div>
  );
}