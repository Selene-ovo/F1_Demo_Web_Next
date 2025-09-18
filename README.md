# F1 Demo Website - Next.js

Vue.js에서 Next.js로 마이그레이션된 F1 데모 웹사이트입니다.

## 기술 스택

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: CSS

## 주요 기능

- F1 드라이버 정보
- 팀 정보
- 서킷 정보
- F1 역사
- 규칙 안내

## 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
├── components/          # React 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   └── ui/             # UI 컴포넌트
├── assets/             # 정적 파일 (이미지, CSS)
└── lib/                # 유틸리티 함수
```

## 마이그레이션 노트

Vue.js 프로젝트에서 Next.js로 마이그레이션되었습니다.