# 🪪 IntroCard

**IntroCard**는 나를 소개하는 디지털 명함을 간편하게 생성하고 공유할 수 있는 웹 서비스입니다.  
한눈에 나를 보여주는 **소셜 링크, 프로젝트, 이력 등**을 정리하여 개인 프로필을 만들고, 이미지로 저장하거나 링크로 공유하세요!


(현재는 웹 환경에 최적화되어 있으며, 모바일 지원은 곧 추가될 예정입니다.)
> 🔗 데모 링크: [https://intro-card-one.vercel.app/](https://intro-card-one.vercel.app/)


<br><br>

## ✨ 주요 기능

- 나만의 URL로 프로필 생성 (`https://intro-card-one.vercel.app/profile/your-url`)
- 연락처, 소개, 소셜 링크(GitHub, Instagram, Velog) 추가
- 프로젝트/경력 이력 히스토리 작성
- 프로필을 PNG 이미지로 다운로드
- 링크 복사 기능
- 로그인 없이도 다른 사람의 프로필 조회
- 본인이 생성한 프로필 수정/삭제 (Supabase + RLS 기반 권한 관리)

<br><br>

## 🖼️ 예시 화면

### 🌟 메인 랜딩 페이지
![image](https://github.com/user-attachments/assets/223dafcf-066a-49d5-8eb2-e137a9f1afa5)
<br>

### 🔍 프로필 조회
![image](https://github.com/user-attachments/assets/48b12f0d-e766-4da4-ab66-bfe67aa23d56)
<br>

### ✏️ 프로필 수정
![image](https://github.com/user-attachments/assets/17f771ae-6a1f-4681-970e-6135707551f7)
<br>

<br><br>

## 🛠️ 사용 방법

1. **로그인**  
   - Google 계정으로 로그인
2. **URL 등록**  
   - 원하는 프로필 URL을 입력해 생성
3. **프로필 편집**  
   - 이미지, 소개, 연락처, 히스토리 등을 입력하고 저장
4. **공유 & 다운로드**  
   - 프로필을 링크로 공유하거나 PNG 이미지로 다운로드 가능

<br><br>

## 🧑‍💻 기술 스택

- **Next.js 15** + **App Router**
- **Tailwind CSS**
- **Supabase** (Auth, DB, Storage)
- **Vercel** (배포 & CI/CD)
- **html-to-image** (이미지 다운로드)
- **React Image Crop** (이미지 자르기)

<br><br>

## 📌 배포 주소

👉 [https://intro-card-one.vercel.app/](https://intro-card-one.vercel.app/)
