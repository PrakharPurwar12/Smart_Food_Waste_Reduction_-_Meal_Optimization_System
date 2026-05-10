from datetime import timedelta
from functools import lru_cache
from pathlib import Path
from tempfile import NamedTemporaryFile

import joblib
import numpy as np
import pandas as pd
from django.db.models import Count
from django.utils import timezone
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

from meals.models import MealBooking


BASE_DIR = Path(__file__).resolve().parent
BACKEND_DIR = BASE_DIR.parent
DATASET_PATH = BASE_DIR / "data" / "mess_attendance_dataset.csv"
MODEL_ROOT = BACKEND_DIR / "ml_models"

FEATURE_COLUMNS = [
    "day_of_week",
    "week_type",
    "is_weekend",
    "month",
    "week_of_year",
    "rolling_mean_4w",
    "rolling_std_4w",
    "lag_1w",
    "lag_2w",
]
VALID_DAYS = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
]
MEAL_TYPES = ["breakfast", "lunch", "dinner"]
MIN_TRAINING_POINTS = 20
MODEL_CLASS = RandomForestRegressor


@lru_cache(maxsize=1)
def load_attendance_dataset():
    if not DATASET_PATH.exists():
        return None
    try:
        return pd.read_csv(DATASET_PATH)
    except Exception:
        return None


def _normalize_day(day):
    day_text = str(day).strip().title()
    if day_text not in VALID_DAYS:
        raise ValueError("day must be one of Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.")
    return day_text


def _normalize_meal_type(meal_type):
    meal_text = str(meal_type or "lunch").strip().lower()
    if meal_text not in MEAL_TYPES:
        raise ValueError("meal_type must be breakfast, lunch, or dinner.")
    return meal_text


def _day_index(day):
    return VALID_DAYS.index(_normalize_day(day))


def _target_date_for_day(day):
    today = timezone.localdate()
    target_index = _day_index(day)
    days_ahead = (target_index - today.weekday() + 7) % 7
    if days_ahead == 0:
        days_ahead = 7
    return today + timedelta(days=days_ahead)


def _week_type_for_date(target_date):
    return "A" if target_date.isocalendar()[1] % 2 != 0 else "B"


def _week_type_value(target_date):
    return 0 if _week_type_for_date(target_date) == "A" else 1


def _model_path(college_id, meal_type):
    return MODEL_ROOT / str(college_id) / f"{meal_type}.pkl"


def _booking_history(college, meal_type):
    if not college:
        return pd.DataFrame(columns=["date", "actual_students"])

    rows = (
        MealBooking.objects
        .filter(user__college=college, meal_type=meal_type, status="booked")
        .values("date")
        .annotate(actual_students=Count("id"))
        .order_by("date")
    )
    frame = pd.DataFrame(list(rows))
    if frame.empty:
        return pd.DataFrame(columns=["date", "actual_students"])

    frame["date"] = pd.to_datetime(frame["date"])
    frame["actual_students"] = frame["actual_students"].astype(float)
    return frame.sort_values("date").reset_index(drop=True)


def _add_time_features(frame):
    frame = frame.copy().sort_values("date").reset_index(drop=True)
    iso = frame["date"].dt.isocalendar()
    frame["day_of_week"] = frame["date"].dt.weekday
    frame["week_type"] = iso.week.astype(int).apply(lambda week: 0 if week % 2 != 0 else 1)
    frame["is_weekend"] = frame["day_of_week"].isin([5, 6]).astype(int)
    frame["month"] = frame["date"].dt.month
    frame["week_of_year"] = iso.week.astype(int)

    overall_mean = float(frame["actual_students"].mean()) if not frame.empty else 0
    count_by_date = {
        row.date.date(): float(row.actual_students)
        for row in frame.itertuples(index=False)
    }
    prior_counts = []
    rolling_means = []
    rolling_stds = []
    lag_1w = []
    lag_2w = []

    for row in frame.itertuples(index=False):
        current_date = row.date.date()
        weekly_values = [
            count_by_date[current_date - timedelta(days=7 * offset)]
            for offset in range(1, 5)
            if current_date - timedelta(days=7 * offset) in count_by_date
        ]
        fallback = float(np.mean(prior_counts)) if prior_counts else overall_mean
        lag_1w.append(count_by_date.get(current_date - timedelta(days=7), fallback))
        lag_2w.append(count_by_date.get(current_date - timedelta(days=14), fallback))
        rolling_means.append(float(np.mean(weekly_values)) if weekly_values else fallback)
        rolling_stds.append(float(np.std(weekly_values)) if len(weekly_values) >= 2 else 0)
        prior_counts.append(float(row.actual_students))

    frame["rolling_mean_4w"] = rolling_means
    frame["rolling_std_4w"] = rolling_stds
    frame["lag_1w"] = lag_1w
    frame["lag_2w"] = lag_2w
    return frame


def _target_features(target_date, history):
    history = history.copy().sort_values("date").reset_index(drop=True)
    counts = history["actual_students"] if not history.empty else pd.Series(dtype=float)
    fallback = float(counts.mean()) if len(counts) else _csv_average_for_target(target_date, None)
    count_by_date = {
        row.date.date(): float(row.actual_students)
        for row in history.itertuples(index=False)
    }
    weekly_values = [
        count_by_date[target_date - timedelta(days=7 * offset)]
        for offset in range(1, 5)
        if target_date - timedelta(days=7 * offset) in count_by_date
    ]
    lag_1 = count_by_date.get(target_date - timedelta(days=7), fallback)
    lag_2 = count_by_date.get(target_date - timedelta(days=14), fallback)

    row = {
        "day_of_week": target_date.weekday(),
        "week_type": _week_type_value(target_date),
        "is_weekend": 1 if target_date.weekday() >= 5 else 0,
        "month": target_date.month,
        "week_of_year": target_date.isocalendar()[1],
        "rolling_mean_4w": float(np.mean(weekly_values)) if weekly_values else lag_1,
        "rolling_std_4w": float(np.std(weekly_values)) if len(weekly_values) >= 2 else 0,
        "lag_1w": lag_1,
        "lag_2w": lag_2,
    }
    return pd.DataFrame([row], columns=FEATURE_COLUMNS)


def _csv_average_for_target(target_date, meal_type):
    dataset = load_attendance_dataset()
    if dataset is None or dataset.empty:
        return 200

    rows = dataset[dataset["day"] == VALID_DAYS[target_date.weekday()]]
    if meal_type:
        meal_rows = rows[rows["meal_type"] == meal_type]
        if not meal_rows.empty:
            rows = meal_rows

    if rows.empty:
        return int(round(dataset["actual_students"].mean()))
    return int(round(rows["actual_students"].mean()))


def _weighted_average(values):
    values = [float(value) for value in values if value is not None]
    if not values:
        return None

    weights = [0.35, 0.25, 0.15, 0.10, 0.07, 0.04, 0.03, 0.01]
    values = list(reversed(values))[:len(weights)]
    active_weights = weights[:len(values)]
    weight_total = sum(active_weights)
    return sum(value * weight for value, weight in zip(values, active_weights)) / weight_total


def _fallback_prediction(day, meal_type, college=None):
    target_date = _target_date_for_day(day)
    history = _booking_history(college, meal_type) if college else pd.DataFrame()
    if not history.empty:
        same_day_history = history[history["date"].dt.weekday == target_date.weekday()]
        values = same_day_history["actual_students"].tail(8).tolist()
        weighted = _weighted_average(values)
        if weighted is not None:
            return int(round(max(10, min(2000, weighted))))

    return int(round(_csv_average_for_target(target_date, meal_type)))


def _train_random_forest(college, meal_type):
    history = _booking_history(college, meal_type)
    if len(history) < MIN_TRAINING_POINTS:
        return None

    training_frame = _add_time_features(history)
    model = MODEL_CLASS(
        n_estimators=300,
        random_state=42,
        min_samples_leaf=2,
        bootstrap=True,
        n_jobs=-1,
    )
    model.fit(training_frame[FEATURE_COLUMNS], training_frame["actual_students"])
    fitted_values = model.predict(training_frame[FEATURE_COLUMNS])
    mae = float(mean_absolute_error(training_frame["actual_students"], fitted_values))
    r2 = float(r2_score(training_frame["actual_students"], fitted_values))
    model_version = timezone.now().strftime("%Y%m%d%H%M%S")

    artifact = {
        "model": model,
        "model_type": "RandomForestRegressor",
        "college_id": college.id,
        "meal_type": meal_type,
        "feature_columns": FEATURE_COLUMNS,
        "training_points": int(len(training_frame)),
        "mae": mae,
        "r2_score": r2,
        "model_version": model_version,
        "trained_at": timezone.now().isoformat(),
    }
    path = _model_path(college.id, meal_type)
    path.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile(
        prefix=f".{meal_type}-",
        suffix=".tmp",
        dir=path.parent,
        delete=False,
    ) as temp_file:
        temp_path = Path(temp_file.name)

    try:
        joblib.dump(artifact, temp_path)
        temp_path.replace(path)
    finally:
        if temp_path.exists():
            temp_path.unlink()
    _load_model_artifact.cache_clear()
    return artifact


@lru_cache(maxsize=128)
def _load_model_artifact(college_id, meal_type):
    path = _model_path(college_id, meal_type)
    if not path.exists():
        return None
    try:
        return joblib.load(path)
    except Exception:
        return None


def _get_or_train_artifact(college, meal_type):
    if not college:
        return None

    artifact = _load_model_artifact(college.id, meal_type)
    if artifact is not None:
        return artifact
    return _train_random_forest(college, meal_type)


def _tree_interval(model, features):
    feature_values = features.to_numpy()
    tree_predictions = np.array([
        tree.predict(feature_values)[0]
        for tree in model.estimators_
    ])
    lower = max(10, float(np.percentile(tree_predictions, 10)))
    upper = min(2000, float(np.percentile(tree_predictions, 90)))
    return {
        "lower": int(round(lower)),
        "upper": int(round(upper)),
        "std": round(float(np.std(tree_predictions)), 2),
    }


def _confidence_from_interval(prediction, interval, training_points):
    width = interval["upper"] - interval["lower"]
    ratio = width / max(prediction, 1)
    if training_points >= 40 and ratio <= 0.20:
        return "High"
    if training_points >= 20 and ratio <= 0.35:
        return "Medium"
    return "Low"


def _predict_for_college(day, college, meal_type):
    day = _normalize_day(day)
    meal_type = _normalize_meal_type(meal_type)
    target_date = _target_date_for_day(day)
    history = _booking_history(college, meal_type)

    if len(history) < MIN_TRAINING_POINTS:
        prediction = _fallback_prediction(day, meal_type, college)
        spread = max(10, int(round(prediction * 0.12)))
        return {
            "prediction": prediction,
            "interval": {
                "lower": max(10, prediction - spread),
                "upper": min(2000, prediction + spread),
                "std": round(spread / 2, 2),
            },
            "confidence": "Low",
            "model_type": "WeightedAverage",
            "data_source": "weighted_average",
            "data_points": int(len(history)),
            "target_date": target_date,
        }

    artifact = _get_or_train_artifact(college, meal_type)
    if artifact is None:
        prediction = _fallback_prediction(day, meal_type, college)
        spread = max(10, int(round(prediction * 0.12)))
        return {
            "prediction": prediction,
            "interval": {
                "lower": max(10, prediction - spread),
                "upper": min(2000, prediction + spread),
                "std": round(spread / 2, 2),
            },
            "confidence": "Low",
            "model_type": "WeightedAverage",
            "data_source": "weighted_average",
            "data_points": int(len(history)),
            "target_date": target_date,
        }

    features = _target_features(target_date, history)
    model = artifact["model"]
    prediction = int(round(max(10, min(2000, float(model.predict(features)[0])))))
    interval = _tree_interval(model, features)
    confidence = _confidence_from_interval(
        prediction,
        interval,
        artifact.get("training_points", len(history)),
    )

    return {
        "prediction": prediction,
        "interval": interval,
        "confidence": confidence,
        "model_type": artifact.get("model_type", "RandomForestRegressor"),
        "data_source": "random_forest",
        "data_points": int(artifact.get("training_points", len(history))),
        "target_date": target_date,
    }


def predict_students(
    day,
    meal_type="Lunch",
    popularity_score=8.0,
    is_weekend=0,
    is_exam=0,
    is_festival=0,
    waste_kg=3.0,
):
    meal_type = _normalize_meal_type(meal_type)
    return _fallback_prediction(day, meal_type)


def predict_with_confidence(
    day,
    college=None,
    meal_type="Lunch",
    popularity_score=8.0,
    is_weekend=0,
    is_exam=0,
    is_festival=0,
    waste_kg=3.0,
):
    day = _normalize_day(day)
    meal_type = _normalize_meal_type(meal_type)
    result = _predict_for_college(day, college, meal_type)
    prediction = result["prediction"]
    target_date = result["target_date"]

    return {
        "prediction": prediction,
        "predicted_attendance": prediction,
        "confidence": result["confidence"],
        "confidence_label": result["confidence"],
        "prediction_interval": result["interval"],
        "interval_lower": result["interval"]["lower"],
        "interval_upper": result["interval"]["upper"],
        "std_deviation": result["interval"]["std"],
        "model_type": result["model_type"],
        "data_source": result["data_source"],
        "data_points": result["data_points"],
        "features": {
            "day": day,
            "meal_type": meal_type,
            "target_date": target_date.isoformat(),
            "day_of_week": target_date.weekday(),
            "week_type": _week_type_for_date(target_date),
            "is_weekend": 1 if target_date.weekday() >= 5 else 0,
            "month": target_date.month,
            "week_of_year": target_date.isocalendar()[1],
        },
        "per_meal": {},
    }


def get_model_info():
    model_files = list(MODEL_ROOT.glob("*/*.pkl")) if MODEL_ROOT.exists() else []
    dataset = load_attendance_dataset()

    return {
        "model_exists": bool(model_files),
        "model_type": "RandomForestRegressor",
        "training_dataset_rows": 0 if dataset is None else len(dataset),
        "available_features": FEATURE_COLUMNS,
        "minimum_training_points": MIN_TRAINING_POINTS,
        "model_root": str(MODEL_ROOT),
        "saved_models": [str(path) for path in model_files],
    }
