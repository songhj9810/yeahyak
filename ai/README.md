# AI

## 기술 스택

| 분류       | 기술                         |
| ---------- | ---------------------------- |
| 언어       | Python 3.12                  |
| 프레임워크 | Flask                        |
| LLM        | OpenAI API                   |
| RAG        | LangChain · Chroma · Redis 8 |
| 인증       | PyJWT                        |

## 프로젝트 구조

```
ai/
├── main.py
├── app/
│　　 ├── __init__.py # 에러 핸들러 등록
│　　 ├── auth.py     # JWT 검증 미들웨어
│　　 ├── utils.py
│　　 ├── chatbot/
│　　 │　　 ├── faq.py     # FAQ 챗봇
│　　 │　　 └── qna.py     # Q&A 챗봇
│　　 └── forecast/
│　　 　　　 └── service.py # 발주량 예측
├── data/
│　　 ├── faq.txt    # FAQ 지식베이스
│　　 └── chroma_db/ # 벡터 DB
├── pyproject.toml
└── Dockerfile
```

## API 엔드포인트

| Method | Path              | 설명        |
| ------ | ----------------- | ----------- |
| `GET`  | `/health`         | 헬스 체크   |
| `POST` | `/ai/chatbot/faq` | FAQ 챗봇    |
| `POST` | `/ai/chatbot/qna` | Q&A 챗봇    |
| `POST` | `/ai/forecast`    | 발주량 예측 |

## 실행 방법

- Python 3.12 이상 및 [uv](https://docs.astral.sh/uv/)
- 실행 중인 Redis

```bash
cd ai
cp .env.example .env  # 환경변수 설정
uv sync
uv run flask --app main run --debug
```

서버는 [http://localhost:5000](http://localhost:5000)에서 실행됩니다.

## 환경변수 목록

| 변수명                | 설명                           |
| --------------------- | ------------------------------ |
| `JWT_SECRET`          | JWT 시크릿 키 (backend와 공유) |
| `OPENAI_API_KEY`      | OpenAI API 키                  |
| `PUBLIC_DATA_API_KEY` | 공공데이터포털 API 키          |
| `REDIS_URL`           | Redis 연결 URL                 |
