from translate import Translator
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth import login ,logout
import speech_recognition as sr
from rest_framework.decorators import api_view, permission_classes
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
# import pyttsx3
from django.conf import settings
from tempfile import NamedTemporaryFile


@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
import json

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


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({"message": "Logged in successfully", "user": {"username": user.username}})
    return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# def logout_view(request):
#     logout(request)
#     return Response({"message": "Logged out successfully"})

# @api_view(['POST'])
# def check_user(request):
#     if request.user.is_authenticated:
#         return Response({"user": {"username": request.user.username}})
#     return Response({"user": None})

@api_view(['POST'])
def logout_view(request):
    print(f"Request user: {request.user}")# Ensure the user is authenticated
    if request.user.is_authenticated:
        
        logout(request)  # Logs out the user by clearing the session
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
    return Response({"message": "User not authenticated"}, status=status.HTTP_400_BAD_REQUEST)

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

from PyPDF2 import PdfReader
from django.http import JsonResponse

from googletrans import Translator
from googletrans import Translator
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
# Helper function to generate PDF with translated text
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

# Initialize TTS model
# tts = TTS(model_name="tts_models/japanese/tacotron2-DDC", gpu=False)

import os

# @csrf_exempt
# def generate_audio(request):
#     if request.method == 'POST':
#         try:
#             # Retrieve the Japanese text input
#             text = request.POST.get('text', '').strip()
            
#             if not text:
#                 return JsonResponse({'error': 'No text provided'}, status=400)
            
#             # Initialize the pyttsx3 engine
#             engine = pyttsx3.init()
            
#             # Set Japanese voice (assuming you have it installed in your system)
#             jp_voiceid = "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech\\Voices\\Tokens\\TTS_MS_JA-JP_HARUKA_11.0"
#             engine.setProperty('voice', jp_voiceid)
            
#             # Set output file path
#             output_file_path = os.path.join('media', 'speech.mp3')
            
#             # Generate the speech and save to file
#             engine.save_to_file(text, output_file_path)
#             engine.runAndWait()

#             # Return the URL of the generated audio file
#             audio_url = f'http://127.0.0.1:8000/media/speech.mp3'
#             return JsonResponse({'message': 'Audio file is ready!', 'audio_file': audio_url})

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request'}, status=400)