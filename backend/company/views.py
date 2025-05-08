from company.models import Booking, Company, JobPosting
from company.serializers import BookingCreateSerializer, BookingSerializer, CompanySerializer, JobPostingSerializer
from rest_framework.response import Response
from rest_framework.views import status,APIView
from rest_framework import viewsets
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
        return JobPosting.objects.filter(company=self.request.user.company_account)
    
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
    queryset = Booking.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BookingCreateSerializer
        return BookingSerializer

    def perform_create(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        booking = self.get_object()
        status_before = booking.status
        serializer = self.get_serializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        status_after = serializer.data.get('status')
        if status_before != status_after:
            # Optional: send notification here
            pass
        return Response(serializer.data)
