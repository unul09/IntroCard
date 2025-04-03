'use client';

import { useParams } from 'next/navigation';
import { useEditProfile } from '@/hooks/useEditProfile';
import EditForm from '@/components/EditForm';

export default function EditPage() {
  const params = useParams();
  const url = params.url as string;

  const {
    form,
    setForm,
    histories,
    setHistories,
    userId,
    loading,
  } = useEditProfile(url);

  if (loading) return <p className="p-6 text-center">로딩 중...</p>;

  return (
    <div className="min-h-[calc(100vh-6rem)] flex justify-center items-start pt-[100px] overflow-hidden relative">
      <EditForm
        form={form}
        setForm={setForm}
        histories={histories}
        setHistories={setHistories}
        userId={userId}
        url={url}
      />
    </div>
  );
}
