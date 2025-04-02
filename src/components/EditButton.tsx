'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditButton({ ownerId, url }: { ownerId: string; url: string }) {
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id === ownerId) setIsOwner(true);
    })();
  }, [ownerId]);

  if (!isOwner) return null;

  return (
    <button
      onClick={() => router.push(`/edit/${url}`)}
      className="fixed bottom-12 right-57 bg-blue-600 text-white px-8 py-3 rounded-full text-sm shadow-lg hover:bg-blue-700 transition"
    >
      ✏️ 수정하기
    </button>
  );
}
