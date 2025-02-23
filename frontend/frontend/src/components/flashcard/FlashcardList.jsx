import { useState } from "react";

export function FlashcardList({ flashcards, onEditFlashcard, onDeleteFlashcard }) {
  const [editingFlashcardId, setEditingFlashcardId] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleEditSubmit = (flashcardId) => {
    onEditFlashcard(flashcardId, newQuestion, newAnswer);
    setEditingFlashcardId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <h2 className="text-2xl font-semibold mb-4">Flashcards</h2>
      {flashcards.length === 0 ? (
        <div className="alert alert-warning">
          <span>No flashcards available in this deck.</span>
        </div>
      ) : (
        flashcards.map((flashcard) => (
          <div key={flashcard.id} className="card card-compact bg-white shadow-md p-4 transform hover:scale-105 transition-transform">
            <div className="flip-card">
              <div className="flip-card-inner">
                {/* Front of the card (Question) */}
                <div className="flip-card-front p-4 bg-primary text-white rounded-xl">
                  <h3 className="text-lg font-semibold">Q: {flashcard.question}</h3>
                </div>
                {/* Back of the card (Answer) */}
                <div className="flip-card-back p-4 bg-secondary text-white rounded-xl">
                  <p className="text-sm">A: {flashcard.answer}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => {
                  setEditingFlashcardId(flashcard.id);
                  setNewQuestion(flashcard.question);
                  setNewAnswer(flashcard.answer);
                }}
                className="btn btn-warning w-1/2"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteFlashcard(flashcard.id)}
                className="btn btn-error w-1/2"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
