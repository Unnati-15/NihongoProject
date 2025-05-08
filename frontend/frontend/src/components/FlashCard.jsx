
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

      
    </div></>
  );
};
