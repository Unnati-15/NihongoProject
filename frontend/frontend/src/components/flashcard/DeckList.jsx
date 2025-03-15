import { useState, useEffect } from "react";

export function DeckList({ onSelectDeck, onEditDeck, onDeleteDeck }) {
  const [decks, setDecks] = useState([]);
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [deckName, setDeckName] = useState('');
  const [deckDescription,setDeckDescription] = useState('');
  const [error, setError] = useState(null);
  const [learnerId, setLearnerId] = useState('');

  // Fetch decks from the API
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/decks/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,  
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDecks(data);  // Set decks from API response
        } else {
          setError('Failed to load decks');
        }
      } catch (error) {
        setError('Error fetching decks');
      }
    };

    fetchDecks();
  }, []);
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
  const handleEditSubmit = async (deckId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/decks/${deckId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: deckName,
          description : deckDescription,
          learner:learnerId,
        }),
      });

      if (response.ok) {
        const updatedDeck = await response.json();
        onEditDeck(updatedDeck);  // Pass updated deck to parent
        setDecks((prevDecks) => prevDecks.map((deck) =>
          deck.id === deckId ? updatedDeck : deck
        ));  
        
        setEditingDeckId(null);
        setDeckName('');
        setDeckDescription('');
      } else {
        setError('Failed to update deck');
      }
    } catch (error) {
      setError('Error updating deck');
    }
  };

  const handleDelete = async (deckId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/decks/${deckId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId)); 
         // Remove deleted deck from the list
      } else {
        setError('Failed to delete deck');
      }
    } catch (error) {
      setError('Error deleting deck');
    }
  };

  return (
    <div className="px-4 py-8">
  
      {decks.length === 0 ? (
        <div className="alert alert-info text-center">
          <span>No decks available. Create a new deck!</span>
        </div>
      ) : (
        <div className="overflow-x-auto ml-80 mr-80 shadow-md sm:rounded-lg">
          <table className="min-w-full table-auto border-separate border-spacing-0 w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-6 py-3 text-center text-2xl font-semibold">Deck Name</th>
                <th className="px-6 py-3 text-center text-2xl font-semibold">Deck Description</th>
                {/* <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {decks.map((deck) => (
                <tr key={deck.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-center text-xl font-medium text-gray-900">{deck.name}</td>
                  <td className="px-6 py-4 text-center text-xl font-medium text-gray-900">{deck.description}</td>
                  
                  <td className="px-6 py-4 text-center text-2xl">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onSelectDeck(deck)}
                        className="btn btn-outline w-28 hover:bg-primary hover:text-white transition-colors duration-200"
                      >
                        Open Deck
                      </button>
                      <button
                        onClick={() => {
                          setEditingDeckId(deck.id);
                          setDeckName(deck.name);
                          setDeckDescription(deck.description);
                        }}
                        className="btn btn-warning w-20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(deck.id)}
                        className="btn btn-error w-20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  
      {/* Edit Form */}
{editingDeckId && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="card w-96 bg-base-100 shadow-xl p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mb-4">Edit Deck</h3>
        <button 
          onClick={() => setEditingDeckId(null)} 
          className="text-xl font-semibold text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          className="input input-bordered w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Deck Name"
        />
        <input
          type="text"
          value={deckDescription}
          onChange={(e) => setDeckDescription(e.target.value)}
          className="input input-bordered w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Deck Description"
        />
        <button
          onClick={() => handleEditSubmit(editingDeckId)}
          className="btn btn-primary mt-2 w-full py-3 text-lg font-semibold hover:bg-primary-focus"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )};
  