from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status,viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from interpreter.models import Availability, Certification, Interpreter, InterpreterCertification, InterpreterLanguage, Language
from interpreter.serializers import InterpreterSerializer, LanguageSerializer
from rest_framework.exceptions import NotFound

class InterpreterRegistrationView(APIView):
    def post(self,request, *args, **kwargs):
        print(request.data)
        serializer = InterpreterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Interpreter registered successfully!'
            }, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)   

class InterpreterListAll(viewsets.ModelViewSet):
    serializer_class = InterpreterSerializer

    def get_queryset(self):
        return Interpreter.objects.all()
    
class InterpreterUpdateAPIView(APIView):
    def patch(self, request, pk, *args, **kwargs):
        try:
            instance = Interpreter.objects.get(pk=pk)
        except Interpreter.DoesNotExist:
            raise NotFound("Instance not found.")
        
        serializer = InterpreterSerializer(instance, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InterpreterListView(APIView):
    permission_classes = [IsAuthenticated]  # Optional: Restrict actions based on authentication

    def get(self, request):
        user = request.user

        # Check if user is authenticated and fetch specific interpreter data
        if user.is_authenticated:
            interpreters = Interpreter.objects.filter(user=user).prefetch_related(
                'language__language',
                'certification__certification',
                'availability'
            )
        # Serialize the data
        serializer = InterpreterSerializer(interpreters, many=True)
        return Response(serializer.data)
    

class LanguageListView(APIView):
    def get(self, request, *args, **kwargs):
        languages = Language.objects.all()
        serializer = LanguageSerializer(languages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class AddLanguageToInterpreterView(APIView):
    def post(self, request, interpreter_id):
        try:
            # Get the Interpreter instance
            interpreter = Interpreter.objects.get(id=interpreter_id)
            print(interpreter)
            # Get language data from the request
            language_name = request.data.get('name')
            print(language_name)
            # Check if language exists or create it
            language_instance, created = Language.objects.get_or_create(name=language_name)

            # Create a new InterpreterLanguage entry
            InterpreterLanguage.objects.create(interpreter=interpreter, language=language_instance)

            # Return success response
            return Response({"message": "Language added successfully"}, status=status.HTTP_201_CREATED)

        except Interpreter.DoesNotExist:
            return Response({"error": "Interpreter not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AddCertificationToInterpreterView(APIView):
    def post(self, request, interpreter_id):
        try:
            # Get the Interpreter instance
            interpreter = Interpreter.objects.get(id=interpreter_id)
            print(interpreter)
            # Get language data from the request
            certificate_name = request.data.get('name')
            print(certificate_name)
            certificate_issuing_organization = request.data.get('issuing_organization')
            print(certificate_issuing_organization)
            certificate_issue_date = request.data.get('issue_date')
            print(certificate_issue_date)
            certificate_expiry_date = request.data.get('expiry_date')
            print(certificate_expiry_date)
            # Check if language exists or create it
            certificate_instance, created = Certification.objects.get_or_create(name=certificate_name,issuing_organization=certificate_issuing_organization,issue_date=certificate_issue_date,expiry_date=certificate_expiry_date)

            # Create a new InterpreterLanguage entry
            InterpreterCertification.objects.create(interpreter=interpreter, certification=certificate_instance)

            # Return success response
            return Response({"message": "Certification added successfully"}, status=status.HTTP_201_CREATED)

        except Interpreter.DoesNotExist:
            return Response({"error": "Interpreter not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class AddAvailabilityToInterpreterView(APIView):
    def post(self, request, interpreter_id):
        try:
            # Get the Interpreter instance
            interpreter = Interpreter.objects.get(id=interpreter_id)
            
            # Get availability data from the request
            day_of_week = request.data.get('day_of_week')
            start_time = request.data.get('start_time')
            end_time = request.data.get('end_time')

            # Optional: Validate that the necessary data exists
            if not all([day_of_week, start_time, end_time]):
                return Response({"error": "Missing required fields: day_of_week, start_time, end_time"}, 
                                status=status.HTTP_400_BAD_REQUEST)

            # Convert start_time and end_time to datetime objects if needed
            # This assumes `start_time` and `end_time` are in ISO 8601 format (e.g., '2025-03-27T09:00:00Z')
            from datetime import datetime
            start_time = datetime.fromisoformat(start_time)
            end_time = datetime.fromisoformat(end_time)

            # Create an Availability instance and associate it with the Interpreter
            availability_instance = Availability.objects.create(
                interpreter=interpreter,
                day_of_week=day_of_week,
                start_time=start_time,
                end_time=end_time
            )

            # Return success response
            return Response({"message": "Availability added successfully"}, status=status.HTTP_201_CREATED)

        except Interpreter.DoesNotExist:
            return Response({"error": "Interpreter not found"}, status=status.HTTP_404_NOT_FOUND)

        except ValueError as e:
            return Response({"error": f"Invalid time format: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Return more informative error message
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class AvailabilityUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Optional: If authentication is required

    def patch(self, request, interpreter_id, availability_id):
        try:
            # Get the Interpreter instance
            interpreter = Interpreter.objects.get(id=interpreter_id)

            # Get availability details from the request
            day_of_week = request.data.get('day_of_week')
            start_time = request.data.get('start_time')
            end_time = request.data.get('end_time')

            # Get the availability instance to update
            availability_instance = Availability.objects.get(id=availability_id)

            # Check if the availability instance is linked to the specified interpreter
            if availability_instance.interpreter != interpreter:
                return Response({"error": "This availability does not belong to the specified interpreter"}, 
                                status=status.HTTP_400_BAD_REQUEST)
            # Update only the fields that are present in the request
            if day_of_week:
                availability_instance.day_of_week = day_of_week
            if start_time:
                availability_instance.start_time = start_time
            if end_time:
                availability_instance.end_time = end_time

            # Save the updated availability instance
            availability_instance.save()

            # Return success response
            return Response({"message": "Availability updated successfully"}, status=status.HTTP_200_OK)

        except Interpreter.DoesNotExist:
            return Response({"error": "Interpreter not found"}, status=status.HTTP_404_NOT_FOUND)

        except Availability.DoesNotExist:
            return Response({"error": "Availability not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)