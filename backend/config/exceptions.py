from rest_framework.views import exception_handler
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    if response is not None:
        # Standardize the error format
        error_msg = ""
        if isinstance(response.data, dict):
            # Try to extract a meaningful error message
            if 'detail' in response.data:
                error_msg = response.data['detail']
            elif 'non_field_errors' in response.data:
                error_msg = response.data['non_field_errors'][0]
            else:
                # Get the first field error if available
                first_field = next(iter(response.data))
                if isinstance(response.data[first_field], list):
                    error_msg = f"{first_field}: {response.data[first_field][0]}"
                else:
                    error_msg = f"{first_field}: {response.data[first_field]}"
        elif isinstance(response.data, list):
            error_msg = response.data[0]
        else:
            error_msg = str(response.data)

        response.data = {
            "success": False,
            "error": error_msg,
            "details": response.data
        }

    return response
