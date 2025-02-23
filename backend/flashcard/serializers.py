from rest_framework import serializers

from users.models import User
from .models import Flashcard, Deck

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['front','back','is_learned','deck','learner']

class DeckSerializer(serializers.ModelSerializer):
    learner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)  # Ensure learner is required
    class Meta:
        model = Deck
        fields = [ 'name','description','learner']
    