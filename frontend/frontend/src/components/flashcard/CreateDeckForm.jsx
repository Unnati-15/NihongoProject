import React, { useState, useEffect } from 'react';

export function CreateDeckForm({ onCreateDeck }) {
  const [deckName, setDeckName] = useState('');
  const [description, setDescription] = useState('');
  const [learnerId, setLearnerId] = useState('');
  const [error, setError] = useState(null);

  // Fetch the learnerId (current logged-in user)
  useEffect(() => {
    const fetchLearnerId = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/current-user/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
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

  

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (deckName.trim() && description.trim() && learnerId) {
      try {
        const response = await fetch('http://127.0.0.1:8000/decks/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            name: deckName,
            description: description,
            learner: learnerId,  // Send learnerId in the request body
          }),
        });

        if (response.ok) {
          const data = await response.json();
          onCreateDeck({ name: data.name, description: data.description });
          setDeckName('');
          setDescription('');
          setError(null); 
        } else {
          const errorData = await response.json();
          setError(errorData);  // Set error response if any
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
      <h2 className="text-xl font-semibold mb-4">Create New Deck</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <input
            type="text"
            id='deckName'
            name='deckName'
            placeholder="Enter Deck Name"
            className="input input-bordered w-full"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
        </div>
        <div className="form-control">
          <input
            type="text"
            id='description'
            name='description'
            placeholder="Enter Description"
            className="input input-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Create Deck</button>
      </form>
      {error && <div className="mt-4 text-red-500">{error.message}</div>}
    </div>
  );
}
