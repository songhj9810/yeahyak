# YeahYak

약국 프랜차이즈 본사와 가맹점 간 발주·재고·정산·운영 흐름을 통합 관리하는 B2B SaaS 플랫폼입니다.

## 주요 기능

**ADMIN (본사)**

- 본사/가맹점 회원가입 초대
- 가맹점별 정보 조회 및 전자지갑 관리
- 상품 등록·수정·삭제 (S3 이미지 업로드)
- 본사 재고 입출고 및 현황 조회
- 발주·반품 상태 관리 워크플로우
- 공지사항 작성·수정·삭제 (S3 첨부파일 업로드)

**PHARMACY (가맹점)**

- 상품 카탈로그 조회 및 카트 기반 발주
- 반품 가능 수량 실시간 계산 및 반품 요청
- 판매 데이터 기반 발주량 예측
- 재고 현황 및 전자지갑 거래 내역
- FAQ·Q&A 챗봇

## 서비스 구성

| 서비스                 | 기술 스택                                  | 포트       | 설명                    |
| ---------------------- | ------------------------------------------ | ---------- | ----------------------- |
| [backend](./backend)   | Java 21 · Spring Boot 3.5.14               | `8080`     | REST API 서버           |
| [ai](./ai)             | Python 3.12 · Flask                        | `5000`     | 챗봇 및 예측 AI 서비스  |
| [frontend](./frontend) | TypeScript 6.0 · React 19 · Vite 8 · Caddy | `80`/`443` | 역할 기반 웹 클라이언트 |
| db                     | MySQL 8.0                                  | `3306`     | 관계형 데이터베이스     |
| redis                  | Redis 8                                    | `6379`     | 캐시 및 세션 스토어     |

## 실행 방법

### Docker

```bash
cp .env.example .env  # 환경변수 설정
docker-compose up -d
# 중지
docker-compose down
# 중지 + 데이터 삭제
docker-compose down -v
```

> 서비스 기동 순서: `db` + `redis` → `backend` + `ai` → `caddy`
> MySQL 데이터 볼륨 최초 생성 시 [db/init/schema.sql](./db/init/schema.sql)이 자동으로 적용됩니다.
> backend의 `/actuator/health`, ai의 `/health` 헬스체크를 통과한 뒤 caddy가 시작됩니다.

### 로컬 개발 환경

각 서비스를 개별적으로 실행하는 방법은 각 폴더의 README를 참고하세요.

- [backend/README.md](./backend/README.md)
- [ai/README.md](./ai/README.md)
- [frontend/README.md](./frontend/README.md)

## 환경변수 목록

루트 `.env` 파일은 `docker-compose.yml`에서 각 서비스의 실행 환경을 설정하는 데 사용됩니다.

| 변수명                | 사용 서비스  | 설명                                                       |
| --------------------- | ------------ | ---------------------------------------------------------- |
| `DB_ROOT_PASSWORD`    | db           | MySQL root 비밀번호                                        |
| `DB_NAME`             | db · backend | MySQL 데이터베이스 이름                                    |
| `DB_USERNAME`         | db · backend | MySQL 접속 계정 사용자명                                   |
| `DB_PASSWORD`         | db · backend | MySQL 접속 계정 비밀번호                                   |
| `MAIL_USERNAME`       | backend      | Gmail 계정                                                 |
| `MAIL_PASSWORD`       | backend      | Gmail 앱 비밀번호                                          |
| `S3_ACCESS_KEY`       | backend      | AWS S3 Access Key                                          |
| `S3_SECRET_KEY`       | backend      | AWS S3 Secret Key                                          |
| `S3_BUCKET_NAME`      | backend      | S3 버킷 이름                                               |
| `JWT_SECRET`          | backend · ai | JWT 시크릿 키                                              |
| `DOMAIN`              | caddy        | HTTPS 인증서를 발급받을 도메인 (예: `yeahyak.duckdns.org`) |
| `FRONTEND_URL`        | backend      | CORS 허용 출처 (`https://<DOMAIN>`)                        |
| `COOKIE_SECURE`       | backend      | 인증 쿠키 Secure 속성                                      |
| `OPENAI_API_KEY`      | ai           | OpenAI API 키                                              |
| `PUBLIC_DATA_API_KEY` | ai           | 공공데이터포털 API 키                                      |
