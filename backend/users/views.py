

# # Create your views here.
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.contrib.auth.models import Group, User
# from rest_framework import status
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth import authenticate, login

# class RegisterView(APIView):
#     def post(self, request):
#         first_name = request.data.get('first_name')
#         last_name = request.data.get('last_name')
#         email=request.data.get('email')
#         username = request.data.get('username')
#         password = request.data.get('password')
#         role = request.data.get('role')  # Role (Learner, Interpreter, or Company)

#         if not username or not password or not role:
#             return Response({"detail": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

#         user = User.objects.create_user(first_name=first_name,last_name=last_name,email=email,username=username, password=password)
#         group = Group.objects.get(name=role)
#         user.groups.add(group)
#         user.save()

#         return Response({"detail": "User created successfully"}, status=status.HTTP_201_CREATED)

# class LoginView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             })
#         return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)53d3b677500b50ee533ee87c52b7e3bb01f52fc3



from users.models import User
from users.serializers import UserSerializer
from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from learner.serializers import LearnerSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from learner.models import Learner
from learner.serializers import LearnerSerializer

# class UserLoginView(APIView):
#     def post(self, request, *args, **kwargs):
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         # Authenticate the user
#         user = authenticate(request, username=username, password=password)

#         if user is not None:
#             # User authenticated, log them in
#             login(request, user)
            
#             # Generate or get an existing token
#             token, created = Token.objects.get_or_create(user=user)
#             if created:
#                 token.delete()  # If token was created but already exists, delete and create a new one
#                 token = Token.objects.create(user=user)

#             # Prepare the response data
#             response_data = {
#                 'token': token.key,
#                 'username': user.username,
#                 'role': user.role,  # Assuming you have a 'role' field in the User model
#             }

#             # Check if the user is a learner and add learner data to the response
#           
        
#         else:
#             return Response({'message': 'Invalid username or password'}, status=401)
class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Authenticate the user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # User authenticated, log them in
            login(request, user)
            
            # Generate or get an existing token
            token, created = Token.objects.get_or_create(user=user)
            if created:
                token.delete()  # If token was created but already exists, delete and create a new one
                token = Token.objects.create(user=user)

            # Prepare the response data
            response_data = {
                'token': token.key,
                'username': user.username,
                'role': user.role,  # Assuming you have a 'role' field in the User model
            }

            # Check if the user is a learner and add learner data to the response
            if user.role == 'learner':
                # Make sure the user has a related Learner instance
                try:
                    learner = user.learner_account  # Assuming related name is 'learner_account'
                    learner_serializer = LearnerSerializer(learner)
                    response_data['skill_level'] = learner_serializer.data.get('skill_level','unknown')
                    response_data['data'] = learner_serializer.data  # Add additional learner data
                except Learner.DoesNotExist:
                    response_data['skill_level'] = 'unknown'
                    response_data['data'] = {}

            return Response(response_data)
        
        else:
            return Response({'message': 'Invalid username or password'}, status=401)
        

# class UserLogoutView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         try:
#             # Get the user's token
#             token = Token.objects.get(user=request.user)
#             token.delete()  # Delete the token
#             return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
#         except Token.DoesNotExist:
#             return Response({"message": "No token found"}, status=status.HTTP_400_BAD_REQUEST)
# class UserLogoutView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         print(f"Request Headers: {request.headers}")  # Log the headers to check if Authorization is sent

#         # Ensure we are receiving the correct token
#         token_key = request.auth.key if request.auth else None
        
#         if not token_key:
#             return Response({'detail': 'Authentication credentials were not provided.'}, status=401)

#         try:
#             token = Token.objects.get(key=token_key)
#             token.delete()
#             return Response({'detail': 'Successfully logged out.'})
#         except Token.DoesNotExist:
#             return Response({'detail': 'Invalid token.'}, status=401)
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Print the Authorization header to debug
        print(f"Authorization Header: {request.headers.get('Authorization')}")

        # Ensure we are receiving the correct token
        token_key = request.auth.key if request.auth else None
        
        if not token_key:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=401)

        try:
            token = Token.objects.get(key=token_key)
            token.delete()
            return Response({'detail': 'Successfully logged out.'})
        except Token.DoesNotExist:
            return Response({'detail': 'Invalid token.'}, status=401)