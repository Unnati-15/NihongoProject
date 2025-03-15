"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# backend/urls.py
from django.contrib import admin
from django.urls import path,include
from backend import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
# from flashcard.views import FlashcardViewSet
from flashcardapp.views import FlashcardAppViewSet, FlashcardDeckViewSet
from quiz_app.views import AnswerViewSet, LearnerQuizAttemptsView, LevelViewSet,CategoryViewSet,QuizViewSet,QuestionViewSet, SubmitQuiz,GetUserByUsernameView, SubmitQuizView
from writeapp.views import WriteappViewSet
from users.views import UserRegistrationView, UserLogoutView,UserLoginView
from learner.views import LearnerRegistrationView
from .views import TextToSpeechView
from flashcard.views import CreateDeckAPIView, FlashcardViewSet,GetCurrentDeckAPIView, GetCurrentUserAPIView,DeckViewSet,CreateFlashcardAPIView

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'decks', DeckViewSet,basename='deck')
router.register(r'flashcards',FlashcardViewSet,basename='flashcard')
router.register(r'write', WriteappViewSet,basename='write')
router.register(r'levels', LevelViewSet,basename='level')
router.register(r'categories', CategoryViewSet,basename='category')
router.register(r'levels/(?P<level_id>\d+)/categories',CategoryViewSet,basename='levelwise-category-list')
router.register(r'levels/(?P<level_id>\d+)/categories/(?P<category_id>\d+)/quizzes',QuizViewSet,basename='categorywise-quiz-list')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'answers',AnswerViewSet,basename='answer')
# router.register(r'flashcards', FlashcardViewSet,basename='flashcard')
# router.register(r'decks', DeckViewSet,basename='deck')
# Define nested routes for quiz -> question -> answer
quiz_question_answer_router = DefaultRouter()
quiz_question_answer_router.register(
    r'levels/(?P<level_id>\d+)/categories/(?P<category_id>\d+)/quizzes/(?P<quiz_id>\d+)/questions', 
    QuestionViewSet, 
    basename='quiz-questions'
)
quiz_question_answer_router.register(
    r'quizzes/(?P<quiz_id>\d+)/questions/(?P<question_id>\d+)/answers', 
    AnswerViewSet, 
    basename='question-answers'
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include(quiz_question_answer_router.urls)),
    path('flashcard_decks/', FlashcardDeckViewSet.as_view(), name='flashcard_deck_list'),
    path('flashcard_app/<int:deck_id>/', FlashcardAppViewSet.as_view(), name='flashcard_app_list'),
    path('check-username/<str:username>/', views.check_username, name='check-username'),
    path('translate/',views.translate),
    path('decks/create/',CreateDeckAPIView.as_view(),name = 'deck-create'),
    path('flashcards/create/',CreateFlashcardAPIView.as_view(),name = 'flashcard-create'),

    # path('api/decks/', DeckListView.as_view(), name='deck-list'),  # List decks
    # path('api/decks/create/', CreateDec.as_view(), name='deck-create'),  # Create deck
    # path('api/decks/<int:id>/', DeckDetailView.as_view(), name='deck-detail'),  # Retrieve specific deck
    # path('register/',views.register_user),
    # path('login/',views.login_view),
    # path('api/quizzes/<int:quiz_id>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('text-to-speech/', TextToSpeechView.as_view(), name='text_to_speech'),
    path('transcribe/',views.transcribe_audio),
    path('current-user/', GetCurrentUserAPIView.as_view(), name='current-user'),
    path('current-deck/',GetCurrentDeckAPIView.as_view(),name='current-deck'),
    path('submit-quiz/', SubmitQuizView.as_view(), name='submit_quiz'),
    path('user_by_username/<str:username>/', GetUserByUsernameView.as_view(), name='get_user_by_username'),
    path('learner-quiz-attempts/', LearnerQuizAttemptsView.as_view(), name='learner-quiz-attempts'),
    # path('flashcard/', FlashCardList.as_view(), name='flashcard-list'),  # GET and POST
    # path('flashcard/<int:pk>/', FlashCardDetail.as_view(), name='flashcard-detail'),  # GET, PUT, DELETE
    # path('logout/',logout_view),

    # path('registerusers/',RegisterView),
    # path('loginusers/',LoginView),
    # path('api/grammar/check/', GrammarCorrectionView.as_view(), name='check_grammar'),
     path('jp_translate-pdf_en/', views.jp_translate_pdf_en),
     path('en_translate-pdf_jp/', views.en_translate_pdf_jp),
     path('summarize/', views.summarize_text, name='summarize_text'),
     path('generate_audio/', TextToSpeechView.as_view(),name='generate_audio'),
    # path('', include(router.urls)),
    #path('text-to-speech/', views.textspeech),
    


    path('api/auth/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/auth/login/', UserLoginView.as_view(), name='user-login'),
    path('api/auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('api/auth/register/learner/', LearnerRegistrationView.as_view(), name='learner-registration'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)