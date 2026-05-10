from django.core.management.base import BaseCommand
from meals.models import RotatingMenu
from meals.utils import load_rotating_menu


class Command(BaseCommand):
    help = 'Seed the rotating menu table from the JSON dataset'

    def handle(self, *args, **kwargs):
        rotating_menu = load_rotating_menu()
        model_fields = {
            "week", "day", "breakfast", "lunch", "snacks", "dinner"
        }

        RotatingMenu.objects.all().delete()
        for item in rotating_menu:
            RotatingMenu.objects.create(
                **{key: value for key, value in item.items() if key in model_fields}
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded {len(rotating_menu)} rotating menu entries'
            )
        )
