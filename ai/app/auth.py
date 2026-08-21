import os
from functools import wraps

import jwt
from flask import g, request

from app.utils import ApiResponse


def jwt_required(f):
    """JWT 토큰이 필요한 엔드포인트에 적용하는 데코레이터입니다."""

    @wraps(f)
    def decorated(*args, **kwargs):
        # Header에서 'Authorization: Bearer <token>' 추출
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return ApiResponse.error("토큰이 없습니다.", 401)

        token = auth_header.split(" ")[1]

        try:
            # JWT 토큰 검증 및 디코딩
            payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS512"])

            # Flask의 g 객체에 사용자 정보 저장 (단일 요청 동안 유지)
            sub = payload.get("sub")
            g.user_id = int(sub) if sub is not None else None
            g.email = payload.get("email")
            g.role = payload.get("role")
        except jwt.ExpiredSignatureError:
            return ApiResponse.error("토큰이 만료되었습니다.", 401)
        except jwt.InvalidTokenError:
            return ApiResponse.error("유효하지 않은 토큰입니다.", 401)

        return f(*args, **kwargs)

    return decorated
