from django.contrib import admin
from .models import FlashcardDeck, FlashcardApp

class FlashcardAppInline(admin.TabularInline):
    model = FlashcardApp
    extra = 1  # Number of empty Flashcard forms to display when creating a Deck

class FlashcardDeckAdmin(admin.ModelAdmin):
    list_display = ['title', 'description']
    search_fields = ['title']
    inlines = [FlashcardAppInline]  # Add inline flashcards to the deck admin page

class FlashcardAppAdmin(admin.ModelAdmin):
    list_display = [ 'front', 'back','deck']
    search_fields = ['front', 'back']
    list_filter = ['deck']  # Filter by deck

# Register models in the Django admin
admin.site.register(FlashcardDeck, FlashcardDeckAdmin)
admin.site.register(FlashcardApp, FlashcardAppAdmin)
