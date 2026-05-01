from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from .permissions import IsStudent, IsKitchen # Importing new permissions

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['register', 'login']:
            return [permissions.AllowAny()]
        if self.action in ['me', 'set_college']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()] # Default to admin for other actions

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "success": True, 
                "data": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        # Consistent error format
        error_msg = next(iter(serializer.errors.values()))[0] if serializer.errors else "Registration failed"
        return Response({
            "success": False,
            "error": error_msg
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username_or_email = serializer.validated_data['username_or_email']
            password = serializer.validated_data['password']
            
            # Find user by either email or username
            from django.db.models import Q
            user_obj = User.objects.filter(
                Q(email=username_or_email) | Q(username=username_or_email)
            ).first()
            
            user = None
            if user_obj:
                # Delegate to Django's authenticate (which checks password, is_active, etc)
                user = authenticate(email=user_obj.email, password=password)
            
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "success": True,
                    "data": {
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                        "user": UserSerializer(user).data
                    }
                })
            return Response({
                "success": False,
                "error": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            "success": False,
            "error": "Username/Email and password are required"
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            "success": True,
            "data": serializer.data
        })

    @action(detail=False, methods=['post'])
    def set_college(self, request):
        college_name = request.data.get('college_name')
        if not college_name:
            return Response({
                "success": False, 
                "error": "College name is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        from .models import College
        college, created = College.objects.get_or_create(name=college_name.strip())
        
        request.user.college = college
        request.user.save()
        
        return Response({
            "success": True,
            "data": UserSerializer(request.user).data
        })
