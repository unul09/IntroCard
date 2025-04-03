'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { fetchUserProfileForEdit, fetchHistoryForEdit } from '@/lib/queries';

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

export function useEditProfile(url: string) {
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

      const { data: profile, error: profileError } = await fetchUserProfileForEdit(url);

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

      const { data: historyData } = await fetchHistoryForEdit(profile.id);

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

  return {
    form,
    setForm,
    histories,
    setHistories,
    userId,
    loading,
  };
}
