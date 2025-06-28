from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Word
from .models import Phrase
from .models import JournalEntry
from .models import UserProgress
from .serializers import WordSerializer
from .serializers import PhraseSerializer
from .serializers import JournalEntrySerializer
from .serializers import UserProgressSerializer
from datetime import date
import requests
import random
import json
import openai
import os
from dotenv import load_dotenv
load_dotenv()

# openai.api_key = os.getenv("OPENAI_API_KEY")


# Create your views here.

@api_view(['GET'])
def apiOverview(request):
    return Response({
        "Word of Day": "/api/word/today/",
        "Diary Entry": "/api/diary/submit/",
        "Grammar Check": "/api/grammar/check/",
    })


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def word_of_the_day(request):
    today = date.today()
    progressObject=None
    if(request.user.is_authenticated):
        user = request.user
        progressObject, _ = UserProgress.objects.get_or_create(user=user)

    existing_word = Word.objects.filter(date_added=today).first()
    if existing_word:
        # ✅ EVEN if word exists, update progress
        if request.user.is_authenticated and progressObject and existing_word not in progressObject.seen_words.all():
            progressObject.seen_words.add(existing_word)
            progressObject.refresh_from_db() #to get the updated count
            progressObject.words_learned = progressObject.seen_words.count()
            progressObject.save()
        return Response(WordSerializer(existing_word).data)

    # Otherwise fetch and create new word
    with open("word_pool.json", 'r') as f:
        WORD_POOL = json.load(f)
        word_text = random.choice(WORD_POOL)
        api_url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word_text}"

    try:
        res = requests.get(api_url, timeout=5)
        data = res.json()

        definition = data[0]["meanings"][0]["definitions"][0]["definition"]
        examples = []
        for meaning in data[0]["meanings"]:
            for d in meaning["definitions"]:
                if "example" in d:
                    examples.append(d["example"])
                if len(examples) == 3:
                    break
            if len(examples) == 3:
                break

        word = Word.objects.create(
            text=word_text,
            meaning=definition,
            examples=examples or ["No example available."]
        )
        
        if(request.user.is_authenticated and progressObject):
            progressObject.seen_words.add(word)
            progressObject.refresh_from_db() #to get the updated count
            progressObject.words_learned = progressObject.seen_words.count()
            progressObject.save()

        return Response(WordSerializer(word).data)

    except Exception as e:
        return Response({"error": f"Failed to fetch word: {str(e)}"}, status=500)



# sign up
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})



# login
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})

# logout
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    request.user.auth_token.delete()  # 🔐 Deletes the token
    return Response({"message": "Logged out successfully."})


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def phrase_of_the_day(request):
    today = date.today()
    progress=None
    if(request.user.is_authenticated):
        user = request.user
        progress, _ = UserProgress.objects.get_or_create(user=user)

    existing_phrase = Phrase.objects.filter(date_added=today).first()
    if existing_phrase:
        if request.user.is_authenticated and progress and existing_phrase not in progress.seen_phrases.all():
            progress.seen_phrases.add(existing_phrase)
            progress.refresh_from_db() #to get the updated count
            progress.phrases_practiced = progress.seen_phrases.count()
            progress.save()
        return Response(PhraseSerializer(existing_phrase).data)

    with open("phrase_pool.json", 'r') as f:
        PHRASE_POOL = json.load(f)
        phrase_data = random.choice(PHRASE_POOL)

    phrase = Phrase.objects.create(
        text=phrase_data["text"],
        meaning=phrase_data["meaning"],
        examples=phrase_data["examples"],
        context=phrase_data["context"]
    )

    if(request.user.is_authenticated and progress):
        progress.seen_phrases.add(phrase)
        progress.refresh_from_db() #to get the updated count (after adding, if we do not refresh the db, the previous db might not reflect changes)
        progress.phrases_practiced = progress.seen_phrases.count()
        progress.save()

    return Response(PhraseSerializer(phrase).data)

@api_view(['POST'])
def correct_grammar(request):
    user_text = request.data.get("text", "")
    if not user_text:
        return Response({"error": "Text is required."}, status=400)

    url = "https://api.textgears.com/grammar"
    params = {
        "text": user_text,
        "language": "en-GB",
        "key": "UsVUx5ZN79KdMM4a"  # 🔑 Replace with your actual key (text gears api key)
    }

    response = requests.get(url, params=params)
    data = response.json()

    corrected_text = list(user_text)  # will modify this list
    for error in reversed(data.get("response", {}).get("errors", [])):
        offset = error["offset"]
        length = error["length"]
        replacement = error["better"][0] if error["better"] else user_text[offset:offset+length]
        corrected_text[offset:offset+length] = replacement

    final_output = ''.join(corrected_text)

    return Response({
        "original": user_text,
        "corrected": final_output,
        "issues": data.get("response", {}).get("errors", [])
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_journal(request):
    user = request.user
    # user=User.objects.first()
    text = request.data.get("text", "")

    if not text:
        return Response({"error": "Text is required."}, status=400)

    # Call grammar correction API
    url = "https://api.textgears.com/grammar"
    params = {
        "text": text,
        "language": "en-GB",
        "key": "UsVUx5ZN79KdMM4a"
    }

    res = requests.get(url, params=params)
    data = res.json()

    corrected = list(text)
    for err in reversed(data.get("response", {}).get("errors", [])):
        offset = err["offset"]
        length = err["length"]
        suggestion = err["better"][0] if err["better"] else text[offset:offset+length]
        corrected[offset:offset+length] = suggestion

    corrected_text = ''.join(corrected)
    num_errors = len(data.get("response", {}).get("errors", []))

    feedback = f"✅ Your entry is saved. We found {num_errors} improvement(s). Keep writing regularly!"

    journal = JournalEntry.objects.create(
        user=user,
        text=text,
        corrected_text=corrected_text,
        feedback=feedback
    )

    progress, _ = UserProgress.objects.get_or_create(user=request.user)
    progress.journals_written += 1
    progress.save()

        

    return Response(JournalEntrySerializer(journal).data)
       

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_with_ai(request):
    user_message = request.data.get("message")
    if not user_message:
        return Response({"error": "No message provided."}, status=400)

    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
    }

    data = {
        "model": "openai/gpt-3.5-turbo",  # You can try others like mistralai/mixtral-8x7b
        "messages": [
            {"role": "user", "content": user_message}
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)

    if response.status_code != 200:
        return Response({"error": response.text}, status=response.status_code)

    reply = response.json()['choices'][0]['message']['content']

    progress, _ = UserProgress.objects.get_or_create(user=request.user)
    progress.conversations_done += 1
    progress.save()

    return Response({
        "user": user_message,
        "assistant": reply
    })
print("OPENROUTER_API_KEY =", os.getenv("OPENROUTER_API_KEY"))



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progress(request):
    user = request.user
    progress, _ = UserProgress.objects.get_or_create(user=user)
    return Response({
        'words_learned': progress.words_learned,
        'phrases_practiced': progress.phrases_practiced,
        'conversations_done': progress.conversations_done,
        'journals_written': progress.journals_written,
        'last_updated': progress.last_updated,
    })

# To list journals, words and phrases so far

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_journals(request):
    journals = JournalEntry.objects.filter(user=request.user).order_by('-date_created')
    return Response(JournalEntrySerializer(journals, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_words(request):
    progress, _ = UserProgress.objects.get_or_create(user=request.user)
    words = progress.seen_words.all().order_by('text')
    return Response(WordSerializer(words, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_phrases(request):
    progress, _ = UserProgress.objects.get_or_create(user=request.user)
    phrases = progress.seen_phrases.all().order_by('text')
    return Response(PhraseSerializer(phrases, many=True).data)