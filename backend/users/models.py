from django.contrib.auth.models import AbstractUser
from django.db import models

class College(models.Model):
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('kitchen', 'Kitchen'),
    )
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, related_name='users')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    def __str__(self):
        return f"{self.email} ({self.role}) - {self.college.name if self.college else 'No College'}"
