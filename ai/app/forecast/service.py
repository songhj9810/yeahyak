from datetime import date

import numpy as np
import pandas as pd
from catboost import CatBoostRegressor

SAFETY_STOCK_RATE = 0.15
MIN_DAYS_FOR_ML = 180
MIN_PRODUCTS_FOR_ML = 10
MIN_ROWS_FOR_ML = 1000

FEATURE_COLS = [
    "month",
    "day_of_week",
    "week_of_year",
    "lag_7",
    "lag_14",
    "lag_30",
    "rolling_mean_7",
    "rolling_mean_14",
    "productId",
    "mainCategory",
    "subCategory",
]


def forecast(request: dict) -> list:
    products = request["products"]
    forecast_days = request["forecastDays"]
    today = request["today"]

    # ── 판매 기간 기준으로 WMA / CatBoost 그룹 분리 ───────────────
    ml_group, wma_group = [], []
    for product in products:
        if not product["salesHistory"]:
            df = pd.DataFrame(columns=["date", "qty"])
        else:
            df = pd.DataFrame(product["salesHistory"])
            df["date"] = pd.to_datetime(df["date"])
            df = df.sort_values("date").reset_index(drop=True)

        days = (df["date"].max() - df["date"].min()).days if not df.empty else 0

        if days >= MIN_DAYS_FOR_ML:
            ml_group.append((product, df))
        else:
            wma_group.append((product, df))

    # ── CatBoost 조건 확인 (상품 가짓수, 전체 행 수) ───────────────
    total_rows = sum(len(df) for _, df in ml_group)
    use_ml = len(ml_group) >= MIN_PRODUCTS_FOR_ML and total_rows >= MIN_ROWS_FOR_ML

    if use_ml:
        model = train_catboost(ml_group)

    results = []

    # ── WMA 예측 ─────────────────────────────────
    for product, df in wma_group:
        forecast_qty = wma(df, forecast_days)
        recommend_qty = max(
            0, round(forecast_qty * (1 + SAFETY_STOCK_RATE) - product["currentStock"])
        )
        results.append(
            {
                "productId": product["productId"],
                "forecastQty": round(forecast_qty),
                "currentStock": product["currentStock"],
                "recommendQty": recommend_qty,
            }
        )

    # ── CatBoost 예측 (조건 미충족 시 WMA로 fallback) ─────────────
    for product, df in ml_group:
        forecast_qty = (
            predict_catboost(model, product, df, forecast_days, today)
            if use_ml
            else wma(df, forecast_days)
        )
        recommend_qty = max(
            0, round(forecast_qty * (1 + SAFETY_STOCK_RATE) - product["currentStock"])
        )
        results.append(
            {
                "productId": product["productId"],
                "forecastQty": round(forecast_qty),
                "currentStock": product["currentStock"],
                "recommendQty": recommend_qty,
            }
        )

    return results


# ── WMA (6개월 미만) ────────────────────────────────────────────────
def wma(df: pd.DataFrame, forecast_days: int) -> float:
    """WMA(가중 이동평균)로 forecast_days 치 판매량을 예측합니다."""
    if df.empty:
        return 0

    # forecast_days 단위로 집계
    df = df.set_index("date").resample(f"{forecast_days}D").sum().reset_index()
    values = df["qty"].values
    if len(values) == 0:
        return 0

    # 최근 3구간 가중 이동평균
    recent = values[-3:]
    weights = list(range(1, len(recent) + 1))  # [1, 2, 3]

    return sum(q * w for q, w in zip(recent, weights)) / sum(weights)


# ── CatBoost (6개월 이상) ─────────────────────────────────────────────
def train_catboost(ml_group: list) -> CatBoostRegressor:
    """6개월 이상 상품 데이터로 CatBoost 모델을 학습합니다."""
    dfs = [_build_features(df, product) for product, df in ml_group]
    ml_df = pd.concat(dfs, ignore_index=True)

    # 학습/예측 분리
    X = ml_df[FEATURE_COLS].dropna()
    y = np.log1p(ml_df.loc[X.index, "qty"])  # 타겟 로그 변환

    model = CatBoostRegressor(
        iterations=200,
        learning_rate=0.05,
        depth=6,
        cat_features=["productId", "mainCategory", "subCategory"],
        verbose=False,
    )
    model.fit(X, y)

    return model


def predict_catboost(
    model: CatBoostRegressor,
    product: dict,
    df: pd.DataFrame,
    forecast_days: int,
    today: str,
) -> float:
    """CatBoost로 forecast_days 치 판매량을 예측합니다."""
    future_df = _build_future_features(df, product, forecast_days, today)
    prediction = model.predict(future_df[FEATURE_COLS])
    return max(0, float(np.expm1(prediction).sum()))  # 로그 역변환


def _build_features(df: pd.DataFrame, product: dict) -> pd.DataFrame:
    """판매 이력 데이터프레임에 학습용 피처를 추가합니다."""
    df = df.copy()
    df["month"] = df["date"].dt.month
    df["day_of_week"] = df["date"].dt.dayofweek
    df["week_of_year"] = df["date"].dt.isocalendar().week.astype(int)

    # lag 피처
    df["lag_7"] = df["qty"].shift(7)
    df["lag_14"] = df["qty"].shift(14)
    df["lag_30"] = df["qty"].shift(30)

    # rolling 피처
    df["rolling_mean_7"] = df["qty"].shift(1).rolling(7).mean()
    df["rolling_mean_14"] = df["qty"].shift(1).rolling(14).mean()

    # 상품 ID
    df["productId"] = str(product["productId"])

    # 카테고리
    df["mainCategory"] = product["mainCategory"]
    df["subCategory"] = product["subCategory"]

    return df


def _build_future_features(
    df: pd.DataFrame, product: dict, forecast_days: int, today: str
) -> pd.DataFrame:
    """미래 forecast_days 치 피처를 생성합니다."""
    future_dates = pd.date_range(
        start=pd.Timestamp(today) + pd.Timedelta(days=1),  # 오늘 기준
        periods=forecast_days,
    )
    future_df = pd.DataFrame({"date": future_dates, "qty": np.nan})
    full_df = pd.concat([df[["date", "qty"]], future_df], ignore_index=True)
    return _build_features(full_df, product).tail(forecast_days)
