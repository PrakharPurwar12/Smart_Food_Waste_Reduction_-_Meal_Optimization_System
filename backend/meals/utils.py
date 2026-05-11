import json
from functools import lru_cache
from pathlib import Path

from django.utils import timezone


DATA_DIR = Path(__file__).resolve().parent / "data"
MENU_DATA_PATH = DATA_DIR / "rotating_menu.json"

DAY_NAME_TO_INDEX = {
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
}

DAY_INDEX_TO_NAME = {value: key.title() for key, value in DAY_NAME_TO_INDEX.items()}


@lru_cache(maxsize=1)
def load_rotating_menu():
    with MENU_DATA_PATH.open("r", encoding="utf-8") as menu_file:
        return json.load(menu_file)


def _normalize_day(day):
    if isinstance(day, int):
        return day

    day_text = str(day).strip()
    if day_text.isdigit():
        return int(day_text)

    day_index = DAY_NAME_TO_INDEX.get(day_text.lower())
    if day_index is None:
        raise ValueError(f"Invalid day value: {day}")
    return day_index


def get_menu_by_day(day, week):
    day_index = _normalize_day(day)
    week_type = str(week).strip().upper()

    for menu in load_rotating_menu():
        if menu["week"] == week_type and menu["day"] == day_index:
            return menu

    return None


def get_current_week_type():
    week_number = timezone.localdate().isocalendar()[1]
    return "A" if week_number % 2 != 0 else "B"
