from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count
from django.utils import timezone
from datetime import datetime
import pytz

from .models import MealBooking, MessMenu
from .serializers import MealBookingSerializer, MessMenuSerializer
from .utils import DAY_INDEX_TO_NAME, get_current_week_type, get_menu_by_day, load_rotating_menu
from users.permissions import IsKitchen, IsStudentOrKitchen


MEAL_START_TIMES = {
    'breakfast': (7, 30),
    'lunch': (12, 30),
    'snacks': (16, 30),
    'dinner': (19, 30),
}

IST = pytz.timezone('Asia/Kolkata')


def _can_cancel(booking):
    now_ist = timezone.now().astimezone(IST)
    today_date = now_ist.date()
    booking_date = booking.date

    if booking_date < today_date:
        return False, "Cannot cancel bookings for past dates."

    if booking_date > today_date:
        return True, ""

    meal_start_hour, meal_start_min = MEAL_START_TIMES.get(booking.meal_type, (0, 0))
    meal_start = IST.localize(
        datetime(
            booking_date.year,
            booking_date.month,
            booking_date.day,
            meal_start_hour,
            meal_start_min,
            0
        )
    )

    if now_ist >= meal_start:
        start_str = f"{meal_start_hour:02d}:{meal_start_min:02d}"
        return False, f"Cannot cancel after meal has started ({booking.meal_type} starts at {start_str})."

    return True, ""


class MealBookingViewSet(viewsets.ModelViewSet):
    queryset = MealBooking.objects.all()
    serializer_class = MealBookingSerializer

    def get_permissions(self):
        if self.action in ['book', 'my_bookings', 'cancel']:
            return [IsStudentOrKitchen()]
        if self.action in ['all_bookings', 'stats']:
            return [IsKitchen()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated or not user.college_id:
            return MealBooking.objects.none()

        if user.role == 'student':
            return MealBooking.objects.filter(
                user=user,
                user__college=user.college
            ).order_by('-date', 'meal_type')

        return MealBooking.objects.filter(
            user__college=user.college
        ).order_by('-date', 'meal_type')

    @action(detail=False, methods=['post'])
    def book(self, request):
        if request.user.role != 'student':
            return Response(
                {"success": False, "error": "Only students can book meals."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not request.user.college_id:
            return Response(
                {"success": False, "error": "User not assigned to a college."},
                status=status.HTTP_403_FORBIDDEN
            )

        meal_type = request.data.get('meal_type')
        if meal_type not in MEAL_START_TIMES:
            return Response(
                {"success": False, "error": "Invalid meal type."},
                status=status.HTTP_400_BAD_REQUEST
            )

        date_str = request.data.get('date')
        try:
            booking_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except Exception:
            return Response(
                {"success": False, "error": "Invalid date format."},
                status=status.HTTP_400_BAD_REQUEST
            )

        now_ist = timezone.now().astimezone(IST).date()
        if booking_date < now_ist:
            return Response(
                {"success": False, "error": "Cannot book past dates."},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing = MealBooking.objects.filter(
            user=request.user,
            date=booking_date,
            meal_type=meal_type
        ).first()

        if existing:
            if existing.status == 'booked':
                return Response(
                    {"success": False, "error": "Already booked."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            existing.status = 'booked'
            existing.save()
            return Response(
                {"success": True, "data": self.get_serializer(existing).data}
            )

        serializer = self.get_serializer(data={
            'meal_type': meal_type,
            'date': booking_date
        })

        if serializer.is_valid():
            serializer.save(user=request.user, status='booked')
            return Response(
                {"success": True, "data": serializer.data},
                status=status.HTTP_201_CREATED
            )

        return Response(
            {"success": False, "error": "Invalid data."},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        queryset = self.get_queryset()

        date = request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)

        return Response({
            "success": True,
            "data": self.get_serializer(queryset, many=True).data
        })

    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if booking.user != request.user and request.user.role != 'kitchen':
            return Response(
                {"success": False, "error": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status == 'cancelled':
            return Response(
                {"success": False, "error": "Already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        allowed, reason = _can_cancel(booking)
        if not allowed:
            return Response(
                {"success": False, "error": reason},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'cancelled'
        booking.save()

        return Response({
            "success": True,
            "data": self.get_serializer(booking).data
        })

    @action(detail=False, methods=['get'])
    def all_bookings(self, request):
        date = request.query_params.get('date')

        bookings = MealBooking.objects.filter(
            date=date,
            user__college=request.user.college
        )

        return Response({
            "success": True,
            "data": self.get_serializer(bookings, many=True).data
        })

    @action(detail=False, methods=['get'])
    def stats(self, request):
        date = request.query_params.get('date')

        stats = MealBooking.objects.filter(
            date=date,
            status='booked',
            user__college=request.user.college
        ).values('meal_type').annotate(count=Count('id'))

        result = {'breakfast': 0, 'lunch': 0, 'snacks': 0, 'dinner': 0}
        for item in stats:
            result[item['meal_type']] = item['count']

        return Response({"success": True, "data": result})


class MessMenuViewSet(viewsets.ModelViewSet):
    queryset = MessMenu.objects.all()
    serializer_class = MessMenuSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'today']:
            return [permissions.IsAuthenticated()]
        return [IsKitchen()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not user.college_id:
            return MessMenu.objects.none()
        return MessMenu.objects.filter(college=user.college)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        menu_date = serializer.validated_data['date']

        menu, _ = MessMenu.objects.update_or_create(
            college=request.user.college,
            date=menu_date,
            defaults=serializer.validated_data
        )

        return Response({
            "success": True,
            "data": self.get_serializer(menu).data
        })

    @action(detail=False, methods=['get'])
    def today(self, request):
        date = request.query_params.get(
            'date',
            timezone.now().astimezone(IST).date()
        )

        menu = MessMenu.objects.filter(
            college=request.user.college,
            date=date
        ).first()

        if not menu:
            return Response(
                {"success": False, "error": "Menu not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "success": True,
            "data": self.get_serializer(menu).data
        })


class RotatingMenuViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().astimezone(IST).date()
        week = get_current_week_type()
        day = today.weekday()
        menu = get_menu_by_day(day, week)

        if not menu:
            return Response(
                {"success": False, "error": "Rotating menu not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "success": True,
            "data": {
                **menu,
                "day": DAY_INDEX_TO_NAME[menu["day"]],
            }
        })

    @action(detail=False, methods=['get'])
    def full_schedule(self, request):
        data = {}
        for menu in load_rotating_menu():
            week_key = f"Week {menu['week']}"
            if week_key not in data:
                data[week_key] = {}
            data[week_key][DAY_INDEX_TO_NAME[menu["day"]]] = {
                "breakfast": menu["breakfast"],
                "lunch": menu["lunch"],
                "snacks": menu["snacks"],
                "dinner": menu["dinner"],
                "attendance_factor": menu["attendance_factor"],
                "popularity_score": menu["popularity_score"],
                "rice_per_student_g": menu["rice_per_student_g"],
                "dal_per_student_g": menu["dal_per_student_g"],
                "chapati_per_student": menu["chapati_per_student"],
            }

        return Response({"success": True, "data": data})
