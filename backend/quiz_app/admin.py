from django.contrib import admin
from .models import Level, Category, Quiz, Question, Answer

# Level Admin Configuration
class LevelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  # Display the ID and name of the level
    search_fields = ('name',)  # Allow searching by the level name (Beginner / Advanced)

admin.site.register(Level, LevelAdmin)


# Category Admin Configuration
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'level')  # Display category name and associated level
    search_fields = ('name',)  # Allow searching by category name
    list_filter = ('level',)  # Filter by level (Beginner / Advanced)

admin.site.register(Category, CategoryAdmin)


# Quiz Admin Configuration
class QuizAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'time_limit')  # Show title, category, and time limit of the quiz
    search_fields = ('title',)  # Allow searching by the quiz title
    list_filter = ('category',)  # Filter quizzes by category

admin.site.register(Quiz, QuizAdmin)


# Answer Inline Configuration (to show answers inside the Question form)
class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 3  # Add 3 empty answer fields by default when adding a question

# Question Admin Configuration
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'question_text', 'quiz', 'time_limit')  # Show question text, associated quiz, and time limit
    search_fields = ('question_text',)  # Allow searching by question text
    list_filter = ('quiz',)  # Filter questions by quiz
    inlines = [AnswerInline]  # Show the answer options within the Question form

admin.site.register(Question, QuestionAdmin)
