import  { useState } from 'react';
import axios from 'axios';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      setError('Please enter some Japanese text.');
      return;
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
      console.error(err);
      setError('Error generating audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Japanese Text-to-Speech</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            rows="4"
            cols="50"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter Japanese text here..."
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating Audio...' : 'Generate Audio'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {audioUrl && (
        <div>
          <h3>Audio Ready!</h3>
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
