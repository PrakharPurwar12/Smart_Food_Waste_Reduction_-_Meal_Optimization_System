from rest_framework import serializers
from .models import MealBooking, MessMenu
from django.contrib.auth import get_user_model

User = get_user_model()

class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class MealBookingSerializer(serializers.ModelSerializer):
    user = UserShortSerializer(read_only=True)
    
    class Meta:
        model = MealBooking
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class MessMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessMenu
        fields = '__all__'
        read_only_fields = ('college', 'created_at')
