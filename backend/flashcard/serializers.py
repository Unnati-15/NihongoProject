from rest_framework import serializers

from users.models import User
from .models import  Deck, Flashcard

class FlashcardSerializer(serializers.ModelSerializer):
    deck = serializers.PrimaryKeyRelatedField(queryset=Deck.objects.all(), required=True)
    learner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)
    class Meta:
        model = Flashcard
        fields = ['id','front','back','deck','learner']

class DeckSerializer(serializers.ModelSerializer):
    learner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)
    class Meta:
        model = Deck
        fields = [ 'id','name','description','learner']
    