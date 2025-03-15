from django.utils import timezone
from django.db import models
from learner.models import Learner
from users.models import User

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
    
# Quiz Submission
class QuizSubmission(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='submissions', on_delete=models.CASCADE) 
    submitted_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f'Submission for {self.quiz.title}  at {self.submitted_at}'
# UserQuizProgress Model (Tracks quiz progress for each user)
class QuizAttempt(models.Model):
    learner = models.ForeignKey(User, related_name="quiz_progress", on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, related_name="user_progress", on_delete=models.CASCADE)
    score = models.IntegerField(default=0)  
    attempt_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attempt {self.id} by {self.learner.username} - {self.quiz.title}"
# UserAnswer Model (Tracks user's selected answers for each question)
class AnswerSubmission(models.Model):
    quiz_attempt = models.ForeignKey(QuizAttempt, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, related_name='submissions', on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, related_name='submissions', on_delete=models.CASCADE)

    def __str__(self):
        return f"Answer {self.id} for Question {self.question.id} by {self.quiz_attempt.learner.username}"