from django.core.management.base import BaseCommand

from predictions.retraining import retrain_all_models


class Command(BaseCommand):
    help = "Retrain all eligible college meal prediction models."

    def handle(self, *args, **options):
        summary = retrain_all_models()

        self.stdout.write(self.style.SUCCESS("Model retraining complete"))
        self.stdout.write(f"Trained: {len(summary['trained'])}")
        for item in summary["trained"]:
            self.stdout.write(
                "  college={college_id} meal={meal_type} points={data_points} "
                "mae={mae} r2={r2_score} version={model_version}".format(**item)
            )

        self.stdout.write(f"Skipped: {len(summary['skipped'])}")
        for item in summary["skipped"]:
            self.stdout.write(
                "  college={college_id} meal={meal_type} points={data_points} reason={reason}".format(**item)
            )

        self.stdout.write(f"Failed: {len(summary['failed'])}")
        for item in summary["failed"]:
            self.stdout.write(
                "  college={college_id} meal={meal_type} points={data_points} error={error}".format(**item)
            )
