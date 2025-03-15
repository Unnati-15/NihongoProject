from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Writeapp
from .serializers import WriteappSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class WriteappViewSet(viewsets.ModelViewSet):
    queryset = Writeapp.objects.all()
    serializer_class = WriteappSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(learner=self.request.user)

    def get_queryset(self):
        return Writeapp.objects.filter(learner=self.request.user)

class GetCurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print(user.id)
        return Response({"learnerId": user.id})