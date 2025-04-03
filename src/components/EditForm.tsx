'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ImageCropperModal from './ImageCropperModal';

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
  contents: string[];
}

interface EditFormProps {
  form: FormFields;
  setForm: React.Dispatch<React.SetStateAction<FormFields>>;
  histories: HistoryEntry[];
  setHistories: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
  userId: number | null;
  url: string;
}

export default function EditForm({
  form,
  setForm,
  histories,
  setHistories,
  userId,
  url,
}: EditFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropImage, setCropImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImage(reader.result as string); // crop modal 열기
    };
    reader.readAsDataURL(file);
  };

  const handleImageDelete = () => {
    setForm((prev) => ({ ...prev, image: '' }));
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setForm((prev) => ({ ...prev, image: croppedDataUrl }));
    setCropImage(null);
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
      const filtered = histories.filter((h) => h.area && h.contents.length > 0);

      const { error: deleteError } = await supabase
        .from('history')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('기존 히스토리 삭제 실패', deleteError);
        return;
      }

      if (filtered.length > 0) {
        const inserts = filtered.map((h) => ({
          user_id: userId,
          area: h.area,
          content: h.contents,
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

  return (
    <>
      {cropImage && (
        <ImageCropperModal
          image={cropImage}
          onClose={() => setCropImage(null)}
          onComplete={handleCropComplete}
        />
      )}

      <form
        onSubmit={handleSave}
        className="p-12 flex gap-[80px] border border-black/10 rounded-[10px] bg-white shadow-[8px_8px_20px_10px_rgba(0,0,0,0.2)]"
      >
        {/* LEFT SIDE - 이미지 + 연락처 */}
        <div className="w-[450px] space-y-4">
          <div className="relative w-[450px] h-[450px] overflow-hidden rounded group cursor-pointer" onClick={handleImageClick}>
            <img
              src={form.image || '/someone.png'}
              alt="card preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-white transition">
              <p className="text-sm">클릭하여 이미지 변경</p>
              {form.image && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageDelete();
                  }}
                  className="mt-2 text-xs underline"
                >
                  이미지 삭제
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-sm text-black space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-xs text-gray-500">전화번호</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full bg-transparent outline-none border-b border-transparent focus:border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs text-gray-500">이메일</label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-transparent outline-none border-b border-transparent focus:border-gray-300"
              />
            </div>
          </div>

          {['github', 'insta', 'velog'].map((field) => (
          <div className="flex flex-col gap-1" key={field}>
            <label htmlFor={field} className="text-xs text-gray-500">
              {field === 'github' ? 'GitHub' : field === 'insta' ? 'Instagram' : 'Velog'}
            </label>
            <input
              id={field}
              name={field}
              value={form[field as keyof FormFields]}
              onChange={handleChange}
              placeholder={`${field} URL`}
              className="bg-transparent outline-none border-b border-transparent focus:border-gray-300"
            />
          </div>
        ))}
        </div>

        {/* RIGHT SIDE 그대로 유지 */}
        <div className="max-w-[800px] flex flex-col space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-xs text-gray-500">이름</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="text-3xl font-bold bg-transparent outline-none border-b border-transparent focus:border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="intro" className="text-xs text-gray-500">소개</label>
          <textarea
            id="intro"
            name="intro"
            value={form.intro}
            onChange={handleChange}
            placeholder="Introduction"
            className="bg-transparent outline-none border-b border-transparent focus:border-gray-300 text-lg resize-none"
            rows={3}
          />
        </div>

        

        <h2 className="text-lg font-semibold mt-4">히스토리 입력</h2>

        {histories.map((h, i) => (
  <div key={i} className="space-y-2 rounded border p-3 bg-gray-50 relative">
    {/* 전체 히스토리 카드 삭제 버튼 */}
    <button
      type="button"
      onClick={() => {
        const updated = [...histories];
        updated.splice(i, 1);
        setHistories(updated);
      }}
      className="absolute top-2 right-4 text-red-500 text-sm hover:underline"
    >
      ✖
    </button>

    {/* 분야 입력 */}
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">분야</label>
      <input
        value={h.area}
        onChange={(e) => {
          const updated = [...histories];
          updated[i].area = e.target.value;
          setHistories(updated);
        }}
        placeholder="분야 (area)"
        className="w-full bg-transparent outline-none border-b border-transparent focus:border-gray-300 font-semibold"
      />
    </div>

    {/* 내용 입력 리스트 */}
    {h.contents.map((content, j) => (
      <div key={j} className="relative mb-4">
        <label className="text-xs text-gray-500">내용</label>
        <textarea
          value={content}
          onChange={(e) => {
            const updated = [...histories];
            updated[i].contents[j] = e.target.value;
            setHistories(updated);
          }}
          placeholder="내용 (content)"
          rows={2}
          className="w-full bg-transparent outline-none border-b border-transparent focus:border-gray-300 text-base resize-none"
        />
        {/* content 삭제 버튼 (우상단 고정) */}
        <button
          type="button"
          onClick={() => {
            const updated = [...histories];
            updated[i].contents.splice(j, 1);
            if (updated[i].contents.length === 0) updated.splice(i, 1);
            setHistories(updated);
          }}
          className="absolute top-1 right-1 text-red-500 text-sm hover:underline"
        >
          ⨉
        </button>
      </div>
    ))}

    {/* + 내용 추가 버튼 */}
    <button
      type="button"
      onClick={() => {
        const updated = [...histories];
        updated[i].contents.push('');
        setHistories(updated);
      }}
      className="text-blue-500 text-sm hover:underline"
    >
      + 내용 추가
    </button>
  </div>
))}


        <button
          type="button"
          onClick={() =>
            setHistories([...histories, { area: '', contents: [''] }])
          }
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
    </>
  );
}