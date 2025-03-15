from uuid import uuid4
from translate import Translator
from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import User
from .serializers import UserRegistrationSerializer
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth import login ,logout
import speech_recognition as sr
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PyPDF2 import PdfReader
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from googletrans import Translator
from django.http import JsonResponse, FileResponse
import pyttsx3
from django.conf import settings
from tempfile import NamedTemporaryFile
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from sudachipy import tokenizer
from sudachipy import dictionary
from collections import Counter
from rest_framework.views import APIView

# Registration API
@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# Translate text API
@api_view(['POST'])
def translate(request):
    if request.method == "POST":
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            text = data.get("text")
            from_language = data.get("from_language")
            to_language = data.get("to_language")
            
            # Perform translation using googletrans
            translated_text = perform_translation(text, from_language, to_language)
            
            return JsonResponse({"translation": translated_text})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

def perform_translation(text, from_lang, to_lang):
    # Create a Translator object
    translator = Translator()
    
    # Translate the text using the Google Translate API
    translation = translator.translate(text, src=from_lang, dest=to_lang)
    
    # Return the translated text
    return translation.text

# Login API
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({"message": "Logged in successfully", "user": {"username": user.username}})
    return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# Logout API
@api_view(['POST'])
def logout_view(request):
    print(f"Request user: {request.user}")# Ensure the user is authenticated
    if request.user.is_authenticated:
        
        logout(request)  # Logs out the user by clearing the session
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
    return Response({"message": "User not authenticated"}, status=status.HTTP_400_BAD_REQUEST)


# Transcription API
@api_view(['POST'])
def transcribe_audio(request):
    """ Handle audio file for transcription """
    r = sr.Recognizer()
    text = ""

    if 'myfilest' not in request.FILES:
        return Response({"error": "No audio file provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        myfilest = request.FILES['myfilest']
        audio_file = sr.AudioFile(myfilest)
        with audio_file as source:
            audio_data = r.record(source)

        try:
            text = r.recognize_google(audio_data, language="ja-JP")
            return Response({"transcription": text}, status=status.HTTP_200_OK)
        except sr.UnknownValueError:
            return Response({"error": "Google Speech Recognition could not understand the audio"}, status=status.HTTP_400_BAD_REQUEST)
        except sr.RequestError as e:
            return Response({"error": f"Could not request results from Google Speech Recognition service; {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except Exception as e:
        return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# PDF Translation API
def pdf_japanese_to_english(text):
     if not text.strip():
        return "Error: Empty text provided for translation."
     try:
        translator = Translator()
        translated_text = translator.translate(text, src='ja', dest='en').text
        return translated_text
     except Exception as e:
        print(f"Error during translation: {str(e)}")
        return f"Error during translation: {str(e)}"
def pdf_english_to_japanese(text):
     if not text.strip():
        return "Error: Empty text provided for translation."
     try:
        translator = Translator()
        translated_text = translator.translate(text, src='en', dest='ja').text
        return translated_text
     except Exception as e:
        print(f"Error during translation: {str(e)}")
        return f"Error during translation: {str(e)}"
@csrf_exempt
def jp_translate_pdf_en(request):
    if request.method == 'POST' and request.FILES.get('pdf'):
        pdf_file = request.FILES['pdf']
        pdf_reader = PdfReader(pdf_file)

        text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"
            else:
                print(f"Warning: No text found on page {page_num + 1}")
        
        if not text:
            return JsonResponse({"error": "No text found in PDF."}, status=400)

        translation = pdf_japanese_to_english(text)
        
        if translation:
            # Generate PDF with translated text
            pdf_buffer = generate_pdf_from_text(translation)

            # Return the new PDF as a response
            response = HttpResponse(pdf_buffer, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="jp-translated-en.pdf"'
            return response
        else:
            return JsonResponse({"error": "Error during translation."}, status=500)
    
    return JsonResponse({"error": "Invalid request."}, status=400)
@csrf_exempt
def en_translate_pdf_jp(request):
    if request.method == 'POST' and request.FILES.get('pdf'):
        pdf_file = request.FILES['pdf']
        pdf_reader = PdfReader(pdf_file)

        text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"
            else:
                print(f"Warning: No text found on page {page_num + 1}")
        
        if not text:
            return JsonResponse({"error": "No text found in PDF."}, status=400)

        translation = pdf_english_to_japanese(text)
        
        if translation:
            # Generate PDF with translated text
            pdf_buffer = generate_pdf_from_text(translation)

            # Return the new PDF as a response
            response = HttpResponse(pdf_buffer, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="en-translated-jp.pdf"'
            return response
        else:
            return JsonResponse({"error": "Error during translation."}, status=500)
    
    return JsonResponse({"error": "Invalid request."}, status=400)
def generate_pdf_from_text(translated_text):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Set the font and size for the translated text
    c.setFont("Helvetica", 12)
    text_object = c.beginText(40, height - 40)
    text_object.setFont("Helvetica", 12)
    text_object.setTextOrigin(40, height - 40)

    # Add the translated text to the PDF, wrapping text to fit the page width
    lines = translated_text.split("\n")
    for line in lines:
        text_object.textLine(line)
    
    c.drawText(text_object)
    c.showPage()
    c.save()

    buffer.seek(0)
    return buffer


# Summarization API
# Initialize Sudachipy tokenizer
tokenizer_obj = dictionary.Dictionary().create()

@api_view(['POST'])
def summarize_text(request):
    # Get text from the request data
    text = request.data.get('text', '')

    if not text:
        return Response({"error": "No text provided"}, status=400)

    # Tokenize the text
    mode = tokenizer.Tokenizer.SplitMode.C
    tokens = tokenizer_obj.tokenize(text, mode)

    # Extract nouns, verbs, and adjectives (filtering based on part of speech)
    nouns = [token.surface() for token in tokens if token.part_of_speech()[0] == '名詞']
    verbs = [token.surface() for token in tokens if token.part_of_speech()[0] == '動詞']
    adjectives = [token.surface() for token in tokens if token.part_of_speech()[0] == '形容詞']

    # Count frequency of each noun, verb, and adjective
    noun_counts = Counter(nouns)
    verb_counts = Counter(verbs)
    adj_counts = Counter(adjectives)

    # Split the text into sentences based on '。' (full stop)
    sentences = [sentence.strip() for sentence in text.split("。") if len(sentence.strip()) > 0]

    # Rank sentences based on the frequency of important words (nouns, verbs, adjectives)
    sentence_scores = []

    for sentence in sentences:
        sentence_tokens = tokenizer_obj.tokenize(sentence, mode)
        
        # Extract nouns, verbs, and adjectives from the sentence
        sentence_nouns = [token.surface() for token in sentence_tokens if token.part_of_speech()[0] == '名詞']
        sentence_verbs = [token.surface() for token in sentence_tokens if token.part_of_speech()[0] == '動詞']
        sentence_adjectives = [token.surface() for token in sentence_tokens if token.part_of_speech()[0] == '形容詞']
        
        # Calculate sentence score based on frequency of nouns, verbs, and adjectives
        score = (
            sum([noun_counts.get(noun, 0) for noun in sentence_nouns]) + 
            sum([verb_counts.get(verb, 0) for verb in sentence_verbs]) + 
            sum([adj_counts.get(adj, 0) for adj in sentence_adjectives])
        )
        
        # Append sentence with its score
        sentence_scores.append((sentence, score))

    # Sort sentences by score in descending order (higher score is more important)
    sorted_sentences = sorted(sentence_scores, key=lambda x: x[1], reverse=True)

    # Select the top N sentences (you can adjust N)
    top_n_sentences = 3
    summary_sentences = [sentence for sentence, score in sorted_sentences[:top_n_sentences]]

    # Join the top sentences to create the summary
    summary = "。".join(summary_sentences) + "。"

    return Response({"summary": summary})


# Text to Speech API
import os
class TextToSpeechView(APIView):
    def post(self, request):
        # Get text from request data (expecting 'myfile' as the key from the frontend)
        textSpeech = request.data.get("textSpeech", None)
        print(textSpeech)
        if not textSpeech:
            return Response({"error": "Text parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Initialize the pyttsx3 engine
            engine = pyttsx3.init()

            # Set the Japanese voice (e.g., Microsoft Haruka)
            jp_voiceid = "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech\\Voices\\Tokens\\TTS_MS_JA-JP_HARUKA_11.0"
            engine.setProperty('voice', jp_voiceid)

            # Set speech rate (slower than the default 200)
            rate = engine.getProperty('rate')
            engine.setProperty('rate', rate - 50)  # Adjust rate if necessary

            # Create a temporary file to store the generated speech
            with NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
                temp_filename = temp_file.name
                # Use pyttsx3 to save speech to the file
                engine.save_to_file(textSpeech, temp_filename)

                # Run the engine to process the speech
                engine.runAndWait()

            # Return the path to the generated file (this is what the frontend expects)
            # Make the file accessible through a URL path (for example: /media/{file_name}.mp3)
            media_url = f"/media/{os.path.basename(temp_filename)}"

            # Store the file in your media folder (optional, depending on your setup)
            media_file_path = os.path.join(settings.MEDIA_ROOT, os.path.basename(temp_filename))
            os.rename(temp_filename, media_file_path)

            return JsonResponse({
                "file_path": media_url  # Send the media URL to the frontend
            })

        except Exception as e:
            return Response({"error": f"Error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# GET USERNAME API
@api_view(['GET'])
def check_username(request, username):
    try:
        user = User.objects.get(username=username)
        print(user)
        return Response({'isAvailable': False})
    except User.DoesNotExist:
        return Response({'isAvailable': True})
    

# Set up the engine (pyttsx3 initialization)
engine = pyttsx3.init()
 # Set the Japanese voice (e.g., Microsoft Haruka)
jp_voiceid = "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech\\Voices\\Tokens\\TTS_MS_JA-JP_HARUKA_11.0"
engine.setProperty('voice', jp_voiceid)

            # Set speech rate (slower than the default 200)
rate = engine.getProperty('rate')
engine.setProperty('rate', rate - 50)

class TextToSpeechView(APIView):
    def post(self, request, *args, **kwargs):
        # Deserialize the incoming data
        text = request.data.get("text", None)
        print(text)
            
        if not text.strip():
            return Response({'error': 'Text cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a unique filename for the audio
        audio_filename = f"{uuid4().hex}.mp3"
        audio_file_path = os.path.join(settings.MEDIA_ROOT, 'audio', audio_filename)

        try:
                # Ensure the audio directory exists
                audio_dir = os.path.join(settings.MEDIA_ROOT, 'audio')
                os.makedirs(audio_dir, exist_ok=True)  # Create the directory if it doesn't exist

                # Save the speech to the file
                engine.save_to_file(text, audio_file_path)
                engine.runAndWait()

                # Return the URL to the generated audio file
                audio_url = f"http://localhost:8000/media/audio/{audio_filename}"

                return Response({'audio_file': audio_url}, status=201)

        except Exception as e:
                return Response({'error': f'Error generating audio: {str(e)}'}, status=500)

