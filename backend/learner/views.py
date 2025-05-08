
from learner.models import Learner
from learner.serializers import LearnerSerializer
from rest_framework import status,viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class LearnerRegistrationView(APIView):
    def post(self, request):
        print(request.data) 
        serializer = LearnerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LearnerViewSet(viewsets.ModelViewSet):
    queryset = Learner.objects.all()
    serializer_class = LearnerSerializer
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_queryset(self):
        # Get the logged-in user from the request
        user = self.request.user
        
        # Filter the learner data for the logged-in user
        return Learner.objects.filter(user=user)


class UpdateSkillLevel(APIView):
    def post(self, request, pk):
        try:
            learner = Learner.objects.get(pk=pk)
        except Learner.DoesNotExist:
            return Response({"error": "Learner not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get the new skill level from the request data
        new_skill_level = request.data.get('skill_level')

        # Check if the new skill level is valid
        if new_skill_level not in dict(Learner.SkillLevel.choices).keys():
            return Response({"error": "Invalid skill level"}, status=status.HTTP_400_BAD_REQUEST)

        # Update the skill level
        learner.skill_level = new_skill_level
        learner.save()

        # Return the updated learner data
        serializer = LearnerSerializer(learner)
        return Response(serializer.data)