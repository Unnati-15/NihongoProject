import { useState } from 'react';
import axios from 'axios';

function TranscriptionAudio() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [transcription, setTranscription] = useState('');
  const [speechFile, setSpeechFile] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload an audio file.');
      return;
    }

    const formData = new FormData();
    formData.append('myfilest', file);

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/transcribe/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTranscription(response.data.transcription);
      setError('');
    } catch (error) {
      setError('Error transcribing audio: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitText = async (e) => {
    e.preventDefault();
    if (!text) {
      setError('Please enter some text.');
      return;
    }

    try {
      setIsLoading(true);
      // Send the text as an object with the key 'myfile' (to match backend expectation)
      const response = await axios.post('http://localhost:8000/convert_text_to_speech/', {
        myfile: text, // Adjusting to match what backend expects
      });

      setSpeechFile(response.data.file_path);  // Corrected to use `file_path` from response
      setError('');
    } catch (error) {
      setError('Error converting text to speech: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-lg p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center">Speech-to-Text and Text-to-Speech</h1>

        {/* Speech-to-Text */}
        <div>
          <h2 className="text-xl font-semibold">Upload Audio for Speech-to-Text</h2>
          <form onSubmit={handleSubmitFile} className="space-y-4">
            <div className="form-control">
              <input
                type="file"
                onChange={handleFileChange}
                accept="audio/*"
                className="file-input file-input-bordered w-full"
              />
            </div>
            <button type="submit" className={`btn ${isLoading ? 'loading' : ''} w-full`}>Transcribe</button>
          </form>

          {transcription && <p className="mt-4 text-lg"><strong>Transcription:</strong> {transcription}</p>}
        </div>

        {/* Text-to-Speech */}
        <div>
          <h2 className="text-xl font-semibold mt-8">Convert Text to Speech</h2>
          <form onSubmit={handleSubmitText} className="space-y-4">
            <div className="form-control">
              <textarea
                onChange={handleTextChange}
                value={text}
                placeholder="Enter text..."
                className="textarea textarea-bordered w-full"
              />
            </div>
            <button type="submit" className={`btn ${isLoading ? 'loading' : ''} w-full`}>Convert to Speech</button>
          </form>

          {speechFile && (
            <div className="mt-4">
              <p>Audio file is ready!</p>
              <audio controls className="mt-2">
                <source src={`http://localhost:8000${speechFile}`} type="audio/mp3" />
              </audio>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default TranscriptionAudio;
