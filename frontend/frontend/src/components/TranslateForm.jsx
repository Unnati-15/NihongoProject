import React from 'react';
import { useState } from 'react';
import FileUpload from "./FileUpload";

const TranslateForm = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [fromLanguage, setFromLanguage] = useState("");
  const [toLanguage, setToLanguage] = useState("");
  const [textToTranslate, setTextToTranslate] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const languages = [
    { code: "en", name: "English" },
    { code: "ja", name: "Japanese" },
  ];
  const handleTranslation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make a POST request to your Django API
      const response = await axios.post("http://localhost:8000/translate/", {
        text: textToTranslate,
        from_language: fromLanguage,
        to_language: toLanguage,
      });

      // Set translated text in the state
      setTranslatedText(response.data.translation);
    } catch (error) {
      // Handle errors (e.g., network errors)
      setError("There was an error translating the text.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
    return (
      <>
       
        <div className=" bg-gray-100 py-8 px-6">
          <div className="w-full max-w-screen-xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Tabs */}
            <div className="flex mb-6">
              <button
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setActiveTab(1)}
              >
                Text Translation
              </button>
              <button
                className={`px-4 py-2 w-1/2 text-center ${activeTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setActiveTab(2)}
              >
                PDF Translation
              </button>
            </div>
  
            {/* Page 1 Content */}
            {activeTab === 1 && (
             <main>
             <div className="container mx-auto max-w-3xl p-4"> 
             <form onSubmit={handleTranslation} method="post">
               {/* From Language Select */}
               <div className="mb-4"> {/* Reduced margin */}
                 <label htmlFor="fromlanguage" className="block text-base font-semibold mb-1"> {/* Reduced font size */}
                   Choose to translate from Language
                 </label>
                 <select
                   id="fromlanguage"
                   name="fromlanguage"
                   value={fromLanguage}
                   onChange={(e) => setFromLanguage(e.target.value)}
                   required
                   className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
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
               <div className="mb-4"> {/* Reduced margin */}
                 <label htmlFor="translate" className="block text-base font-semibold mb-1"> {/* Reduced font size */}
                   Enter your text here
                 </label>
                 <textarea
                   id="translate"
                   name="translate"
                   value={textToTranslate}
                   onChange={(e) => setTextToTranslate(e.target.value)}
                   placeholder="Enter your text here"
                   rows="3"
                   className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                 ></textarea>
               </div>
           
               {/* To Language Select */}
               <div className="mb-4"> {/* Reduced margin */}
                 <label htmlFor="tolanguage" className="block text-base font-semibold mb-1"> {/* Reduced font size */}
                   Choose to translate to Language
                 </label>
                 <select
                   id="tolanguage"
                   name="tolanguage"
                   value={toLanguage}
                   onChange={(e) => setToLanguage(e.target.value)}
                   required
                   className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
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
               <div className="mb-4"> {/* Reduced margin */}
                 <button
                   type="submit"
                   className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                   disabled={loading}
                 >
                   {loading ? "Translating..." : "Translate"}
                 </button>
               </div>
           
               {/* Display Error */}
               {error && <div className="text-red-500 mb-2 text-sm">{error}</div>} {/* Reduced error text size */}
           
               {/* Translated Text Area */}
               <div className="mb-4"> {/* Reduced margin */}
                 <label htmlFor="translated-text" className="block text-base font-semibold mb-1"> {/* Reduced font size */}
                   Translated Text
                 </label>
                 <textarea
                   id="translated-text"
                   name="translated-text"
                   value={translatedText}
                   placeholder="Translated text will appear here..."
                   rows="3" 
                   className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                   disabled
                 ></textarea>
               </div>
             </form>
           
             {/* Loading Overlay (optional) */}
             {loading && (
               <div className="absolute inset-0 bg-gray-800 opacity-50 flex justify-center items-center">
                 <div className="text-white font-semibold">Translating...</div>
               </div>
             )}
           </div>
         </main>
         
            )}
  
            {/* Page 2 Content */}
            {activeTab === 2 && (
              <FileUpload/>
          
            )}
            
            
          </div>
        </div>
      </>
    );
}
export default TranslateForm;