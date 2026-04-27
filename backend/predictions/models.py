from django.db import models

class Prediction(models.Model):
    date = models.DateField(unique=True)
    expected_count = models.IntegerField()
    waste_estimate = models.FloatField() # Estimated food waste in kg
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prediction for {self.date}: {self.expected_count} meals"
