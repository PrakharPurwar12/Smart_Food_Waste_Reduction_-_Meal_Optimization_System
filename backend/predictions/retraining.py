import logging

from django.db import transaction

from users.models import College
from .ml_model import MEAL_TYPES, MIN_TRAINING_POINTS, _booking_history, _model_path, _train_random_forest
from .models import ModelTrainingLog, Prediction


logger = logging.getLogger(__name__)


def retrain_college_models(college):
    results = {"trained": [], "skipped": [], "failed": []}

    for meal_type in MEAL_TYPES:
        history = _booking_history(college, meal_type)
        data_points = len(history)
        if data_points < MIN_TRAINING_POINTS:
            results["skipped"].append({
                "college_id": college.id,
                "meal_type": meal_type,
                "data_points": data_points,
                "reason": "insufficient_data",
            })
            continue

        try:
            artifact = _train_random_forest(college, meal_type)
            with transaction.atomic():
                log = ModelTrainingLog.objects.create(
                    college=college,
                    meal_type=meal_type,
                    data_points=artifact["training_points"],
                    mae=artifact["mae"],
                    r2_score=artifact["r2_score"],
                    model_version=artifact["model_version"],
                )
            results["trained"].append({
                "college_id": college.id,
                "meal_type": meal_type,
                "data_points": artifact["training_points"],
                "mae": round(artifact["mae"], 4),
                "r2_score": round(artifact["r2_score"], 4),
                "model_version": artifact["model_version"],
                "model_path": str(_model_path(college.id, meal_type)),
                "log_id": log.id,
            })
        except Exception as exc:
            logger.exception(
                "Model retraining failed for college=%s meal_type=%s; keeping previous model.",
                college.id,
                meal_type,
            )
            results["failed"].append({
                "college_id": college.id,
                "meal_type": meal_type,
                "data_points": data_points,
                "error": str(exc),
            })

    return results


def retrain_all_models():
    summary = {"trained": [], "skipped": [], "failed": []}

    for college in College.objects.all().order_by("id"):
        result = retrain_college_models(college)
        for key in summary:
            summary[key].extend(result[key])

    return summary


def retrain_if_actual_threshold_crossed(college):
    actual_count = Prediction.objects.filter(
        college=college,
        actual_count__isnull=False,
    ).count()

    if actual_count and actual_count % 10 == 0:
        logger.info(
            "Actual-record threshold reached for college=%s count=%s; retraining models.",
            college.id,
            actual_count,
        )
        result = retrain_college_models(college)
        result["actual_records"] = actual_count
        result["triggered"] = True
        return result

    return {
        "trained": [],
        "skipped": [],
        "failed": [],
        "actual_records": actual_count,
        "triggered": False,
    }
