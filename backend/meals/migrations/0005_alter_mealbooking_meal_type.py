from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0004_messmenu_snacks_rotatingmenu'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mealbooking',
            name='meal_type',
            field=models.CharField(
                choices=[
                    ('breakfast', 'Breakfast'),
                    ('lunch', 'Lunch'),
                    ('snacks', 'Snacks'),
                    ('dinner', 'Dinner'),
                ],
                max_length=20,
            ),
        ),
    ]
