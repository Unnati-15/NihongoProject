from rest_framework import serializers

from learner.serializers import LearnerSerializer
from users.models import User
from .models import AnswerSubmission, LearnerQuizAttempt, LearnerQuizQuestionDetail, Level, Category, Quiz, Question, Answer, QuizAttempt, QuizSubmission
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


class LearnerQuizQuestionDetailSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()  # Nested serializer to include question details
    selected_answer = AnswerSerializer()
    correct_answer = AnswerSerializer()

    class Meta:
        model = LearnerQuizQuestionDetail
        fields = ['question', 'selected_answer', 'correct_answer', 'is_correct']


# Serializer for QuizAttempt model
class LearnerQuizAttemptSerializer(serializers.ModelSerializer):
    # Custom serializer for learner (displaying username, email, etc.)
    learner = serializers.SerializerMethodField()
    quiz = serializers.SerializerMethodField()

    # List of question details (serialize question-answer info)
    question_details = LearnerQuizQuestionDetailSerializer(many=True)

    class Meta:
        model = LearnerQuizAttempt
        fields = ['id', 'learner', 'quiz', 'score', 'attempt_date', 'total_attempts', 'question_details']

    # Custom method to return learner's information (e.g., username, email)
    def get_learner(self, obj):
        # Fetching learner's details from related model
        learner = obj.learner
        return {
            'id': learner.id,
            'username': learner.username,
            'email': learner.email
        }

    def get_quiz(self, obj):
        # Fetching quiz's details from related model
        quiz = obj.quiz
        return {
            'id': quiz.id,
            'title': quiz.title
        }