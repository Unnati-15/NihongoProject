
from django.utils import timezone
from rest_framework import viewsets,status
from django.http import JsonResponse
from rest_framework.exceptions import AuthenticationFailed
from learner.models import Learner
from .models import Answer, AnswerSubmission, Level, Category, Quiz, Question, QuizAttempt, QuizSubmission
from .serializers import AnswerSerializer, LevelSerializer, CategorySerializer, QuizAttemptSerializer, QuizSerializer, QuestionSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from users.models import User
from rest_framework.views import APIView


class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        level_id = self.kwargs.get('level_id')
        return Category.objects.filter(level_id=level_id)


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def get_queryset(self):
        category_id = self.kwargs.get('category_id')
        return Quiz.objects.filter(category_id=category_id)
    
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        quiz_id = self.kwargs.get('quiz_id')
        return Question.objects.filter(quiz_id=quiz_id)

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    def get_queryset(self):
        question_id = self.kwargs.get('question_id')
        return Answer.objects.filter(question_id=question_id)
# # Submit Quiz View (POST Request to submit quiz answers)
# @api_view(['POST'])
# def submit_quiz(request, selectedQuiz):
#     if not request.user.is_authenticated:
#         raise AuthenticationFailed("User not authenticated.")

#     try:
#         # Get the learner instance
#         learner_instance = Learner.objects.get(user=request.user)
#         print(learner_instance)
#     except Learner.DoesNotExist:
#         return JsonResponse({"error": "Learner not found for the authenticated user."}, status=400)

  
#     print(learner_instance)
#     # Ensure the quiz exists
#     try:
#         quiz = Quiz.objects.get(id=selectedQuiz)
#         print(quiz)
#     except Quiz.DoesNotExist:
#         return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)

#     # Get answers from the request body (Expecting a list of answers like [{ "question_id": 1, "answer_id": 2 }, ...])
#     serializer = UserAnswerSerializer(data=request.data, many=True, context={'learner': learner_instance})
#     print(serializer)
#     if not serializer.is_valid():
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     answers = serializer.validated_data
#     print(answers)
#     # Validate that answers are provided
#     if not answers:
#         return Response({"error": "No answers provided"}, status=status.HTTP_400_BAD_REQUEST)

#     # Process the answers and calculate the score
#     correct_answers = 0
#     total_questions = len(answers)

#     # Efficiently fetch all questions and their answers for the quiz
#     questions = Question.objects.filter(quiz_id=selectedQuiz).prefetch_related('answers')

#     # Map question ids to Question objects for faster lookup
#     question_dict = {q.id: q for q in questions}

#     for answer in answers:
#         question_id = answer.get('question_id')
#         selected_answer_id = answer.get('answer_id')
#         print(question_id)
#         # Validate that the question exists
#         if question_id not in question_dict:
#             return Response({"error": f"Question with id {question_id} not found."}, status=status.HTTP_404_NOT_FOUND)

#         question = question_dict[question_id]
        
#         # Check if the selected answer is correct
#         correct_answer = question.answers.filter(is_correct=True).first()
#         if not correct_answer:
#             return Response({"error": f"No correct answer found for question {question_id}"}, status=status.HTTP_404_NOT_FOUND)

#         # Check if the selected answer matches the correct answer
#         if selected_answer_id == correct_answer.id:
#             correct_answers += 1

#     # Calculate the score (percentage)
#     score = (correct_answers / total_questions) * 100

#     # Optionally, save the progress (e.g., create or update UserQuizProgress record)
#     user_progress, created = UserQuizProgress.objects.update_or_create(
#         learner=learner_instance,
#         quiz=quiz,
#         defaults={'score': score, 'is_completed': True}
#     )

#     # Return the results (score, correct answers, total questions)
#     return Response({
#         'correct_answers': correct_answers,
#         'total_questions': total_questions,
#         'score': score
#     }, status=status.HTTP_200_OK)

class SubmitQuiz(APIView):
    def post(self, request, *args, **kwargs):
        # Get the quiz ID and answers from the request
        quiz_id = request.data.get('quiz_id')
        answers = request.data.get('answers', [])

        # Find the quiz
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({'detail': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)

        # Create a submission entry
        submission = QuizSubmission.objects.create(quiz=quiz)

        # Check answers and calculate score (this is an example, adjust as necessary)
        score = 0
        for answer in answers:
            question_id = answer.get('question_id')
            selected_answer_id = answer.get('answer_id')

            try:
                question = Question.objects.get(id=question_id)
                selected_answer = Answer.objects.get(id=selected_answer_id)

                # Check if the selected answer is correct
                if selected_answer.is_correct:
                    score += 1
            except (Question.DoesNotExist, Answer.DoesNotExist):
                return Response({'detail': 'Invalid question or answer'}, status=status.HTTP_400_BAD_REQUEST)

        # Return the submission details along with the score
        return Response({
            'message': 'Quiz submitted successfully!',
            'score': score,
            'total_questions': len(answers),
            'submission_id': submission.id
        }, status=status.HTTP_201_CREATED)

class GetUserByUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            return Response({'id': user.id})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
# from django.shortcuts import get_object_or_404
class SubmitQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        quiz_id = request.data.get("quiz_id")
        answers = request.data.get("answers")

        # Ensure quiz exists
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found"}, status=404)

        learner = request.user
        score = 0
        question_details = []

        # Loop through answers and calculate score
        for answer in answers:
            question_id = answer['question_id']
            answer_id = answer['answer_id']
            try:
                # Get the question by its ID
                question = Question.objects.get(id=question_id)
                
                # Find the correct answer (where is_correct=True)
                correct_answer = question.answers.filter(is_correct=True).first()

                # Check if the selected answer is correct
                is_correct = correct_answer.id == answer_id
                score += is_correct

                # Serialize answers for this question
                serialized_answers = AnswerSerializer(question.answers.all(), many=True).data

                # Append question details
                question_details.append({
                    'question_id': question.id,
                    'question_text': question.question_text,
                    'selected_answer': answer_id,
                    'correct_answer': correct_answer.id,
                    'is_correct': is_correct,
                    'answers': serialized_answers,  # Include all answers for the question
                })
            except Question.DoesNotExist:
                continue

        # Create attempt entry
        attempt = QuizAttempt.objects.create(
            learner=learner,
            quiz=quiz,
            score=score,
            attempt_date=timezone.now()
        )

        # Serialize attempt data
        attempt_data = QuizAttemptSerializer(attempt).data

        # Prepare response
        response_data = {
            'learner': {
                'id': learner.id,
                'username': learner.username,
                'email': learner.email,
            },
            'quiz': {
                'id': quiz.id,
                'title': quiz.title,
                'score': score,
                'attempt_date': attempt.attempt_date,
            },
            'question_details': question_details,
            'total_attempts': QuizAttempt.objects.filter(learner=learner, quiz=quiz).count(),
            'attempt_info': attempt_data
        }

        return Response(response_data)
    
class LearnerQuizAttemptsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        learner = request.user
        quiz_attempts = QuizAttempt.objects.filter(learner=learner).order_by('-attempt_date')
        serializer = QuizAttemptSerializer(quiz_attempts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)