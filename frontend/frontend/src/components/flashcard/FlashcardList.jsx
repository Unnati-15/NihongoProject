import { useState, useEffect } from "react";

export function FlashcardList({ flashcards = [], onEditFlashcard, onDeleteFlashcard }) {
  const [flashcards, setFlashcards] = useState([]);
  const [editingFlashcardId, setEditingFlashcardId] = useState(null);
  const [newFront, setNewFront] = useState('');
  const [newBack,setNewBack] = useState('');
  const [error, setError] = useState(null);
  const [deckId, setDeckId] = useState('');
  const [learnerId, setLearnerId] = useState('');
  const [decks, setDecks] = useState([]);

  // Fetch flashcards from the API
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/flashcards/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,  
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFlashcards(data);  
        } else {
          setError('Failed to load flashcards');
        }
      } catch (error) {
        setError('Error fetching flashcards');
      }
    };

    fetchFlashcards();
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
  const handleEditSubmit = async (flashcardId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/flashcards/${flashcardId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          front: newFront,
          back : newBack,
          deck:deckId,
          learner:learnerId,
        }),
      });

      if (response.ok) {
        const updatedFlashcard = await response.json();
        onEditFlashcard(updatedFlashcard);  // Pass updated deck to parent
        setFlashcards((prevFlashcards) => prevFlashcards.map((flashcard) =>
          flashcard.id === flashcardId ? updatedFlashcard : flashcard
        ));  
        
        setEditingFlashcardId(null);
        setNewFront('');
        setNewBack('');
      } else {
        setError('Failed to update flashcard');
      }
    } catch (error) {
      setError('Error updating flashcard');
    }
  };

  const handleDelete = async (flashcardId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/flashcards/${flashcardId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setFlashcards((prevFlashcards) => prevFlashcards.filter((flashcard) => flashcard.id !== flashcardId)); 
         // Remove deleted deck from the list
      } else {
        setError('Failed to delete flashcard');
      }
    } catch (error) {
      setError('Error deleting flashcard');
    }
  };

  return (
    <div className="px-4 py-8">
  
      {flashcards.length === 0 ? (
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
        <div className="card mt-10 w-96 bg-base-100 shadow-xl p-6 mx-auto ">
          <h3 className="text-xl font-semibold mb-4">Edit Deck</h3>
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
      )}
    </div>
  )};
  