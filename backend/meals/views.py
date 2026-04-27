from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count
from django.utils import timezone
from datetime import datetime
import pytz

from .models import MealBooking, MessMenu
from .serializers import MealBookingSerializer, MessMenuSerializer
from users.permissions import IsStudent, IsKitchen, IsStudentOrKitchen

# ─── Meal start times (IST, 24h format) ────────────────────────────────────
MEAL_START_TIMES = {
    'breakfast': (7, 30),
    'lunch':     (12, 30),
    'dinner':    (19, 30),
}

IST = pytz.timezone('Asia/Kolkata')


def _can_cancel(booking) -> tuple[bool, str]:
    """
    Returns (allowed: bool, reason: str).
    Cancel is allowed only if the current IST time is BEFORE the meal's start time.
    """
    meal_start_hour, meal_start_min = MEAL_START_TIMES.get(booking.meal_type, (0, 0))
    now_ist = timezone.now().astimezone(IST)
    booking_date = booking.date  # date object

    # Build a timezone-aware datetime for the meal start in IST
    meal_start = IST.localize(
        datetime(booking_date.year, booking_date.month, booking_date.day,
                 meal_start_hour, meal_start_min, 0)
    )

    if now_ist >= meal_start:
        start_str = f"{meal_start_hour:02d}:{meal_start_min:02d}"
        return False, f"Cannot cancel after meal has started ({booking.meal_type.capitalize()} starts at {start_str})."
    return True, ""


class MealBookingViewSet(viewsets.ModelViewSet):
    queryset = MealBooking.objects.all()
    serializer_class = MealBookingSerializer

    # ── Permissions ─────────────────────────────────────────────────────────
    def get_permissions(self):
        if self.action in ['book', 'my_bookings', 'cancel']:
            return [IsStudentOrKitchen()]
        if self.action in ['all_bookings', 'stats']:
            return [IsKitchen()]
        # Raw CRUD (list/retrieve/update/destroy) requires auth;
        # scoped by get_queryset so tenants cannot bleed.
        return [permissions.IsAuthenticated()]

    # ── Tenant-scoped queryset ───────────────────────────────────────────────
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return MealBooking.objects.none()

        if not hasattr(user, 'role'):
            return MealBooking.objects.none()

        if user.role == 'student':
            # Students see ONLY their own bookings — no college filter needed
            return MealBooking.objects.filter(user=user).order_by('-date', 'meal_type')

        # Kitchen staff: scoped strictly to their college
        if not user.college_id:
            return MealBooking.objects.none()
        return (
            MealBooking.objects
            .filter(user__college=user.college)
            .order_by('-date', 'meal_type')
        )

    # ── Book ─────────────────────────────────────────────────────────────────
    @action(detail=False, methods=['post'])
    def book(self, request):
        if request.user.role != 'student':
            return Response(
                {"success": False, "error": "Only students can book meals."},
                status=status.HTTP_403_FORBIDDEN
            )

        meal_type = request.data.get('meal_type')
        if meal_type not in MEAL_START_TIMES:
            return Response(
                {"success": False, "error": "Invalid meal type."},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking_date = request.data.get('date', timezone.now().astimezone(IST).date().isoformat())

        # Re-book or duplicate guard
        existing = MealBooking.objects.filter(
            user=request.user,
            date=booking_date,
            meal_type=meal_type
        ).first()

        if existing:
            if existing.status == 'booked':
                return Response(
                    {"success": False,
                     "error": f"Already booked {meal_type} for {booking_date}."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Re-book cancelled record
            existing.status = 'booked'
            existing.save()
            return Response({
                "success": True,
                "data": self.get_serializer(existing).data,
                "message": "Re-booked successfully."
            })

        # New booking
        serializer = self.get_serializer(data={'meal_type': meal_type, 'date': booking_date})
        if serializer.is_valid():
            serializer.save(user=request.user, status='booked')
            return Response(
                {"success": True, "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"success": False, "error": "Invalid booking details."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ── My Bookings ───────────────────────────────────────────────────────────
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        bookings = self.get_queryset()
        serializer = self.get_serializer(bookings, many=True)
        return Response({"success": True, "data": serializer.data})

    # ── Cancel ────────────────────────────────────────────────────────────────
    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        # Ownership + tenant check
        is_own = booking.user == request.user
        is_same_college_kitchen = (
            request.user.role == 'kitchen'
            and request.user.college_id
            and booking.user.college_id == request.user.college_id
        )
        if not is_own and not is_same_college_kitchen:
            return Response(
                {"success": False, "error": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status == 'cancelled':
            return Response(
                {"success": False, "error": "This booking is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Time-based cancellation rule
        allowed, reason = _can_cancel(booking)
        if not allowed:
            return Response(
                {"success": False, "error": reason},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'cancelled'
        booking.save()
        return Response({"success": True, "data": self.get_serializer(booking).data})

    # ── All Bookings (Kitchen only) ───────────────────────────────────────────
    @action(detail=False, methods=['get'])
    def all_bookings(self, request):
        if not request.user.college_id:
            return Response(
                {"success": False, "error": "Your account is not linked to a college."},
                status=status.HTTP_400_BAD_REQUEST
            )
        target_date = request.query_params.get('date', timezone.now().astimezone(IST).date().isoformat())
        bookings = (
            MealBooking.objects
            .filter(date=target_date, user__college=request.user.college)
            .order_by('meal_type')
        )
        serializer = self.get_serializer(bookings, many=True)
        return Response({"success": True, "data": serializer.data})

    # ── Stats (Kitchen only) ──────────────────────────────────────────────────
    @action(detail=False, methods=['get'])
    def stats(self, request):
        if not request.user.college_id:
            return Response(
                {"success": False, "error": "Your account is not linked to a college."},
                status=status.HTTP_400_BAD_REQUEST
            )
        target_date = request.query_params.get('date', timezone.now().astimezone(IST).date().isoformat())
        stats_data = (
            MealBooking.objects
            .filter(date=target_date, status='booked', user__college=request.user.college)
            .values('meal_type')
            .annotate(count=Count('id'))
        )
        result = {'breakfast': 0, 'lunch': 0, 'dinner': 0}
        for item in stats_data:
            result[item['meal_type']] = item['count']
        return Response({"success": True, "data": result})


# ─── Mess Menu ────────────────────────────────────────────────────────────────

class MessMenuViewSet(viewsets.ModelViewSet):
    queryset = MessMenu.objects.all()
    serializer_class = MessMenuSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'today']:
            return [permissions.IsAuthenticated()]
        # create/update/partial_update/destroy: kitchen only
        return [IsKitchen()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not user.college_id:
            return MessMenu.objects.none()
        return MessMenu.objects.filter(college=user.college).order_by('-date')

    def perform_create(self, serializer):
        # Ignore any college sent by client; always use the authenticated user's college
        serializer.save(college=self.request.user.college)

    def perform_update(self, serializer):
        serializer.save(college=self.request.user.college)

    @action(detail=False, methods=['get'])
    def today(self, request):
        if not request.user.college_id:
            return Response(
                {"success": False, "error": "Your account is not linked to a college."},
                status=status.HTTP_400_BAD_REQUEST
            )
        target_date = request.query_params.get('date', timezone.now().astimezone(IST).date().isoformat())
        menu = MessMenu.objects.filter(college=request.user.college, date=target_date).first()
        if menu:
            return Response({"success": True, "data": self.get_serializer(menu).data})
        return Response(
            {"success": False, "error": "No menu set for today."},
            status=status.HTTP_404_NOT_FOUND
        )
