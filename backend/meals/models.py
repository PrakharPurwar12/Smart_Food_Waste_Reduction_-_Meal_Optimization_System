from django.db import models
from django.conf import settings
from users.models import College


class MealBooking(models.Model):
    MEAL_TYPE_CHOICES = (
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('snacks', 'Snacks'),
        ('dinner', 'Dinner'),
    )
    STATUS_CHOICES = (
        ('booked', 'Booked'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date', 'meal_type')

    def __str__(self):
        return f"{self.user.email} - {self.meal_type} on {self.date}"


class MessMenu(models.Model):
    college = models.ForeignKey(College, on_delete=models.CASCADE, related_name='menus')
    date = models.DateField()
    breakfast = models.TextField(blank=True)
    lunch = models.TextField(blank=True)
    snacks = models.TextField(blank=True)
    dinner = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('college', 'date')

    def __str__(self):
        return f"Menu for {self.college.name} on {self.date}"


class RotatingMenu(models.Model):
    WEEK_CHOICES = (
        ('A', 'Week A'),
        ('B', 'Week B'),
    )
    DAY_CHOICES = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )

    week = models.CharField(max_length=1, choices=WEEK_CHOICES)
    day = models.IntegerField(choices=DAY_CHOICES)
    breakfast = models.TextField(blank=True)
    lunch = models.TextField(blank=True)
    snacks = models.TextField(blank=True)
    dinner = models.TextField(blank=True)

    class Meta:
        unique_together = ('week', 'day')
        ordering = ['week', 'day']

    def __str__(self):
        return f"Week {self.week} - {self.get_day_display()}"