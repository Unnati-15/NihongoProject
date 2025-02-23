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
from flashcard.views import FlashcardViewSet
# from quiz_app.views import LevelViewSet,CategoryViewSet,QuizViewSet,QuestionViewSet,submit_quiz,GetUserByUsernameView
from users.views import UserRegistrationView, UserLogoutView,UserLoginView
from learner.views import LearnerRegistrationView
from flashcard.views import DeckCreateView, DeckListView, DeckDetailView


# Create a router and register our viewsets
router = DefaultRouter()
# router.register(r'levels', LevelViewSet)
# router.register(r'categories/(?P<level_id>\d+)', CategoryViewSet, basename='category')
# router.register(r'quizzes/(?P<category_id>\d+)', QuizViewSet, basename='quiz')
# router.register(r'questions/(?P<quiz_id>\d+)', QuestionViewSet, basename='question')
router.register(r'flashcards', FlashcardViewSet,basename='flashcard')
# router.register(r'decks', DeckViewSet,basename='deck')



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('translate/',views.translate),
    path('api/decks/', DeckListView.as_view(), name='deck-list'),  # List decks
    path('api/decks/create/', DeckCreateView.as_view(), name='deck-create'),  # Create deck
    path('api/decks/<int:id>/', DeckDetailView.as_view(), name='deck-detail'),  # Retrieve specific deck
    # path('register/',views.register_user),
    # path('login/',views.login_view),
    # path('api/quizzes/<int:quiz_id>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('transcribe/',views.transcribe_audio),
    # path('submit-quiz/<int:selectedQuiz>/',submit_quiz),
    # path('user_by_username/<str:username>/', GetUserByUsernameView.as_view(), name='get_user_by_username'),
    # path('flashcard/', FlashCardList.as_view(), name='flashcard-list'),  # GET and POST
    # path('flashcard/<int:pk>/', FlashCardDetail.as_view(), name='flashcard-detail'),  # GET, PUT, DELETE
    # path('logout/',logout_view),

    # path('registerusers/',RegisterView),
    # path('loginusers/',LoginView),
     path('jp_translate-pdf_en/', views.jp_translate_pdf_en),
     path('en_translate-pdf_jp/', views.en_translate_pdf_jp),
    #  path('generate_audio/', views.generate_audio),
    # path('', include(router.urls)),
    #path('text-to-speech/', views.textspeech),
    


    path('api/auth/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/auth/login/', UserLoginView.as_view(), name='user-login'),
    path('api/auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('api/auth/register/learner/', LearnerRegistrationView.as_view(), name='learner-registration'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
