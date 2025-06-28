from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('', views.apiOverview, name="api-overview"),
    path('word/today/', views.word_of_the_day),
    path('phrase/today/', views.phrase_of_the_day),
    path('grammar/correct/', views.correct_grammar),
    path('journals/submit/', views.submit_journal, name="submit-journal"),
    path('register/', views.register_user),
    path('login/', views.login_user),
    path('logout/', views.logout_user),
    path('chat/', views.chat_with_ai),
    path('progress/', views.get_progress, name="user-progress"),
    path('list_journals/', views.list_journals, name="list-journals"),
    path('list_words/', views.list_words, name="list-words"),
    path('list_phrases/', views.list_phrases, name="list-phrases"),
]
