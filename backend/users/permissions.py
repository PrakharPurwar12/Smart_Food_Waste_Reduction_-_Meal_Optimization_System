from rest_framework import permissions

class IsStudent(permissions.BasePermission):
    """
    Allows access only to users with the 'student' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'student')

class IsKitchen(permissions.BasePermission):
    """
    Allows access only to users with the 'kitchen' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'kitchen')

class IsStudentOrKitchen(permissions.BasePermission):
    """
    Allows access to both students and kitchen staff.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['student', 'kitchen'])
