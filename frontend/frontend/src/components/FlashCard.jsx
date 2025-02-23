// // src/components/Flashcards.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FlashCard = ({ token, deckId }) => {
//   const [flashcards, setFlashcards] = useState([]);
//   const [newFlashcard, setNewFlashcard] = useState({
//     front: '',
//     back: '',
//   });

//   useEffect(() => {
//     const fetchFlashcards = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/flashcards/${deckId}/`, {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });
//         setFlashcards(response.data);
//       } catch (error) {
//         console.error('Error fetching flashcards:', error);
//       }
//     };
//     fetchFlashcards();
//   }, [deckId, token]);

//   const handleCreateFlashcard = async (e) => {
//     e.preventDefault();
//     if (!newFlashcard.front || !newFlashcard.back) return;

//     try {
//       const response = await axios.post(
//         `http://localhost:8000/api/flashcards/${deckId}/`,
//         newFlashcard,
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       setFlashcards((prev) => [...prev, response.data]);
//       setNewFlashcard({ front: '', back: '' });
//     } catch (error) {
//       console.error('Error creating flashcard:', error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-semibold mb-4">Flashcards</h2>

//       <div className="space-y-4">
//         {flashcards.map((flashcard) => (
//           <div key={flashcard.id} className="card bg-base-100 shadow-md p-4">
//             <h3 className="font-semibold">Front: {flashcard.front}</h3>
//             <p>Back: {flashcard.back}</p>
//           </div>
//         ))}
//       </div>

//       <div className="mt-8">
//         <h3 className="text-xl">Create New Flashcard</h3>
//         <form onSubmit={handleCreateFlashcard} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Front"
//             className="input input-bordered w-full"
//             value={newFlashcard.front}
//             onChange={(e) => setNewFlashcard({ ...newFlashcard, front: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Back"
//             className="input input-bordered w-full"
//             value={newFlashcard.back}
//             onChange={(e) => setNewFlashcard({ ...newFlashcard, back: e.target.value })}
//           />
//           <button className="btn btn-primary w-full">Add Flashcard</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FlashCard;
import React, { useState } from 'react';
import { CreateDeckForm } from './flashcard/CreateDeckForm';
import { DeckList } from './flashcard/DeckList';
import { CreateFlashcardForm } from './flashcard/CreateFlashcardForm';
import { FlashcardList } from './flashcard/FlashcardList';

export const FlashCard = () => {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  const handleCreateDeck = (deckName) => {
    const newDeck = { id: Date.now(), name: deckName, flashcards: [] };
    setDecks([...decks, newDeck]);
  };

  const handleEditDeck = (deckId, newName) => {
    const updatedDecks = decks.map((deck) =>
      deck.id === deckId ? { ...deck, name: newName } : deck
    );
    setDecks(updatedDecks);
  };

  const handleDeleteDeck = (deckId) => {
    const updatedDecks = decks.filter((deck) => deck.id !== deckId);
    setDecks(updatedDecks);
    setSelectedDeck(null); // Deselect deck if it was deleted
  };

  const handleCreateFlashcard = (question, answer) => {
    const updatedDecks = decks.map((deck) => {
      if (deck.id === selectedDeck.id) {
        deck.flashcards.push({ id: Date.now(), question, answer });
      }
      return deck;
    });
    setDecks(updatedDecks);
  };

  const handleEditFlashcard = (flashcardId, newQuestion, newAnswer) => {
    const updatedDecks = decks.map((deck) => {
      if (deck.id === selectedDeck.id) {
        deck.flashcards = deck.flashcards.map((flashcard) =>
          flashcard.id === flashcardId
            ? { ...flashcard, question: newQuestion, answer: newAnswer }
            : flashcard
        );
      }
      return deck;
    });
    setDecks(updatedDecks);
  };

  const handleDeleteFlashcard = (flashcardId) => {
    const updatedDecks = decks.map((deck) => {
      if (deck.id === selectedDeck.id) {
        deck.flashcards = deck.flashcards.filter((flashcard) => flashcard.id !== flashcardId);
      }
      return deck;
    });
    setDecks(updatedDecks);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-primary mb-6">Flashcard App</h1>

      {/* Create Deck Form */}
      <div className="mb-8">
        <CreateDeckForm onCreateDeck={handleCreateDeck} />
      </div>

      {/* Display Decks */}
      <div className="mb-6">
        <DeckList
          decks={decks}
          onSelectDeck={setSelectedDeck}
          onEditDeck={handleEditDeck}
          onDeleteDeck={handleDeleteDeck}
        />
      </div>

      {selectedDeck && (
        <>
          <div className="mb-8">
            <CreateFlashcardForm onCreateFlashcard={handleCreateFlashcard} />
          </div>

          <div>
            <FlashcardList
              flashcards={selectedDeck.flashcards}
              onEditFlashcard={handleEditFlashcard}
              onDeleteFlashcard={handleDeleteFlashcard}
            />
          </div>
        </>
      )}
    </div>
  );
};
