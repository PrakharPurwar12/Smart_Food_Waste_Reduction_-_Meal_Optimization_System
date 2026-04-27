from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealBookingViewSet, MessMenuViewSet

router = DefaultRouter()
router.register(r'menu', MessMenuViewSet, basename='menu')
router.register(r'', MealBookingViewSet, basename='meals')

urlpatterns = [
    path('', include(router.urls)),
]
