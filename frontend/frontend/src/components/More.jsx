import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import TranscriptionAudio from './TranscriptionAudio';
import AdvancedNavbar from './AdvancedNavbar';
import TextToSpeech from './TextToSpeech';

export const More = () => {
    const [activeTab, setActiveTab] = useState(1); 
    const [text, setText] = useState("");
    const [summary, setSummary] = useState("");
    const [error, setError] = useState("");
    const [speechFile, setSpeechFile] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [textSpeech,setTextSpeech] = useState("");

// Function to handle the change of text in the textarea
  const handleTextSpeechChange = (e) => {
    setTextSpeech(e.target.value);
  };
  // Function to handle the change of text in the textarea
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send the POST request to Django backend
      const response = await axios.post("http://localhost:8000/summarize/", { text });

      // If successful, set the summary from the response data
      setSummary(response.data.summary);
      setError(""); // Clear any previous errors
    } catch (err) {
      // If error occurs, show the error message
      setError("Failed to summarize the text.");
      console.error(err);
    }
  };

  const handleSubmitText = async (e) => {
    e.preventDefault();
    if (!textSpeech) {
      setError('Please enter some text.');
      return;
    }

    try {
      setIsLoading(true);
      // Send the text as an object with the key 'myfile' (to match backend expectation)
      const response = await axios.post('http://localhost:8000/text-to-speech/', {
        textSpeech, // Adjusting to match what backend expects
      });
      console.log(response.data);
      
      setSpeechFile(response.data.file_path);  // Corrected to use `file_path` from response
      setError('');
    } catch (error) {
      setError('Error converting text to speech: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

    return (
      <>
       {<AdvancedNavbar/>}
        <div className=" bg-gray-100 py-8 px-6">
          <div className="w-full max-w-screen-xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Tabs */}
            <div className="flex mb-6">
              <button
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setActiveTab(1)}
              >
                Transcription
              </button>
              <button
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setActiveTab(2)}
              >
                Text-to-Audio
              </button>
              <button
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setActiveTab(3)}
              >
                Summarization
              </button>
            </div>
  
            {/* Page 1 Content */}
            {activeTab === 1 && (
             <main className=" items-center justify-center bg-gray-100 py-8 px-6">
             <TranscriptionAudio/>
           </main>
            )}
  
            {/* Page 2 Content */}
            {activeTab === 2 && (
              <main className=" items-center justify-center bg-gray-100 py-12 px-6">
                {/* <div className=" flex flex-col items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-lg p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-primary">Text-to-Speech</h1>

               <div>
          <h2 className="text-xl font-semibold mt-8 text-primary">Convert Text to Speech</h2>
          <form onSubmit={handleSubmitText} className="space-y-4">
            <div className="form-control">
              <textarea
                onChange={handleTextSpeechChange}
                value={textSpeech}
                placeholder="Enter text..."
                className="textarea textarea-bordered w-full"
              />
            </div>
            <button type="submit" className={`btn ${isLoading ? 'loading' : ''} btn-primary w-full`}>Convert to Speech</button>
          </form>

          {speechFile && (
  <div className="mt-4">
    <p>Audio file is ready!</p>
    <audio controls className="mt-2">
      <source src={`http://localhost:8000${speechFile}`} type="audio/mp3" />
    </audio>
  </div>
)}
        </div>{/* Error Message */}
        {/* {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div> */} <TextToSpeech/>
            </main>
          
            )}
            {/* Page 3 Content */}
            {activeTab === 3 && (
              
              <div className="flex flex-col items-center justify-center bg-gray-100 py-10 mb-12">
      <div className="w-full max-w-2xl p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-primary">Japanese Text Summarization</h1>

        {/* Form for user input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={handleTextChange}
            rows="6"
            className="textarea textarea-bordered w-full"
            placeholder="Enter Japanese text here..."
          />
          <button
            type="submit"
            className={`btn ${isLoading ? 'loading' : ''} btn-primary w-full`}
          >
            Summarize
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Display the summary */}
        {summary && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Summary:</h2>
            <p className="p-4 border rounded-lg bg-gray-50">{summary}</p>
          </div>
        )}
      </div>
    </div>
          
          
            )}
           
           
            
          </div>
        </div>
      </>
    );
}
