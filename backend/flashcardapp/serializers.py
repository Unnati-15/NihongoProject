# serializers.py
from rest_framework import serializers
from .models import FlashcardDeck, FlashcardApp

class FlashcardDeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashcardDeck
        fields = ['id', 'title', 'description']

class FlashcardAppSerializer(serializers.ModelSerializer):
    deck = FlashcardDeckSerializer()
    class Meta:
        model = FlashcardApp
        fields = ['id', 'front', 'back','deck']