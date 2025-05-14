from company.models import Booking, Company, JobPosting
from interpreter.models import Interpreter, Notification
from company.serializers import BookingCreateSerializer, BookingSerializer, CompanySerializer, JobPostingSerializer
from rest_framework.response import Response
from rest_framework.views import status,APIView
from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated

class CompanyRegistrationView(APIView):
    def post(self,request, *args, **kwargs):
        print(request.data)
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Company registered successfully!'
            }, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST) 
    
class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer

    def get_queryset(self):
        return Company.objects.all()
    def patch(self, request, pk, *args, **kwargs):
        try:
            instance = Company.objects.get(pk=pk)
        except Company.DoesNotExist:
            raise NotFound("Instance not found.")
        
        serializer = CompanySerializer(instance, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    
class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        company = self.request.user.company_account  
        print(company)
        # Automatically associate the job posting with the company
        serializer.save(company=company)

    def get_queryset(self):
        # Filter to show only the job postings related to the logged-in company's user
        company = self.request.user  
        print(company)
        if hasattr(company, 'company_account'):
            return JobPosting.objects.filter(company=company.company_account)
        return JobPosting.objects.none()
    
class JobPostingListAll(viewsets.ModelViewSet):
    serializer_class = JobPostingSerializer

    def get_queryset(self):
        return JobPosting.objects.all()
    
class JobPostCompanyDetailView(APIView):
    def get(self, request, job_post_id):
        try:
            job_post = JobPosting.objects.get(id=job_post_id)
            company = job_post.company
            serializer = CompanySerializer(company)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except JobPosting.DoesNotExist:
            return Response({'detail': 'Job post not found'}, status=status.HTTP_404_NOT_FOUND)
        

class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BookingCreateSerializer
        return BookingSerializer

    def get_queryset(self):
        # Only return bookings for jobs that belong to the logged-in company
        user = self.request.user
        if hasattr(user, 'company_account'):
            return Booking.objects.filter(job_posting__company=user.company_account)
        return Booking.objects.none()

    def perform_create(self, serializer):
        booking = serializer.save()

        # Create notification for interpreter
        interpreter_user = booking.interpreter.user
        job_title = booking.job_posting.job_title
        company_name = booking.job_posting.company.user.username
        message = f"You have a new booking request for '{job_title}' from {company_name}."

        Notification.objects.create(
            recipient=interpreter_user,
            message=message
        )

    def update(self, request, *args, **kwargs):
        booking = self.get_object()
        status_before = booking.status
        serializer = self.get_serializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        status_after = serializer.data.get('status')

        if status_before != status_after:
            interpreter = booking.interpreter
            user = interpreter.user
            job = booking.job_posting
            company_name = job.company.user.username

            if status_after == 'accepted':
                message = f"Your application for '{job.job_title}' has been accepted by {company_name}."
            elif status_after == 'declined':
                message = f"Your application for '{job.job_title}' has been declined by {company_name}."
            elif status_after == 'completed':
                message = f"You have successfully completed your role as '{job.job_title}' in {company_name}."
            elif status_after == 'cancelled':
                message = f"Your application for '{job.job_title}' has been cancelled by {company_name}."
            else:
                message = None

            if message:
                Notification.objects.create(recipient=user, message=message)

        return Response(serializer.data)
