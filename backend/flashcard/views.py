

from rest_framework import viewsets, permissions
from .models import Flashcard, Deck, Learner
from .serializers import FlashcardSerializer, DeckSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class FlashcardViewSet(viewsets.ModelViewSet):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Retrieve the learner associated with the current user
        learner = Learner.objects.get(user=self.request.user)
        return Flashcard.objects.filter(learner=learner)

    def perform_create(self, serializer):
        # Ensure the flashcard is saved with the correct learner
        learner = Learner.objects.get(user=self.request.user)
        serializer.save(learner=learner)

# class DeckViewSet(viewsets.ModelViewSet):
#     queryset = Deck.objects.all()
#     serializer_class = DeckSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         # Retrieve the learner associated with the current user
#         learner = Learner.objects.get(user=self.request.user)
#         return Deck.objects.filter(learner=learner)

#     def perform_create(self, serializer):
#         # Ensure the deck is saved with the correct learner
#         learner = Learner.objects.get(user=self.request.user)
#         serializer.save(learner=learner)



class DeckCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  # Get the authenticated user
        try:
            # Retrieve the associated Learner instance
            learner = Learner.objects.get(user=user)  # Assuming the Learner model has a `user` foreign key

        except Learner.DoesNotExist:
            return Response({"detail": "Learner profile not found."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data
        data['learner'] = learner.id  # Automatically associate with the authenticated user

        serializer = DeckSerializer(data=data)
        if serializer.is_valid():
            serializer.save()  # Save the deck to the database
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeckListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        learner = request.user
        decks = Deck.objects.filter(learner=learner)  # Only show decks associated with the learner
        serializer = DeckSerializer(decks, many=True)
        return Response(serializer.data)


class DeckDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            deck = Deck.objects.get(id=id, learner=request.user)  # Ensure the deck belongs to the logged-in learner
            serializer = DeckSerializer(deck)
            return Response(serializer.data)
        except Deck.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)