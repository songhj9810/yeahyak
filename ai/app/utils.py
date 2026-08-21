from flask import jsonify


class ApiResponse:
    """API 응답을 표준화하는 클래스입니다."""

    @staticmethod
    def ok(data=None):
        """성공 응답을 반환합니다."""
        response = {
            "success": True,
            "data": data,
            "message": None,
        }
        return jsonify(response), 200

    @staticmethod
    def error(message: str, status_code: int):
        """오류 응답을 반환합니다."""
        response = {
            "success": False,
            "data": None,
            "message": message,
        }
        return jsonify(response), status_code
