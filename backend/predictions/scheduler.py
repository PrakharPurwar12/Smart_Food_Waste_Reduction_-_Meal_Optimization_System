import logging
import os
import sys

from django.core.management import call_command


logger = logging.getLogger(__name__)
_scheduler = None


def _should_start_scheduler():
    if os.environ.get("DISABLE_MODEL_RETRAIN_SCHEDULER") == "1":
        return False

    command = sys.argv[1] if len(sys.argv) > 1 else ""
    if command in {"migrate", "makemigrations", "collectstatic", "shell", "test", "retrain_models"}:
        return False

    # Avoid duplicate scheduler under Django's autoreloader.
    if command == "runserver" and os.environ.get("RUN_MAIN") != "true":
        return False

    return command in {"runserver", "gunicorn", "uwsgi", "daphne"} or not command


def start_scheduler():
    global _scheduler
    if _scheduler is not None or not _should_start_scheduler():
        return

    try:
        from apscheduler.schedulers.background import BackgroundScheduler
        from apscheduler.triggers.cron import CronTrigger
    except ImportError:
        logger.warning("APScheduler is not installed; automatic model retraining is disabled.")
        return

    scheduler = BackgroundScheduler(timezone="Asia/Kolkata")
    scheduler.add_job(
        lambda: call_command("retrain_models"),
        trigger=CronTrigger(day_of_week="sun", hour=2, minute=0, timezone="Asia/Kolkata"),
        id="weekly_model_retraining",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    scheduler.start()
    _scheduler = scheduler
    logger.info("Scheduled weekly model retraining for Sundays at 02:00 IST.")
