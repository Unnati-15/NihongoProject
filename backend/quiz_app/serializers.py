from rest_framework import serializers

from learner.serializers import LearnerSerializer
from users.models import User
from .models import AnswerSubmission, Level, Category, Quiz, Question, Answer, QuizAttempt, QuizSubmission
# Level Serializer
class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'name']

# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    level = LevelSerializer(read_only=True)  # Include the level information for each category
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'level']

# Answer Serializer
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'answer_text', 'is_correct']

# Question Serializer
class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)  # Include all answers for the question
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'time_limit', 'answers']

# Quiz Serializer
class QuizSerializer(serializers.ModelSerializer):
    # category = CategorySerializer(read_only=True)  # Include the category details
    questions = QuestionSerializer(many=True, read_only=True)  # Include all questions in the quiz
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'category', 'time_limit', 'questions']
class QuizSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizSubmission
        fields = ['id','quiz', 'submitted_at']
        
# Serializer to store each answer submission
class AnswerSubmissionSerializer(serializers.ModelSerializer):
    question = serializers.CharField(source='question.question_text')
    answer = serializers.CharField(source='answer.answer_text')

    class Meta:
        model = AnswerSubmission
        fields = ['question', 'answer']

# Serializer for QuizAttempt to include the answers
class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = AnswerSubmissionSerializer(many=True)

    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz', 'score', 'attempt_date', 'answers']