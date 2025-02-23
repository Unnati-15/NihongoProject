import { useState } from "react";
export function DeckList({ decks, onSelectDeck, onEditDeck, onDeleteDeck }) {
    const [editingDeckId, setEditingDeckId] = useState(null);
    const [deckName, setDeckName] = useState('');
  
    const handleEditSubmit = (deckId) => {
      onEditDeck(deckId, deckName);
      setEditingDeckId(null);
    };
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <h2 className="text-2xl font-semibold mb-4">Your Decks</h2>
        {decks.length === 0 ? (
          <div className="alert alert-info">
            <span>No decks available. Create a new deck!</span>
          </div>
        ) : (
          decks.map((deck) => (
            <div key={deck.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">{deck.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => onSelectDeck(deck)}
                    className="btn btn-outline w-3/4 hover:bg-primary hover:text-white"
                  >
                    Open Deck
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingDeckId(deck.id);
                        setDeckName(deck.name);
                      }}
                      className="btn btn-warning"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteDeck(deck.id)}
                      className="btn btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
  