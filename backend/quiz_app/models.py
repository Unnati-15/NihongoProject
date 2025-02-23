from django.utils import timezone
from django.db import models
from learner.models import Learner

# Level Model (Beginner / Advanced)
class Level(models.Model):
    BEGINNER = 'Beginner'
    ADVANCED = 'Advanced'
    
    LEVEL_CHOICES = [
        (BEGINNER, 'Beginner'),
        (ADVANCED, 'Advanced'),
    ]
    
    name = models.CharField(
        max_length=10,
        choices=LEVEL_CHOICES,
        default=BEGINNER,  # Default level is Beginner
    )

    def __str__(self):
        return self.name


# Category Model (Each category can belong to a specific Level)
class Category(models.Model):
    name = models.CharField(max_length=100)
    level = models.ForeignKey(Level, related_name="categories", on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# Quiz Model (Can have multiple questions)
class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, related_name="quizzes", on_delete=models.CASCADE)
    time_limit = models.IntegerField()  # Total time limit for the quiz (in seconds)

    def __str__(self):
        return self.title


# Question Model (Each question belongs to a specific Quiz)
class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name="questions", on_delete=models.CASCADE)
    question_text = models.TextField()
    time_limit = models.IntegerField(default=30)  # Time limit for each question in seconds

    def __str__(self):
        return self.question_text


# Answer Model (Each answer belongs to a specific Question)
class Answer(models.Model):
    question = models.ForeignKey(Question, related_name="answers", on_delete=models.CASCADE)
    answer_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)  # True if it's the correct answer, False otherwise

    def __str__(self):
        return self.answer_text

# UserQuizProgress Model (Tracks quiz progress for each user)
class UserQuizProgress(models.Model):
    learner = models.ForeignKey(Learner, related_name="quiz_progress", on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, related_name="user_progress", on_delete=models.CASCADE)
    score = models.IntegerField(default=0)  # User's score on this quiz
    is_completed = models.BooleanField(default=False)  # Whether the user has completed the quiz
    start_time = models.DateTimeField(default=timezone.now)  # Time when the quiz was started
    end_time = models.DateTimeField(null=True, blank=True)  # Time when the quiz was completed
    total_time_taken = models.DurationField(null=True, blank=True)  # Time taken to complete the quiz

    def __str__(self):
        return f"{self.learner.username} - {self.quiz.title}"

    # Method to update quiz completion status
    def mark_completed(self, score, total_time):
        self.is_completed = True
        self.score = score
        self.end_time = timezone.now()
        self.total_time_taken = total_time
        self.save()


# UserAnswer Model (Tracks user's selected answers for each question)
class UserAnswer(models.Model):
    learner = models.ForeignKey(Learner, related_name="user_answers", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, related_name="user_answers", on_delete=models.CASCADE)
    selected_answer = models.ForeignKey(Answer, related_name="user_answers", on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)  # Whether the user's answer is correct
    time_taken = models.DurationField()  # Time taken by the user to answer the question

    def __str__(self):
        return f"{self.learner.username} - {self.question.question_text}"