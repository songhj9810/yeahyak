import os

import fitz  # PyMuPDF
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 공지사항 카테고리에 따른 프롬프트 정의
PROMPT_TEMPLATES = {
    "PRODUCT": "",
    "REGULATION": "",
    "EPIDEMIC": "",
}


def _extract_text_from_file(file) -> str:
    """업로드된 파일에서 텍스트를 추출합니다."""
    filename = file.filename

    if filename.endswith(".pdf"):
        text = ""
        with fitz.open(stream=file.read(), filetype="pdf") as doc:
            for page in doc:
                page_text = page.get_text()
                if isinstance(page_text, str):
                    text += page_text
        return text

    elif filename.endswith(".txt"):
        return file.read().decode("utf-8")

    else:
        raise ValueError(
            "지원하지 않는 파일 형식입니다. PDF 또는 TXT 파일을 업로드해주세요."
        )


def summarize(category, file):
    """카테고리에 맞는 프롬프트를 사용하여 요약문을 생성합니다."""
    system_prompt = PROMPT_TEMPLATES.get(category)
    if not system_prompt:
        raise ValueError("지원하지 않는 카테고리입니다.")

    content = _extract_text_from_file(file)
    if not content.strip():
        raise ValueError("파일에서 읽을 수 있는 텍스트가 없습니다.")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": content},
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content
