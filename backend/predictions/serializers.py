from rest_framework import serializers
from .models import ModelTrainingLog, Prediction

class PredictionSerializer(serializers.ModelSerializer):
    college = serializers.StringRelatedField(read_only=True)
    error = serializers.SerializerMethodField()

    class Meta:
        model = Prediction
        fields = '__all__'
        read_only_fields = ('college', 'day', 'created_at', 'waste_estimate')

    def get_error(self, obj):
        return obj.error()

    def validate_actual_count(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("actual_count must be a non-negative integer.")
        return value


class ModelTrainingLogSerializer(serializers.ModelSerializer):
    college = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ModelTrainingLog
        fields = '__all__'
