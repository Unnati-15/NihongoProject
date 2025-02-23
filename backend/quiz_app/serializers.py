from rest_framework import serializers

from users.models import User
from .models import Level, Category, Quiz, Question, Answer, UserAnswer, UserQuizProgress
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
    category = CategorySerializer(read_only=True)  # Include the category details
    questions = QuestionSerializer(many=True, read_only=True)  # Include all questions in the quiz
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'category', 'time_limit', 'questions']

class UserAnswerSerializer(serializers.ModelSerializer):
    
    # Remove learner from the serializer fields directly
    # learner will come from context and doesn't need to be explicitly passed.
    
    def validate(self, data):
        learner = self.context.get('learner')  # Get learner from context
        question = data.get('question')  # This should be a Question object or ID
        selected_answer = data.get('selected_answer')

        # Ensure learner is present
        if not learner:
            raise serializers.ValidationError("Learner not provided.")
        
        # Validate if the question exists (using the question ID passed in data)
        if not Question.objects.filter(id=question.id).exists():
            raise serializers.ValidationError("Invalid question.")
        
        # Validate if the answer exists for the given question
        if not Answer.objects.filter(id=selected_answer.id, question=question).exists():
            raise serializers.ValidationError("Answer does not exist for this question.")
        
        # Check if the selected answer is correct (assuming selected_answer is an Answer object)
        data['is_correct'] = selected_answer.is_correct if selected_answer else False
        
        return data

    class Meta:
        model = UserAnswer
        fields = ['id', 'learner', 'question', 'selected_answer', 'is_correct', 'time_taken']

        
# UserQuizProgress Serializer (For tracking quiz progress)
class UserQuizProgressSerializer(serializers.ModelSerializer):
    quiz = QuizSerializer(read_only=True)
    
    class Meta:
        model = UserQuizProgress
        fields = ['id', 'learner', 'quiz', 'score', 'is_completed', 'start_time', 'end_time', 'total_time_taken']