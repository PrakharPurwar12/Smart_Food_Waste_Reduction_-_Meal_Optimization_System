# Generated manually to make predictions tenant-scoped.

import django.db.models.deletion
from django.db import migrations, models


def assign_existing_predictions_to_legacy_college(apps, schema_editor):
    Prediction = apps.get_model('predictions', 'Prediction')
    College = apps.get_model('users', 'College')

    if not Prediction.objects.filter(college__isnull=True).exists():
        return

    college, _ = College.objects.get_or_create(name='Legacy College')
    Prediction.objects.filter(college__isnull=True).update(college=college)


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_college_user_college'),
        ('predictions', '0002_rename_expected_count_prediction_predicted_count_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='prediction',
            name='college',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='predictions',
                to='users.college',
            ),
        ),
        migrations.AlterField(
            model_name='prediction',
            name='date',
            field=models.DateField(),
        ),
        migrations.RunPython(assign_existing_predictions_to_legacy_college, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='prediction',
            name='college',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='predictions',
                to='users.college',
            ),
        ),
        migrations.AlterUniqueTogether(
            name='prediction',
            unique_together={('college', 'date')},
        ),
    ]
