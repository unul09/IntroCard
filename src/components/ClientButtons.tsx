// src/components/ClientButtons.tsx
'use client';

import html2canvas from 'html2canvas';
import { useRef } from 'react';

export default function ClientButtons({ targetId }: { targetId: string }) {
  const downloadRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    const canvas = await html2canvas(element, {
      useCORS: true,        // ✅ 외부 이미지 허용
      allowTaint: false,    // ✅ 보안 우회 방지
      scale: 2,             // ✅ 고해상도 렌더링
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'introcard.png';
    link.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다!');
  };

  return (
    <div className="absolute bottom-4 right-10 flex flex-col gap-5 items-end">
      <button
        onClick={handleCopy}
        className="bg-gray-100 border border-gray-300 text-gray-800 font-medium px-5 py-2.5 rounded-full text-sm shadow-sm hover:bg-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200"
      >
        Copy profile link
      </button>
      <button
        onClick={handleDownload}
        className="bg-gray-100 border border-gray-300 text-gray-800 font-medium px-5 py-2.5 rounded-full text-sm shadow-sm hover:bg-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200"
      >
        Download as image
      </button>
    </div>
  );
}
