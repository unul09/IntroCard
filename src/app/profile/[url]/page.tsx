import { supabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';
import { use } from 'react';
import { Phone, Mail } from 'lucide-react';
import ClientButtons from '@/components/ClientButtons';
import ClientEditWrapper from '@/components/ClientEditWrapper';

export default function Page(props: { params: Promise<{ url: string }> }) {
  const { url } = use(props.params);

  const { data: user, error: userError } = use(
    supabaseServer
      .from('users')
      .select('id, name, intro, email, phone, image, github, insta, velog, auth_user_id')
      .eq('url', url)
      .single()
  );

  if (userError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: '#666' }}>
        <p>프로필을 찾을 수 없어요 😞</p>
      </div>
    );
  }

  const { data: history } = use(
    supabaseServer
      .from('history')
      .select('area, content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
  );

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
        <div style={{ width: '450px' }}>
          <div style={{ width: '450px', height: '450px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
            <img
              src={user.image || '/someone.png'}
              alt="card image"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#000', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <p style={{ color: '#6b7280', marginBottom: '0.75rem' }}>contact via</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: '#333' }} />
                <span>{user.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: '#333' }} />
                <span>{user.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginLeft: '1.5rem' }}>
              {user.insta && (
                <img
                  src="/icons/instagram.png"
                  alt="Instagram"
                  style={{ width: '50px', height: '50px', borderRadius: '9999px' }}
                />
              )}
              {user.github && (
                <img
                  src="/icons/github.png"
                  alt="GitHub"
                  style={{ width: '50px', height: '50px', borderRadius: '9999px', objectFit: 'cover' }}
                />
              )}
              {user.velog && (
                <img
                  src="/icons/velog.png"
                  alt="Velog"
                  style={{ width: '50px', height: '50px', borderRadius: '9999px', objectFit: 'cover' }}
                />
              )}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 600, marginBottom: '0.5rem' }}>{user.name}</h1>
          <p className="whitespace-pre-line" style={{ fontSize: '24px', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            {user.intro || '소개가 없습니다.'}
          </p>
          <hr style={{ marginBottom: '1.5rem', borderColor: '#d1d5db' }} />

          <div style={{ fontSize: '16px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.keys(grouped).length > 0 ? (
              Object.entries(grouped).map(([area, contents]) => (
                <div key={area}>
                  <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '0.5rem' }}>{area}</p>
                  <ul style={{ paddingLeft: '1.25rem', listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {contents.map((content, idx) => (
                      <li key={idx} style={{ color: '#333' }}>{content}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p style={{ color: '#666' }}>히스토리 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      <ClientButtons targetId="introcard" />
      <ClientEditWrapper ownerId={user.auth_user_id} url={url} />

    </div>
  );
}