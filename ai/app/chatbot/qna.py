import os

import requests
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain_redis import RedisChatMessageHistory
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

API_KEY = os.getenv("PUBLIC_DATA_API_KEY")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")


@tool
def search_easy_drug_info(product_name: str):
    """의약품의 효능, 사용법, 주의사항, 상호작용, 부작용, 보관법을 조회합니다.
    식품의약품안전처 「의약품개요정보 (e약은요)」 OpenAPI를 사용합니다."""
    url = "http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList"
    params = {
        "serviceKey": API_KEY,
        "pageNo": 1,
        "numOfRows": 3,
        "itemName": product_name,
        "type": "json",
    }
    try:
        response = requests.get(url=url, params=params).json()
        return {
            "source": "식품의약품안전처 「의약품개요정보 (e약은요)」 OpenAPI",
            "data": response,
        }
    except Exception as e:
        return f"데이터 조회 중 오류 발생: {str(e)}"


@tool
def search_dur_ingredient(ingredient_name: str):
    """DUR 성분 정보의 병용금기 정보를 조회합니다.
    식품의약품안전처 「의약품안전사용서비스(DUR) 성분정보」 OpenAPI를 사용합니다."""
    url = "http://apis.data.go.kr/1471000/DURIrdntInfoService03/getUsjntTabooInfoList02"
    params = {
        "serviceKey": API_KEY,
        "pageNo": 1,
        "numOfRows": 3,
        "ingrKorName": ingredient_name,
        "type": "json",
    }
    try:
        response = requests.get(url=url, params=params).json()
        return {
            "source": "식품의약품안전처 「의약품안전사용서비스(DUR) 성분정보」 OpenAPI",
            "data": response,
        }
    except Exception as e:
        return f"데이터 조회 중 오류 발생: {str(e)}"


@tool
def search_dur_product(product_name: str):
    """DUR 품목 정보의 병용금기 정보를 조회합니다.
    식품의약품안전처 「의약품안전사용서비스(DUR) 품목정보」 OpenAPI를 사용합니다."""
    url = (
        "http://apis.data.go.kr/1471000/DURPrdlstInfoService03/getUsjntTabooInfoList03"
    )
    params = {
        "serviceKey": API_KEY,
        "pageNo": 1,
        "numOfRows": 3,
        "itemName": product_name,
        "type": "json",
    }
    try:
        response = requests.get(url=url, params=params).json()
        return {
            "source": "식품의약품안전처 「의약품안전사용서비스(DUR) 품목정보」 OpenAPI",
            "data": response,
        }
    except Exception as e:
        return f"데이터 조회 중 오류 발생: {str(e)}"


TOOLS = [search_easy_drug_info, search_dur_ingredient, search_dur_product]
llm_with_tools = llm.bind_tools(TOOLS)


def _get_redis_history(session_id: str) -> RedisChatMessageHistory:
    """Redis를 사용하여 대화 세션의 메시지 히스토리를 관리합니다."""
    return RedisChatMessageHistory(
        session_id=session_id,
        redis_url=REDIS_URL,
        key_prefix="CHAT:",
        ttl=3600,
    )


def call_model(state: MessagesState):
    """LLM을 호출하여 답변을 생성합니다."""
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}


def should_continue(state: MessagesState):
    """도구 호출 여부를 결정합니다."""
    last_message = state["messages"][-1]
    if isinstance(last_message, AIMessage) and last_message.tool_calls:
        return "tools"
    return END


graph = StateGraph(MessagesState)
graph.add_node("agent", call_model)
graph.add_node("tools", ToolNode(TOOLS))
graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", should_continue)
graph.add_edge("tools", "agent")

app = graph.compile()


def answer_qna(question: str, session_id: str) -> str:
    """질문과 세션 ID를 받아 OpenAPI를 기반으로 답변을 생성합니다."""
    history = _get_redis_history(session_id)
    history_messages = history.messages

    messages: list[BaseMessage] = (
        [
            SystemMessage(
                content="""당신은 약사의 업무 수행을 돕는 의약품 정보 AI 어시스턴트입니다.
주어진 도구로 정보를 조회한 후, 그 결과를 바탕으로 답변을 생성하세요.
필요 시 사용자에게 추가 정보를 요청하세요.
답변은 존댓말로 공손하고 친절한 말투를 사용하세요.
답변의 마지막에는 출처와 '이 답변은 참고용이며, 최종 판단은 환자의 상태와 약사님의 전문 지식을 바탕으로 내려주시기 바랍니다.'라는 문구를 덧붙이세요.
"""
            )
        ]
        + history_messages
        + [HumanMessage(content=question)]
    )

    result = app.invoke({"messages": messages})  # type: ignore

    response = result["messages"][-1].content

    history.add_user_message(question)
    history.add_ai_message(response)

    return response
