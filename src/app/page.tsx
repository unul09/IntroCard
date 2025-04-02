'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Phone, Mail } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-6rem)] flex justify-center items-start pt-[100px] overflow-hidden relative">
      {/* 그림자 사각형 박스 */}
      <div className="rounded-[10px] shadow-[8px_8px_20px_10px_rgba(0,0,0,0.2)] border border-black/2 bg-white p-12 flex gap-[80px]">
        {/* Left Section */}
        <div className="w-[450px]">
          {/* 이미지 컨테이너 */}
          <div className="w-[450px] h-[450px] overflow-hidden rounded mb-4">
            <img
              src="/business-card-colorful.png"
              alt="card image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 연락처 + 아이콘 wrapper */}
          <div className="flex justify-between items-end mt-3">
            {/* 연락처 */}
            <div className="text-sm text-black space-y-1">
              <p className="text-gray-500 mb-3">contact via</p>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-700" />
                <span>010-4782-5738</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-700" />
                <span>morning20404@gmail.com</span>
              </div>
            </div>

            {/* 아이콘 그룹 */}
            <div className="flex gap-4 ml-6">
              <img
                src="/icons/instagram.png"
                alt="Instagram"
                className="w-[50px] h-[50px] rounded-full"
              />
              <img
                src="/icons/github.png"
                alt="GitHub"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              <img
                src="/icons/velog.png"
                alt="Velog"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col max-w-[800px]">
          <h1 className="text-[48px] font-semibold mb-2">IntroCard</h1>
          <p className="text-[24px] mb-6 leading-snug">
            Meet me in one glance. <br />
            All you need to know — right here.
          </p>

          <hr className="mb-6 border-gray-300" />

          <div className="text-base space-y-6">
            <div>
              <p className="text-sm mb-1">💡 <strong>About this project</strong></p>
              <p className="text-[16px]">나를 소개하는 디지털 명함 서비스</p>
            </div>
            <div>
              <p className="text-sm mb-1">✨ <strong>Features</strong></p>
              <ul className="list-disc list-inside text-[16px] space-y-1">
                <li>나만의 URL로 디지털 명함 생성</li>
                <li>소셜 링크, 연락처, 프로젝트 정리</li>
                <li>QR 코드 & 이미지 다운로드</li>
              </ul>
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm">👇 <strong>지금 바로 시작해보세요!</strong></p>
              <button
                onClick={() => router.push('/mypage')}
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow hover:bg-blue-700 transition"
              >
                Create My IntroCard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Buttons */}
      <div className="absolute bottom-4 right-10 flex flex-col gap-5 items-end">
  <button className="bg-gray-100 border border-gray-300 text-gray-800 font-medium px-5 py-2.5 rounded-full text-sm shadow-sm hover:bg-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200">
    Copy profile link
  </button>
  <button className="bg-gray-100 border border-gray-300 text-gray-800 font-medium px-5 py-2.5 rounded-full text-sm shadow-sm hover:bg-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200">
    Download as image
  </button>
</div>

    </div>
  );
}
