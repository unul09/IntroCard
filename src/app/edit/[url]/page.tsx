'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface FormFields {
  name: string;
  intro: string;
  email: string;
  image: string;
  github: string;
  insta: string;
  historyArea: string;
  historyContent: string;
}

export default function EditPage() {
  const params = useParams();
  const url = params.url as string;
  const router = useRouter();

  const [form, setForm] = useState<FormFields>({
    name: '',
    intro: '',
    email: '',
    image: '',
    github: '',
    insta: '',
    historyArea: '',
    historyContent: '',
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 1. 로그인 유저 정보 확인
      const {
        data: { user: loggedInUser },
        error: loginError,
      } = await supabase.auth.getUser();

      if (loginError || !loggedInUser) {
        router.push('/login');
        return;
      }

      // 2. 현재 URL에 해당하는 명함 데이터 조회
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, auth_user_id, name, intro, email, image, github, insta')
        .eq('url', url)
        .single();

      if (profileError || !profile) {
        alert('명함 정보를 불러올 수 없습니다.');
        router.push('/');
        return;
      }

      // 3. 본인 명함이 아니면 접근 차단
      if (profile.auth_user_id !== loggedInUser.id) {
        alert('본인의 명함만 수정할 수 있어요!');
        router.push(`/profile/${url}`);
        return;
      }

      const safeData = Object.fromEntries(
        Object.entries(profile).map(([key, value]) => [key, value ?? ''])
      );
      setForm((prev) => ({ ...prev, ...safeData }));
      setUserId(profile.id);
      setLoading(false);
    })();
  }, [url, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const { historyArea, historyContent, ...userData } = form;
    const { error: userError } = await supabase
      .from('users')
      .update(userData)
      .eq('url', url);

    if (userError) {
      alert('유저 정보 저장 실패!');
      console.error(userError);
      return;
    }

    if (userId && (historyArea || historyContent)) {
      const { error: historyError } = await supabase.from('history').insert({
        user_id: userId,
        area: historyArea,
        content: historyContent,
      });

      if (historyError) {
        console.error('히스토리 저장 실패', historyError);
      }
    }

    router.push(`/profile/${url}`);
  };

  if (loading) return <p className="p-6 text-center">로딩 중...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSave} className="space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">프로필 수정</h1>
        {(['name', 'intro', 'email', 'image', 'github', 'insta'] as (keyof FormFields)[]).map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field}
            className="w-full p-2 border rounded"
          />
        ))}

        <h2 className="pt-4 font-semibold">히스토리 입력</h2>
        <input
          name="historyArea"
          value={form.historyArea}
          onChange={handleChange}
          placeholder="분야 (area)"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="historyContent"
          value={form.historyContent}
          onChange={handleChange}
          placeholder="내용 (content)"
          rows={3}
          className="w-full p-2 border rounded"
        />

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          저장하기
        </button>
      </form>
    </div>
  );
}
