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
import AdvancedNavbar from './AdvancedNavbar';

export const FlashCard = () => {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [flashcards,setFlashcards] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleCreateDeck = (decks) => {
    const newDeck = { ...decks, flashcards_s: [] };
    setDecks((prevDecks) => [...prevDecks, newDeck]);
    console.log(newDeck);
    setSuccessMessage(`Deck "${decks.name}" created successfully!`);
  };

  const handleEditDeck = (deckId, newName) => {
    const updatedDecks = decks.map((deck) =>
      deck.id === deckId ? { ...deck, name: newName } : deck
    );
    setDecks(updatedDecks);
    console.log(updatedDecks);
    setSuccessMessage(`Deck updated successfully!`);
  };

  const handleDeleteDeck = (deckId) => {
    const updatedDecks = decks.filter((deck) => deck.id !== deckId);
    setDecks(updatedDecks);
    setSelectedDeck(null); // Deselect deck if it was deleted
    
  };

  const handleCreateFlashcard = (front, back) => {
    const updatedDecks = decks.map((deck) => {
      if (deck.id === selectedDeck.id) {
        deck.flashcards.push({  front, back });
      }
      return deck;
    });
    setFlashcards(updatedDecks);
  };

  const handleEditFlashcard = (flashcardId, newFront, newBack) => {
    const updatedDecks = decks.map((deck) => {
      if (deck.id === selectedDeck.id) {
        deck.flashcards = deck.flashcards.map((flashcard) =>
          flashcard.id === flashcardId
            ? { ...flashcard, front: newFront, back: newBack }
            : flashcard
        );
      }
      return deck;
    });
    setFlashcards(updatedDecks);
  };

  const handleDeleteFlashcard = (flashcardId) => {
    const updatedDecks = decks.map((deck) => {
      if (deck.id === selectedDeck.id) {
        deck.flashcards = deck.flashcards.filter((flashcard) => flashcard.id !== flashcardId);
      }
      return deck;
    });
    setFlashcards(updatedDecks);
  };

  return (
    <>
    <AdvancedNavbar/>
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-primary mb-6">Flashcard App</h1>

      {/* Create Deck Form */}
      <div className="mb-8">
        <CreateDeckForm onCreateDeck={handleCreateDeck}  />
         {/* Render success message */}
      {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>}
      
     {/* Deck List and selected deck-related operations */}
    <div className="mb-6">
      <DeckList
        decks={decks}
        onCreateDeck={handleCreateDeck}
        onSelectDeck={setSelectedDeck}
        onEditDeck={handleEditDeck}
        onDeleteDeck={handleDeleteDeck}
      />
    </div>

    {/* Render Flashcard form and list only if a deck is selected */}
    {selectedDeck && (
      <>
        <div className="mb-8">
          <CreateFlashcardForm onCreateFlashcard={handleCreateFlashcard} />
        </div>

        <div>
          <FlashcardList
            flashcards={flashcards}
            onCreateFlashcard={handleCreateFlashcard}
            onEditFlashcard={handleEditFlashcard}
            onDeleteFlashcard={handleDeleteFlashcard}
          />
        </div>
      </>
    )}
  </div>

      {/* {selectedDeck && (
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
      )} */}
    </div></>
  );
};
