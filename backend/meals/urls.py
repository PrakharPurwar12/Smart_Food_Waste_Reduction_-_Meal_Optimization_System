from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import MealBookingViewSet, MessMenuViewSet, RotatingMenuViewSet

bookings_router = SimpleRouter()
bookings_router.register(r'bookings', MealBookingViewSet, basename='meals')

urlpatterns = [
    path('', include(bookings_router.urls)),

    # MessMenu endpoints
    path('menu/', MessMenuViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='menu-list'),
    path('menu/today/', MessMenuViewSet.as_view({
        'get': 'today'
    }), name='menu-today'),
    path('menu/<pk>/', MessMenuViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='menu-detail'),

    # Rotating menu endpoints
    path('rotating/today/', RotatingMenuViewSet.as_view({
        'get': 'today'
    }), name='rotating-today'),
    path('rotating/schedule/', RotatingMenuViewSet.as_view({
        'get': 'full_schedule'
    }), name='rotating-schedule'),
]