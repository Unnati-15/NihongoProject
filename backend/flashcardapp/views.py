
from flashcardapp.models import FlashcardApp, FlashcardDeck
from flashcardapp.serializers import FlashcardAppSerializer, FlashcardDeckSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
# Create your views here.
class FlashcardDeckViewSet(APIView):
    """
    View to list all flashcard decks
    """
    def get(self, request):
        decks = FlashcardDeck.objects.all()
        serializer = FlashcardDeckSerializer(decks, many=True)
        return Response(serializer.data)

class FlashcardAppViewSet(APIView):
    """
    View to list all flashcards for a specific deck
    """
    def get(self, request, deck_id):
        try:
            deck = FlashcardDeck.objects.get(id=deck_id)
            flashcards = FlashcardApp.objects.filter(deck=deck)
            serializer = FlashcardAppSerializer(flashcards, many=True)
            return Response(serializer.data)
        except FlashcardDeck.DoesNotExist:
            return Response({"error": "Deck not found."}, status=status.HTTP_404_NOT_FOUND)