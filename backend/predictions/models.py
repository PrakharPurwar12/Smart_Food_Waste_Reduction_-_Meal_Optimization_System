from django.db import models
from users.models import College

class Prediction(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='predictions')
    date = models.DateField()
    day = models.CharField(max_length=10)

    predicted_count = models.IntegerField()
    actual_count = models.IntegerField(null=True, blank=True)

    waste_estimate = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('college', 'date')
        ordering = ['-date']

    def save(self, *args, **kwargs):
        self.day = self.date.strftime("%A")
        super().save(*args, **kwargs)

    def error(self):
        if self.actual_count is not None:
            return self.actual_count - self.predicted_count
        return None


class ModelTrainingLog(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='model_training_logs')
    trained_at = models.DateTimeField(auto_now_add=True)
    meal_type = models.CharField(max_length=20)
    data_points = models.PositiveIntegerField(default=0)
    mae = models.FloatField(null=True, blank=True)
    r2_score = models.FloatField(null=True, blank=True)
    model_version = models.CharField(max_length=64)

    class Meta:
        ordering = ['-trained_at']

    def __str__(self):
        return f"{self.college} {self.meal_type} model {self.model_version}"
