import os
import sys
from pathlib import Path


def _setup_django():
    backend_dir = Path(__file__).resolve().parents[1]
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

    import django
    django.setup()


def train_all_models():
    _setup_django()

    from users.models import College
    from predictions.ml_model import (
        MEAL_TYPES,
        MIN_TRAINING_POINTS,
        _booking_history,
        _model_path,
        _train_random_forest,
    )

    trained = []
    skipped = []

    for college in College.objects.all().order_by("id"):
        for meal_type in MEAL_TYPES:
            history = _booking_history(college, meal_type)
            if len(history) < MIN_TRAINING_POINTS:
                skipped.append((college.id, meal_type, len(history)))
                continue

            artifact = _train_random_forest(college, meal_type)
            trained.append((college.id, meal_type, artifact["training_points"], _model_path(college.id, meal_type)))

    print("Smart Mess RandomForest Training")
    print(f"Minimum points per model: {MIN_TRAINING_POINTS}")
    print(f"Models trained: {len(trained)}")
    for college_id, meal_type, points, path in trained:
        print(f"  college={college_id} meal={meal_type} points={points} path={path}")

    print(f"Models skipped: {len(skipped)}")
    for college_id, meal_type, points in skipped:
        print(f"  college={college_id} meal={meal_type} points={points}")

    return {"trained": trained, "skipped": skipped}


if __name__ == "__main__":
    train_all_models()
