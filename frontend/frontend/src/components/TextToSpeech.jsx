import { useState } from 'react';
import axios from 'axios';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isJapaneseText = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー々〆〤]/gu.test(text);

    if (!text.trim()) {
      setError('Please enter some Japanese text.');
      return;
    } else if (!isJapaneseText) {
      setError('Please enter valid Japanese text.');
      return;
    } else {
      setError('');
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/generate_audio/', new URLSearchParams({ text }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.audio_file) {
        setAudioUrl(response.data.audio_file);
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setError('Error generating audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6">Japanese Text-to-Speech</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            rows="4"
            cols="50"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter Japanese text here..."
            className="textarea textarea-bordered w-full p-4 text-lg"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn ${isLoading ? 'btn-primary loading' : 'btn-primary'}`}
          >
            {isLoading ? 'Generating Audio...' : 'Generate Audio'}
          </button>
          <button
            type="button"
            onClick={() => { setText(''); setAudioUrl(''); setError(''); }}
            disabled={isLoading}
            className="btn btn-error"
          >
            Clear
          </button>
        </div>
      </form>

      {isLoading && <div className="spinner-border mx-auto mt-6"></div>}

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      {audioUrl && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold">Audio Ready!</h3>
          <audio controls className="w-full mt-4">
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
