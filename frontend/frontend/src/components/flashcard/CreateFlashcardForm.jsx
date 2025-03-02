import React, { useState, useEffect } from 'react';

export function CreateFlashcardForm({ onCreateFlashcard }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [deckId, setDeckId] = useState('');
  const [learnerId, setLearnerId] = useState('');
  const [decks, setDecks] = useState([]); // To store the list of decks
  const [error, setError] = useState(null);

  // Fetch the learnerId (current logged-in user)
  useEffect(() => {
    const fetchLearnerId = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/current-user/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,  // Assuming you're using JWT for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLearnerId(data.learnerId);  // Set the learner ID to the logged-in user's ID
        } else {
          setError({ message: 'Failed to fetch learner information' });
        }
      } catch (error) {
        setError({ message: 'Error fetching user data' });
      }
    };

    fetchLearnerId();
  }, []);

  // Fetch the available decks for the learner
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/decks/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,  // Assuming you're using JWT for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDecks(data);  // Set the decks list to the fetched data
        } else {
          setError({ message: 'Failed to fetch deck information' });
        }
      } catch (error) {
        setError({ message: 'Error fetching deck data' });
      }
    };

    fetchDecks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (front.trim() && back.trim() && deckId && learnerId) {
      try {
        const response = await fetch('http://127.0.0.1:8000/flashcards/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,  // Send the token for authentication
          },
          body: JSON.stringify({
            front: front,
            back: back,
            deck: deckId,  // Send the selected deckId
            learner: learnerId,  
          }),
        });

        if (response.ok) {
          const data = await response.json();
          onCreateFlashcard({ front: data.front, back: data.back });
          setFront('');
          setBack('');
          setDeckId('');
          setError(null);
          
        } else {
          const errorData = await response.json();
          setError(errorData);
        }
      } catch (error) {
        setError({ message: 'Something went wrong. Please try again later.' });
      }
    } else {
      setError({ message: 'Please fill out all fields.' });
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Flashcard</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <input
            type="text"
            placeholder="Enter Front"
            className="input input-bordered w-full"
            value={front}
            onChange={(e) => setFront(e.target.value)}
          />
        </div>
        <div className="form-control">
          <input
            type="text"
            placeholder="Enter Back"
            className="input input-bordered w-full"
            value={back}
            onChange={(e) => setBack(e.target.value)}
          />
        </div>
        <div className="form-control">
          <select
            className="input input-bordered w-full"
            value={deckId}
            onChange={(e) => setDeckId(e.target.value)}
          >
            <option value="">Select Deck</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name} 
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success w-full">Add Flashcard</button>
      </form>
      {error && <div className="mt-4 text-red-500">{error.message}</div>}
    </div>
  );
}
