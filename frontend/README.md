# Frontend

## 기술 스택

| 분류                 | 기술                      |
| -------------------- | ------------------------- |
| 언어                 | TypeScript 6.0            |
| UI 라이브러리        | React 19                  |
| 빌드                 | Vite                      |
| UI 컴포넌트          | Ant Design · Ant Design X |
| 서버 상태 관리       | TanStack Query            |
| 클라이언트 상태 관리 | Zustand                   |
| 라우팅               | React Router DOM          |
| HTTP 클라이언트      | Axios                     |
| WYSIWYG 에디터       | TipTap                    |

## 프로젝트 구조

```
frontend/
├── src/
│　　 ├── main.tsx # 앱 진입점
│　　 ├── app/
│　　 │　　 ├── layouts/
│　　 │　　 ├── providers/
│　　 │　　 ├── router/ # 라우트, 접근 제어 및 로더
│　　 │　　 └── styles/
│　　 ├── features/
│　　 │　　 ├── auth/
│　　 │　　 ├── invitation/
│　　 │　　 ├── admin/
│　　 │　　 ├── pharmacy/
│　　 │　　 │　　 ├── api/        # API
│　　 │　　 │　　 ├── components/ # UI 컴포넌트
│　　 │　　 │　　 ├── hooks/      # 커스텀 훅
│　　 │　　 │　　 └── types/      # 요청·응답 타입
│　　 │　　 ├── wallet/
│　　 │　　 ├── product/
│　　 │　　 ├── inventory/
│　　 │　　 ├── order/
│　　 │　　 ├── return/
│　　 │　　 ├── notice/
│　　 │　　 ├── forecast/
│　　 │　　 └── chatbot/
│　　 ├── pages/
│　　 │　　 ├── auth/
│　　 │　　 ├── hq/     # 본사 사용자 페이지
│　　 │　　 ├── branch/ # 가맹점 사용자 페이지
│　　 │　　 ├── common/
│　　 │　　 └── error/
│　　 └── shared/
│　　 　　　 ├── api/ # Axios 클라이언트
│　　 　　　 ├── config/
│　　 　　　 └── lib/
├── Caddyfile # 정적 파일 서빙 및 API 리버스 프록시
└── Dockerfile
```

## 실행 방법

- Node.js 및 [pnpm](https://pnpm.io/)
- 실행 중인 Backend 서버
- 실행 중인 AI 서버

```bash
cd frontend
pnpm install
pnpm dev
```

개발 서버가 실행되면 [http://localhost:5173](http://localhost:5173)에서 확인할 수 있습니다.

> 개발 환경에서 `/api/*` 요청은 Backend 서버로, `/ai/*` 요청은 AI 서버로 자동 프록시됩니다.
