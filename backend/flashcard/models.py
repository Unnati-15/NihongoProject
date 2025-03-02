from django.db import models
from users.models import User

class Deck(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    learner = models.ForeignKey(User, related_name='decks', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Flashcard(models.Model):
    front = models.CharField(max_length=255)
    back = models.CharField(max_length=255)
    deck = models.ForeignKey(Deck, related_name='flashcards', on_delete=models.CASCADE)
    learner = models.ForeignKey(User, related_name='flashcards', on_delete=models.CASCADE)

    def __str__(self):
        return f"Flashcard: {self.front}"
