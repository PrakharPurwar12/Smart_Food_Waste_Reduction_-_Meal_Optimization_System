from datetime import datetime, timedelta
from statistics import mean

from django.db import transaction
from django.utils.timezone import now

from rest_framework import viewsets, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.permissions import IsKitchen
from .models import ModelTrainingLog, Prediction
from .retraining import retrain_if_actual_threshold_crossed
from .serializers import ModelTrainingLogSerializer, PredictionSerializer
from .ml_model import get_model_info, load_attendance_dataset, predict_with_confidence
from .optimizer import calculate_food


VALID_DAYS = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
]
VALID_RANGES = {7, 30, 90}


class PredictionViewSet(viewsets.ModelViewSet):
    serializer_class = PredictionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not user.college_id:
            return Prediction.objects.none()
        return Prediction.objects.filter(college=user.college).order_by('-date')

    def list(self, request, *args, **kwargs):
        college_error = self._require_college(request)
        if college_error:
            return college_error

        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated = self.get_paginated_response(serializer.data)
            paginated.data = {"success": True, "data": paginated.data}
            return paginated

        serializer = self.get_serializer(queryset, many=True)
        return Response({"success": True, "data": serializer.data})

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response({"success": True, "data": serializer.data})

    def perform_create(self, serializer):
        if not self.request.user.college_id:
            raise PermissionDenied("Your account is not linked to a college.")
        serializer.save(college=self.request.user.college)

    def _normalize_day(self, day):
        day = str(day or "").strip().title()
        return day if day in VALID_DAYS else None

    def _require_college(self, request):
        if not request.user.college_id:
            return Response(
                {"success": False, "error": "Your account is not linked to a college."},
                status=status.HTTP_403_FORBIDDEN
            )
        return None

    def _get_next_date_for_day(self, target_day_index):
        today = now().date()
        current_weekday = today.weekday()
        days_ahead = (target_day_index - current_weekday + 7) % 7
        if days_ahead == 0:
            days_ahead = 7
        return today + timedelta(days=days_ahead)

    def _to_bool_int(self, value, default=0):
        if value is None:
            return default
        if isinstance(value, bool):
            return int(value)
        if isinstance(value, (int, float)):
            return 1 if value else 0
        return 1 if str(value).strip().lower() in {"1", "true", "yes", "y"} else 0

    def _to_float(self, value, default):
        if value is None or value == "":
            return default
        return float(value)

    def _prediction_accuracy(self, predicted, actual):
        if actual in (None, 0) or predicted is None:
            return 0
        error_pct = abs(actual - predicted) / max(actual, 1)
        return max(0, round((1 - error_pct) * 100, 1))

    def _db_analytics(self, queryset, range_days):
        records = list(queryset.filter(actual_count__isnull=False).order_by("date"))
        if not records:
            return None

        trend = []
        waste_by_day = {day: 0 for day in VALID_DAYS}
        errors = []
        accurate = 0

        for record in records:
            error = abs(record.actual_count - record.predicted_count)
            errors.append(error)
            accuracy_pct = self._prediction_accuracy(record.predicted_count, record.actual_count)
            if accuracy_pct >= 90:
                accurate += 1
            waste_kg = record.waste_estimate
            if waste_kg is None:
                waste_kg = max(0, record.predicted_count - record.actual_count) * 0.18

            trend.append({
                "date": record.date.isoformat(),
                "predicted": record.predicted_count,
                "actual": record.actual_count,
                "error": error,
                "accuracy_pct": accuracy_pct,
            })
            waste_by_day[record.day] += waste_kg

        total = len(records)
        total_waste = sum(waste_by_day.values())
        return {
            "range_days": range_days,
            "source": "database",
            "summary": {
                "total_predictions": total,
                "average_error": round(mean(errors), 2) if errors else 0,
                "accuracy_pct": round((accurate / total) * 100, 1) if total else 0,
                "total_waste_saved_kg": round(total_waste, 2),
            },
            "accuracy_trend": trend,
            "waste_by_day": [
                {"day": day, "waste_kg": round(waste_by_day[day], 2)}
                for day in VALID_DAYS
            ],
            "meal_accuracy": self._csv_meal_accuracy(range_days),
        }

    def _csv_rows_for_range(self, range_days):
        dataset = load_attendance_dataset()
        if dataset is None or dataset.empty:
            return None

        frame = dataset.copy()
        frame["date"] = frame["date"].astype("datetime64[ns]")
        max_date = frame["date"].max()
        start_date = max_date - timedelta(days=range_days - 1)
        return frame[frame["date"] >= start_date].copy()

    def _csv_meal_accuracy(self, range_days):
        rows = self._csv_rows_for_range(range_days)
        if rows is None or rows.empty:
            return [
                {"meal_type": meal, "accuracy_pct": 0, "average_error": 0, "total_predictions": 0}
                for meal in ["breakfast", "lunch", "dinner"]
            ]

        result = []
        for meal in ["breakfast", "lunch", "dinner"]:
            meal_rows = rows[rows["meal_type"] == meal]
            if meal_rows.empty:
                result.append({
                    "meal_type": meal,
                    "accuracy_pct": 0,
                    "average_error": 0,
                    "total_predictions": 0,
                })
                continue

            errors = (meal_rows["actual_students"] - meal_rows["predicted_students"]).abs()
            accuracy = 100 - ((errors / meal_rows["actual_students"].clip(lower=1)) * 100)
            result.append({
                "meal_type": meal,
                "accuracy_pct": round(max(0, float(accuracy.mean())), 1),
                "average_error": round(float(errors.mean()), 2),
                "total_predictions": int(len(meal_rows)),
            })
        return result

    def _csv_analytics(self, range_days):
        rows = self._csv_rows_for_range(range_days)
        if rows is None or rows.empty:
            return {
                "range_days": range_days,
                "source": "empty",
                "summary": {
                    "total_predictions": 0,
                    "average_error": 0,
                    "accuracy_pct": 0,
                    "total_waste_saved_kg": 0,
                },
                "accuracy_trend": [],
                "waste_by_day": [{"day": day, "waste_kg": 0} for day in VALID_DAYS],
                "meal_accuracy": self._csv_meal_accuracy(range_days),
            }

        daily = rows.groupby("date", as_index=False).agg({
            "predicted_students": "sum",
            "actual_students": "sum",
            "waste_kg": "sum",
        }).sort_values("date")

        trend = []
        for _, row in daily.iterrows():
            predicted = int(row["predicted_students"])
            actual = int(row["actual_students"])
            error = abs(actual - predicted)
            trend.append({
                "date": row["date"].date().isoformat(),
                "predicted": predicted,
                "actual": actual,
                "error": error,
                "accuracy_pct": self._prediction_accuracy(predicted, actual),
            })

        errors = (rows["actual_students"] - rows["predicted_students"]).abs()
        accuracy = 100 - ((errors / rows["actual_students"].clip(lower=1)) * 100)
        waste_by_day = rows.groupby("day", as_index=False)["waste_kg"].sum()
        waste_lookup = {
            item["day"]: round(float(item["waste_kg"]), 2)
            for item in waste_by_day.to_dict("records")
        }

        return {
            "range_days": range_days,
            "source": "training_dataset",
            "summary": {
                "total_predictions": int(len(rows)),
                "average_error": round(float(errors.mean()), 2),
                "accuracy_pct": round(max(0, float(accuracy.mean())), 1),
                "total_waste_saved_kg": round(float(rows["waste_kg"].sum()), 2),
            },
            "accuracy_trend": trend,
            "waste_by_day": [
                {"day": day, "waste_kg": waste_lookup.get(day, 0)}
                for day in VALID_DAYS
            ],
            "meal_accuracy": self._csv_meal_accuracy(range_days),
        }

    @action(detail=False, methods=['post'])
    def generate(self, request):
        college_error = self._require_college(request)
        if college_error:
            return college_error

        day = self._normalize_day(request.data.get("day"))
        if not day:
            return Response(
                {"success": False, "error": "Invalid or missing 'day'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        target_day_index = VALID_DAYS.index(day)
        next_date = self._get_next_date_for_day(target_day_index)
        meal_type = request.data.get("meal_type", "lunch")

        try:
            popularity_score = self._to_float(request.data.get("popularity_score"), 8.0)
            waste_kg = self._to_float(request.data.get("waste_kg"), 3.0)
            is_weekend = self._to_bool_int(
                request.data.get("is_weekend"),
                default=1 if next_date.weekday() >= 5 else 0,
            )
            is_exam = self._to_bool_int(request.data.get("is_exam"), default=0)
            is_festival = self._to_bool_int(request.data.get("is_festival"), default=0)

            result = predict_with_confidence(
                day=day,
                college=request.user.college,
                meal_type=meal_type,
                popularity_score=popularity_score,
                is_weekend=is_weekend,
                is_exam=is_exam,
                is_festival=is_festival,
                waste_kg=waste_kg,
            )
            predicted = result["prediction"]
        except ValueError as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"success": False, "error": "Prediction failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            with transaction.atomic():
                obj, created = Prediction.objects.get_or_create(
                    college=request.user.college,
                    date=next_date,
                    defaults={"predicted_count": predicted}
                )
                if not created:
                    obj.predicted_count = predicted
                    obj.save()
        except Exception as e:
            return Response(
                {"success": False, "error": "Database operation failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            food_plan = calculate_food(predicted)
        except Exception:
            food_plan = {}

        return Response(
            {
                "success": True,
                "data": {
                    "id": obj.id,
                    "date": str(obj.date),
                    "day": obj.day,
                    "predicted": obj.predicted_count,
                    "predicted_attendance": obj.predicted_count,
                    "model_type": result.get("model_type", "HistoricalAverage"),
                    "confidence": result.get("confidence", "Low"),
                    "confidence_label": result.get("confidence_label", result.get("confidence", "Low")),
                    "data_points": result.get("data_points", 0),
                    "data_source": result.get("data_source", "default"),
                    "features": result.get("features", {}),
                    "model_info": get_model_info(),
                    "std_deviation": result.get("std_deviation", 0),
                    "per_meal": result.get("per_meal", {}),
                    "food_plan": food_plan,
                    "food_optimization_plan": food_plan,
                }
            },
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        college_error = self._require_college(request)
        if college_error:
            return college_error

        try:
            range_days = int(request.query_params.get("range", 30))
        except ValueError:
            range_days = 30
        if range_days not in VALID_RANGES:
            range_days = 30

        start_date = now().date() - timedelta(days=range_days - 1)
        queryset = self.get_queryset().filter(date__gte=start_date)
        data = self._db_analytics(queryset, range_days) or self._csv_analytics(range_days)

        return Response({"success": True, "data": data})

    @action(detail=False, methods=['get'], url_path='training-logs', permission_classes=[IsKitchen])
    def training_logs(self, request):
        logs = ModelTrainingLog.objects.filter(
            college=request.user.college
        ).order_by('-trained_at')
        serializer = ModelTrainingLogSerializer(logs, many=True)
        return Response({"success": True, "data": serializer.data})

    @action(detail=True, methods=['post'])
    def update_actual(self, request, pk=None):
        obj = self.get_object()
        actual_value = request.data.get("actual_count")

        if actual_value is None:
            return Response(
                {"success": False, "error": "actual_count is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            actual = int(actual_value)
            if actual < 0:
                raise ValueError
        except ValueError:
            return Response(
                {"success": False, "error": "actual_count must be a non-negative integer."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                obj.actual_count = actual
                if obj.predicted_count is not None:
                    obj.waste_estimate = (
                        max(0, obj.predicted_count - actual) * 0.18
                    )
                obj.save()
        except Exception as e:
            return Response(
                {"success": False, "error": "Failed to update", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        error = (
            obj.actual_count - obj.predicted_count
            if obj.predicted_count is not None else None
        )
        retraining = None
        try:
            retraining = retrain_if_actual_threshold_crossed(obj.college)
        except Exception as exc:
            retraining = {"failed": [{"error": str(exc)}]}

        return Response({
            "success": True,
            "data": {
                "id": obj.id,
                "date": str(obj.date),
                "day": obj.day,
                "predicted": obj.predicted_count,
                "actual": obj.actual_count,
                "error": error,
                "waste_kg": obj.waste_estimate,
                "retraining": retraining,
            }
        })

    @action(detail=False, methods=['get'])
    def stats(self, request):
        college_error = self._require_college(request)
        if college_error:
            return college_error

        queryset = self.get_queryset().filter(actual_count__isnull=False)
        total = queryset.count()

        if total == 0:
            return Response({
                "success": True,
                "data": {
                    "total_records": 0,
                    "average_error": 0,
                    "total_waste_kg": 0,
                    "accuracy_pct": 0,
                }
            })

        errors = [
            abs(obj.actual_count - obj.predicted_count)
            for obj in queryset
            if obj.predicted_count is not None
        ]
        avg_error = mean(errors) if errors else 0

        # Accuracy: predictions within 10% of actual
        accurate = sum(
            1 for obj in queryset
            if obj.predicted_count and
            abs(obj.actual_count - obj.predicted_count) / max(obj.actual_count, 1) <= 0.10
        )
        accuracy_pct = round((accurate / total) * 100, 1)

        total_waste = sum(obj.waste_estimate or 0 for obj in queryset)

        return Response({
            "success": True,
            "data": {
                "total_records": total,
                "average_error": round(avg_error, 2),
                "total_waste_kg": round(total_waste, 2),
                "accuracy_pct": accuracy_pct,
            }
        })
