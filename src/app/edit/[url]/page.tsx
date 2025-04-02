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
  velog: string;
  phone: string;
}

interface HistoryEntry {
  area: string;
  content: string;
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
    velog: '',
    phone: '',
  });

  const [histories, setHistories] = useState<HistoryEntry[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user: loggedInUser },
        error: loginError,
      } = await supabase.auth.getUser();

      if (loginError || !loggedInUser) {
        router.push('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, auth_user_id, name, intro, email, image, github, insta, velog, phone')
        .eq('url', url)
        .single();

      if (profileError || !profile) {
        alert('명함 정보를 불러올 수 없습니다.');
        router.push('/');
        return;
      }

      if (profile.auth_user_id !== loggedInUser.id) {
        alert('본인의 명함만 수정할 수 있어요!');
        router.push(`/profile/${url}`);
        return;
      }

      const { data: historyData } = await supabase
        .from('history')
        .select('area, content')
        .eq('user_id', profile.id);

      const safeData = Object.fromEntries(
        Object.entries(profile).map(([key, value]) => [key, value ?? ''])
      );
      setForm((prev) => ({ ...prev, ...safeData }));
      setUserId(profile.id);

      if (historyData && historyData.length > 0) {
        setHistories(historyData as HistoryEntry[]);
      } else {
        setHistories([{ area: '', content: '' }]);
      }

      setLoading(false);
    })();
  }, [url, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHistoryChange = (index: number, field: 'area' | 'content', value: string) => {
    const newHistories = [...histories];
    newHistories[index][field] = value;
    setHistories(newHistories);
  };

  const handleAddHistory = () => {
    setHistories([...histories, { area: '', content: '' }]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error: userError } = await supabase
      .from('users')
      .update(form)
      .eq('url', url);

    if (userError) {
      alert('유저 정보 저장 실패!');
      console.error(userError);
      return;
    }

    if (userId) {
      const filtered = histories.filter((h) => h.area || h.content);

      // 기존 히스토리 삭제
      const { error: deleteError } = await supabase
        .from('history')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('기존 히스토리 삭제 실패', deleteError);
        return;
      }

      // 새 히스토리 삽입
      if (filtered.length > 0) {
        const inserts = filtered.map((h) => ({
          user_id: userId,
          area: h.area,
          content: h.content,
        }));

        const { error: historyError } = await supabase
          .from('history')
          .insert(inserts);

        if (historyError) {
          console.error('히스토리 저장 실패', historyError);
        }
      }
    }

    router.push(`/profile/${url}`);
  };

  if (loading) return <p className="p-6 text-center">로딩 중...</p>;

  return (
    <div className="min-h-[calc(100vh-6rem)] flex justify-center items-start pt-[100px] overflow-hidden relative">
      <form
        onSubmit={handleSave}
        className="p-12 flex gap-[80px] border border-black/10 rounded-[10px] bg-white shadow-[8px_8px_20px_10px_rgba(0,0,0,0.2)]"
      >
        <div className="w-[450px] space-y-4">
          <div className="w-[450px] h-[450px] overflow-hidden rounded">
            <img
              src={form.image || '/someone.png'}
              alt="card preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-sm text-black space-y-2">
            <p className="text-gray-500">contact via</p>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-2 border rounded"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="max-w-[800px] flex flex-col space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="p-2 border rounded text-2xl font-semibold"
          />
          <textarea
            name="intro"
            value={form.intro}
            onChange={handleChange}
            placeholder="Introduction"
            className="p-2 border rounded text-lg"
            rows={3}
          />
          <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="p-2 border rounded" />
          <input name="github" value={form.github} onChange={handleChange} placeholder="GitHub URL" className="p-2 border rounded" />
          <input name="insta" value={form.insta} onChange={handleChange} placeholder="Instagram URL" className="p-2 border rounded" />
          <input name="velog" value={form.velog} onChange={handleChange} placeholder="Velog URL" className="p-2 border rounded" />

          <h2 className="text-lg font-semibold mt-4">히스토리 입력</h2>
{histories.map((h, i) => (
  <div key={i} className="space-y-2 rounded relative">
    <button
      type="button"
      onClick={() => {
        const updated = [...histories];
        updated.splice(i, 1);
        setHistories(updated);
      }}
      className="absolute top-1 right-1 text-red-500 text-sm hover:underline"
    >
      🗑 삭제
    </button>
    <input
      value={h.area}
      onChange={(e) => handleHistoryChange(i, 'area', e.target.value)}
      placeholder="분야 (area)"
      className="w-full p-2 border rounded"
    />
    <textarea
      value={h.content}
      onChange={(e) => handleHistoryChange(i, 'content', e.target.value)}
      placeholder="내용 (content)"
      rows={3}
      className="w-full p-2 border rounded"
    />
  </div>
))}


          <button
            type="button"
            onClick={handleAddHistory}
            className="text-blue-600 text-sm hover:underline"
          >
            + 히스토리 추가
          </button>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
}
