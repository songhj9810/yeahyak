from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify, request

from app import register_error_handlers
from app.auth import jwt_required
from app.chatbot.faq import answer_faq
from app.chatbot.qna import answer_qna
from app.forecast.service import forecast
from app.summary.service import summarize
from app.utils import ApiResponse

app = Flask(__name__)
register_error_handlers(app)  # 전역 에러 핸들러 등록


@app.route("/ai/summary", methods=["POST"])
@jwt_required
def summary_api():
    if "file" not in request.files:
        return ApiResponse.error("파일이 업로드되지 않았습니다.", 400)

    file = request.files["file"]
    category = request.form.get("category")  # PRODUCT/REGULATION/EPIDEMIC

    if not category:
        return ApiResponse.error("카테고리가 선택되지 않았습니다.", 400)

    result = summarize(category, file)
    return ApiResponse.ok(result)


@app.route("/ai/chatbot/faq", methods=["POST"])
@jwt_required
def faq_api():
    data = request.get_json()
    question = data.get("question")
    session_id = data.get("session_id")
    if not question or not session_id:
        return ApiResponse.error("요청 데이터가 없습니다.", 400)
    return ApiResponse.ok({"answer": answer_faq(question, session_id)})


@app.route("/ai/chatbot/qna", methods=["POST"])
@jwt_required
def qna_api():
    data = request.get_json()
    question = data.get("question")
    session_id = data.get("session_id")
    if not question or not session_id:
        return ApiResponse.error("요청 데이터가 없습니다.", 400)
    return ApiResponse.ok({"answer": answer_qna(question, session_id)})


@app.route("/ai/forecast", methods=["POST"])
@jwt_required
def forecast_api():
    data = request.get_json()
    if not data:
        return jsonify({"error": "요청 데이터가 없습니다."}), 400

    result = forecast(data)
    return jsonify(result), 200


@app.route("/health")
def health():
    return "Flask app is healthy!"


if __name__ == "__main__":
    app.run(port=5000, debug=True)
