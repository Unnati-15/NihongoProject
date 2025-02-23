import pyttsx3

try:
    # Initialize the pyttsx3 engine
    engine = pyttsx3.init()

    # Set the Japanese voice (e.g., Microsoft Haruka)
    jp_voiceid = "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech\Voices\Tokens\TTS_MS_JA-JP_ICHIRO_11.0"
    engine.setProperty('voice', jp_voiceid)

    # Sample text to speak
    text = "こんにちは！私はロボットです。"

    # Speak the text
    engine.say(text)

    # Run the engine to process the speech
    engine.runAndWait()

except Exception as e:
    print(f"Error occurred: {e}")
