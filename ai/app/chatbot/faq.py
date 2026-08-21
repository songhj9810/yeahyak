import os

from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_redis import RedisChatMessageHistory
from langchain_text_splitters import RecursiveCharacterTextSplitter

CHROMA_PATH = "chroma_db"
FAQ_PATH = "data/faq.txt"

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

vectorstore = None
if os.path.exists(CHROMA_PATH):
    vectorstore = Chroma(embedding_function=embeddings, persist_directory=CHROMA_PATH)


def ingest_faq():
    """FAQ를 ChromaDB에 저장합니다."""
    global vectorstore
    loader = TextLoader(FAQ_PATH, encoding="utf-8")
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)
    vectorstore = Chroma.from_documents(
        documents=chunks, embedding=embeddings, persist_directory=CHROMA_PATH
    )


def _search_faq(query: str) -> str:
    """FAQ에서 유사한 질문을 검색합니다."""
    if vectorstore is None:
        return "참조할 FAQ 데이터가 없습니다."
    results = vectorstore.similarity_search(query, k=3)
    return "\n".join([doc.page_content for doc in results])


def _get_redis_history(session_id: str) -> RedisChatMessageHistory:
    """Redis를 사용하여 대화 세션의 메시지 히스토리를 관리합니다."""
    return RedisChatMessageHistory(
        session_id=session_id,
        redis_url=REDIS_URL,
        key_prefix="CHAT:",
        ttl=3600,
    )


_faq_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """당신은 친절한 고객센터 상담원입니다.
아래 FAQ 내용만을 바탕으로 답변하되, 관련 내용이 없으면 '해당 내용은 FAQ에 없습니다.'라고 답하세요.
답변은 존댓말로 공손하고 친절한 말투를 사용하세요.

FAQ 내용:
{context}""",
        ),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{question}"),
    ]
)

_faq_with_history = RunnableWithMessageHistory(
    _faq_prompt | llm | StrOutputParser(),
    get_session_history=_get_redis_history,
    input_messages_key="question",
    history_messages_key="history",
)


def answer_faq(question: str, session_id: str) -> str:
    """질문과 세션 ID를 받아 FAQ를 기반으로 답변을 생성합니다."""
    context = _search_faq(question)
    response = _faq_with_history.invoke(
        {"question": question, "context": context},
        config={"configurable": {"session_id": session_id}},
    )
    return response
