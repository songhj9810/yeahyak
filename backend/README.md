# Backend

## 기술 스택

| 분류         | 기술               |
| ------------ | ------------------ |
| 언어         | Java 21            |
| 프레임워크   | Spring Boot 3.5.14 |
| 빌드         | Gradle             |
| 데이터베이스 | MySQL 8.0          |
| 캐시         | Redis              |
| 메일         | Gmail SMTP         |
| 스토리지     | AWS S3             |
| 인증         | JWT                |

## 프로젝트 구조

```
backend/
├── src/main/
│　　 ├── java/com/yeahyak/backend/
│　　 │　　 ├── BackendApplication.java
│　　 │　　 ├── domain/
│　　 │　　 │　　 ├── auth/        # 인증·인가
│　　 │　　 │　　 ├── user/        # 사용자
│　　 │　　 │　　 ├── wallet/      # 전자지갑
│　　 │　　 │　　 ├── product/     # 상품
│　　 │　　 │　　 ├── stock/       # 재고
│　　 │　　 │　　 ├── order/       # 발주
│　　 │　　 │　　 ├── returnorder/ # 반품
│　　 │　　 │　　 ├── notice/      # 공지사항
│　　 │　　 │　　 └── forecast/    # 발주량 예측
│　　 │　　 └── global/
│　　 │　　 　　　 ├── config/
│　　 │　　 　　　 ├── exception/
│　　 │　　 　　　 ├── response/
│　　 │　　 　　　 ├── security/
│　　 │　　 　　　 └── service/
│　　 └── resources/
│　　 　　　 └── application.yaml
├── build.gradle
└── Dockerfile
```

## 실행 방법

- Java 21 이상
- 실행 중인 MySQL 데이터베이스
- 실행 중인 Redis

로컬 MySQL의 빈 데이터베이스를 직접 사용하는 경우에는 먼저 다음 명령어를 실행합니다.

```bash
mysql -h <DB_HOST> -u <DB_USERNAME> -p <DB_NAME> < db/init/schema.sql
```

```bash
cd backend
./gradlew bootRun
```

서버가 실행되면 [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)에서 Swagger UI를 확인할 수 있습니다.

## 환경변수 목록

| 변수명           | 설명                      |
| ---------------- | ------------------------- |
| `DB_HOST`        | MySQL 호스트              |
| `DB_NAME`        | MySQL 데이터베이스 이름   |
| `DB_USERNAME`    | MySQL 접속 계정 사용자명  |
| `DB_PASSWORD`    | MySQL 접속 계정 비밀번호  |
| `REDIS_HOST`     | Redis 호스트              |
| `REDIS_PORT`     | Redis 포트                |
| `MAIL_USERNAME`  | Gmail 계정                |
| `MAIL_PASSWORD`  | Gmail 앱 비밀번호         |
| `S3_ACCESS_KEY`  | AWS S3 Access Key         |
| `S3_SECRET_KEY`  | AWS S3 Secret Key         |
| `S3_BUCKET_NAME` | S3 버킷 이름              |
| `JWT_SECRET`     | JWT 시크릿 키 (ai와 공유) |
| `FLASK_URL`      | AI 서비스 기본 URL        |
| `FRONTEND_URL`   | CORS 허용 출처            |
| `COOKIE_SECURE`  | 인증 쿠키 Secure 속성     |
