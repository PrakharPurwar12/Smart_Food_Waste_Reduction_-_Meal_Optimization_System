from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import College

User = get_user_model()

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ('id', 'name')

class UserSerializer(serializers.ModelSerializer):
    college = CollegeSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'college', 'first_name', 'last_name')
        read_only_fields = ('id',)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    college_name = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'role', 'college_name')

    def create(self, validated_data):
        college_name = validated_data.pop('college_name')
        college, _ = College.objects.get_or_create(name=college_name.strip())
        
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', 'student'),
            college=college
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
