from flask import Flask
from werkzeug.exceptions import HTTPException

from app.utils import ApiResponse


def register_error_handlers(app: Flask):

    @app.errorhandler(400)
    def bad_request(e):
        return ApiResponse.error("BAD_REQUEST", 400)

    @app.errorhandler(401)
    def unauthorized(e):
        return ApiResponse.error("UNAUTHORIZED", 401)

    @app.errorhandler(403)
    def forbidden(e):
        return ApiResponse.error("FORBIDDEN", 403)

    @app.errorhandler(404)
    def not_found(e):
        return ApiResponse.error("NOT_FOUND", 404)

    @app.errorhandler(ValueError)
    def handle_value_error(e):
        return ApiResponse.error(str(e), 400)

    @app.errorhandler(Exception)
    def handle_exception(e):
        if isinstance(e, HTTPException):
            desc = e.description or "HTTP_ERROR"
            code = e.code or 500
            return ApiResponse.error(desc, code)
        app.logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
        return ApiResponse.error("INTERNAL_SERVER_ERROR", 500)
