import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8000/'; // Replace with your backend API URL

// Function to get the authorization token from localStorage (or wherever you store it)
const getAuthToken = () => {
  return localStorage.getItem('token'); // Assuming the token is stored in localStorage
};

const FlashcardApp = () => {
  const [decks, setDecks] = useState([]); // State to store decks
  const [flashcards, setFlashcards] = useState([]); // State to store flashcards of selected deck
  const [selectedDeck, setSelectedDeck] = useState(null); // State for selected deck
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch all decks when the component mounts
  useEffect(() => {
    const token = getAuthToken(); // Get the auth token
    const headers = token ? { Authorization: `Token ${token}` } : {}; // Set headers if token is available

    // Fetch all decks
    axios
      .get(`${API_URL}/flashcard_decks/`, { headers })
      .then((response) => {
        setDecks(response.data); // Set decks to state
        setLoading(false); // Stop loading once decks are fetched
      })
      .catch((err) => {
        setError('Error fetching decks. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Fetch flashcards for the selected deck
  const handleDeckSelect = (deckId) => {
    setSelectedDeck(deckId); // Set the selected deck
    setFlashcards([]); // Clear any previously loaded flashcards
    setLoading(true); // Set loading while fetching flashcards

    const token = getAuthToken(); // Get the auth token
    const headers = token ? { Authorization: `Token ${token}` } : {}; // Set headers if token is available

    // Fetch flashcards for the selected deck
    axios
      .get(`${API_URL}/flashcard_app/${deckId}/`, { headers })
      .then((response) => {
        setFlashcards(response.data); // Set the flashcards to state
        setLoading(false); // Stop loading once flashcards are fetched
      })
      .catch((err) => {
        setError('Error fetching flashcards. Please try again later.');
        setLoading(false);
      });
  };

  // Render loading message
  if (loading) {
    return <div className="text-center text-xl text-primary p-8">Loading...</div>;
  }

  // Render error message if there's an error
  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8 bg-slate-100 mb-12">
      <h1 className="text-4xl font-semibold text-center mb-8 text-primary">Flashcard App</h1>

      {/* Display Decks */}
      {selectedDeck === null ? (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-8">Select a Deck to Learn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 text-center">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="card card-bordered bg-base-100 shadow-xl rounded-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">{deck.title}</h2>
                  <p className="text-xl text-gray-600">{deck.description}</p>
                </div>
                <button
                  onClick={() => handleDeckSelect(deck.id)}
                  className="btn btn-primary mt-4 w-80 mx-auto text-center text-xl font-semibold "
                >
                  View Flashcards
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Display Flashcards for the selected deck
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Flashcards for {decks.find((deck) => deck.id === selectedDeck)?.title}
          </h2>
          <button onClick={() => setSelectedDeck(null)} className="btn btn-primary mb-2 text-xl font-semibold">
            Back to Decks
          </button>
          <Link to='/flashcard'><button className="btn btn-primary mb-8 text-xl font-semibold ml-40">
            Want to create one? Click Me!
          </button></Link>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-60 mb-32">
            {flashcards.map((flashcard) => (
              <div key={flashcard.id} className="flip-card relative w-64 h-9 ">
                <div className="flip-card-inner">
    {/* Front side of the card */}
    <div className="flip-card-front bg-base-200 p-3 rounded-lg shadow-lg flex justify-center items-center font-semibold overflow-hidden">
      <pre className="text-lg text-center break-words">{flashcard.front}</pre>
    </div>

    {/* Back side of the card */}
    <div className="flip-card-back bg-primary text-white p-3 rounded-lg shadow-lg flex justify-center items-center font-semibold overflow-hidden">
      <pre className="text-lg text-center break-words">{flashcard.back}</pre>
    </div>
  </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardApp;
