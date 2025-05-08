import { useState, useEffect } from "react";

export function FlashcardList({ onEditFlashcard }) {
  const [flashcards, setFlashcards] = useState([]);
  const [editingFlashcardId, setEditingFlashcardId] = useState(null);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [error, setError] = useState(null);
  const [deckId, setDeckId] = useState('');
  const [learnerId, setLearnerId] = useState('');

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
          console.log('Fetched Flashcards:', data);
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
            'Authorization': `Token ${localStorage.getItem('token')}`, // Assuming you're using JWT for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLearnerId(data.learnerId); // Set the learner ID to the logged-in user's ID
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
    const fetchDeckId = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/current-deck/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`, // Assuming you're using JWT for authentication
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDeckId(data.deckId); // Set the decks list to the fetched data
        } else {
          setError({ message: 'Failed to fetch deck information' });
        }
      } catch (error) {
        setError({ message: 'Error fetching deck data' });
      }
    };

    fetchDeckId();
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
          back: newBack,
          deck: deckId,
          learner: learnerId,
        }),
      });

      if (response.ok) {
        const updatedFlashcard = await response.json();
        onEditFlashcard(updatedFlashcard); // Pass updated deck to parent
        setFlashcards((prevFlashcards) =>
          prevFlashcards.map((flashcard) =>
            flashcard.id === flashcardId ? updatedFlashcard : flashcard
          )
        );

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
        setFlashcards((prevFlashcards) =>
          prevFlashcards.filter((flashcard) => flashcard.id !== flashcardId)
        ); // Remove deleted deck from the list
      } else {
        setError('Failed to delete flashcard');
      }
    } catch (error) {
      setError('Error deleting flashcard');
    }
  };

  console.log('Flashcards state:', flashcards);
  console.log('newFront:', newFront);
  console.log('newBack:', newBack);
  console.log('deckId:', deckId);
  console.log('learnerId:', learnerId);
  console.log('editing', editingFlashcardId);

  return (
    <div>
      
      {flashcards.length === 0 ? (
        <div className="alert alert-warning">
          <span>No flashcards available in this deck.</span>
        </div>
      ) : (
        <div className="overflow-x-auto ml-80 mr-80 shadow-md sm:rounded-lg mb-30">
        <table className="min-w-full table-auto border-separate border-spacing-0 w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-6 py-3 text-center text-2xl font-semibold">Flashcards</th>
              <th className="px-6 py-3 text-center text-2xl font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flashcards.map((flashcard) => (
              <tr key={flashcard.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-center text-xl font-medium text-gray-900">
                  <div className="flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front p-4 bg-primary text-white rounded-xl">
                        <h3 className="text-lg font-semibold">Q: {flashcard.front}</h3>
                      </div>
                      <div className="flip-card-back p-4 bg-secondary text-white rounded-xl">
                        <p className="text-sm">A: {flashcard.back}</p>
                      </div>
                      
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 text-center text-xl font-medium text-gray-900">
                <div className="flip-card">
                  <button
                    onClick={() => {
                      setEditingFlashcardId(flashcard.id);
                      setNewFront(flashcard.front);
                      setNewBack(flashcard.back);
                    }}
                    className="btn btn-warning w-20 space-x-20"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(flashcard.id)}
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
      {editingFlashcardId && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="card w-96 bg-base-100 shadow-xl p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mb-4">Edit Flashcard</h3>
        <button 
          onClick={() => setEditingFlashcardId(null)} 
          className="text-xl font-semibold text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={newFront}
          onChange={(e) => setNewFront(e.target.value)}
          className="input input-bordered w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Deck Name"
        />
        <input
          type="text"
          value={newBack}
          onChange={(e) => setNewBack(e.target.value)}
          className="input input-bordered w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Deck Description"
        />
        <button
          onClick={() => handleEditSubmit(editingFlashcardId)}
          className="btn btn-primary mt-2 w-full py-3 text-lg font-semibold hover:bg-primary-focus"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
