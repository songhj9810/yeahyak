FROM python:3.12-slim
WORKDIR /app

RUN pip install uv

COPY pyproject.toml uv.lock ./
RUN uv sync --no-dev && uv pip install gunicorn

COPY . .

EXPOSE 5000
CMD ["uv", "run", "gunicorn", "--workers", "2", "--bind", "0.0.0.0:5000", "--timeout", "120", "main:app"]
