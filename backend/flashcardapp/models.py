from django.db import models

class FlashcardDeck(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    def __str__(self):
        return self.title

class FlashcardApp(models.Model):
    front = models.TextField()
    back = models.TextField()
    deck = models.ForeignKey(FlashcardDeck, related_name="flashcardapp", on_delete=models.CASCADE)
    
    def __str__(self):
        return self.front
