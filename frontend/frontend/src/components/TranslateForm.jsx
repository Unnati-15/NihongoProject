import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';
import { FaLanguage, FaFilePdf } from 'react-icons/fa'; 

const TranslateForm = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [fromLanguage, setFromLanguage] = useState('');
  const [toLanguage, setToLanguage] = useState('');
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ja', name: 'Japanese' },
  ];

  const handleTranslation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/translate/', {
        text: textToTranslate,
        from_language: fromLanguage,
        to_language: toLanguage,
      });

      setTranslatedText(response.data.translation);
    } catch (error) {
      setError('There was an error translating the text.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-slate-100 via-slate-100 to-slate-100 py-12 px-6 mb-20">
        <div className="w-full max-w-screen-xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Tabs */}
          <div className="flex mb-8 justify-center">
            <button
              className={`px-6 py-3 w-1/2 text-center rounded-t-lg ${activeTab === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'} flex justify-center items-center space-x-2`}
              onClick={() => setActiveTab(1)}
            >
              <FaLanguage className="text-lg" />
              <span>Text Translation</span>
            </button>
            <button
              className={`px-6 py-3 w-1/2 text-center rounded-t-lg ${activeTab === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'} flex justify-center items-center space-x-2`}
              onClick={() => setActiveTab(2)}
            >
              <FaFilePdf className="text-lg" />
              <span>PDF Translation</span>
            </button>
          </div>

          {/* Text Translation Tab */}
          {activeTab === 1 && (
            <div className="container mx-auto max-w-3xl p-4">
              <form onSubmit={handleTranslation}>
                {/* From Language Select */}
                <div className="mb-6">
                  <label htmlFor="fromlanguage" className="block text-lg font-medium text-gray-800 mb-2">Choose from Language</label>
                  <select
                    id="fromlanguage"
                    name="fromlanguage"
                    value={fromLanguage}
                    onChange={(e) => setFromLanguage(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select a language</option>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Textarea for Text to Translate */}
                <div className="mb-6">
                  <label htmlFor="translate" className="block text-lg font-medium text-gray-800 mb-2">Enter text to translate</label>
                  <textarea
                    id="translate"
                    name="translate"
                    value={textToTranslate}
                    onChange={(e) => setTextToTranslate(e.target.value)}
                    placeholder="Type your text here..."
                    rows="5"
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  ></textarea>
                </div>

                {/* To Language Select */}
                <div className="mb-6">
                  <label htmlFor="tolanguage" className="block text-lg font-medium text-gray-800 mb-2">Choose to Language</label>
                  <select
                    id="tolanguage"
                    name="tolanguage"
                    value={toLanguage}
                    onChange={(e) => setToLanguage(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select a language</option>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Translate Button */}
                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>Translating...</span>
                    ) : (
                      <span>Translate</span>
                    )}
                  </button>
                </div>

                {/* Display Error */}
                {error && (
                  <div className="text-red-500 mb-4 text-center text-sm font-medium">{error}</div>
                )}

                {/* Translated Text Area */}
                {translatedText && (
                  <div className="mb-6">
                    <label htmlFor="translated-text" className="block text-lg font-medium text-gray-800 mb-2">Translated Text</label>
                    <textarea
                      id="translated-text"
                      name="translated-text"
                      value={translatedText}
                      placeholder="Translated text will appear here..."
                      rows="5"
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm shadow-md bg-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      disabled
                    ></textarea>
                  </div>
                )}
              </form>

              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-gray-800 opacity-50 flex justify-center items-center">
                  <div className="text-white font-semibold text-xl">Translating...</div>
                </div>
              )}
            </div>
          )}

          {/* PDF Translation Tab */}
          {activeTab === 2 && <FileUpload />}
        </div>
      </div>
    </>
  );
};

export default TranslateForm;
