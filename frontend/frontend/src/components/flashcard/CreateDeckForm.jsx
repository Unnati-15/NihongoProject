import React, { useState } from 'react';

export function CreateDeckForm({ onCreateDeck }) {
  const [deckName, setDeckName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (deckName.trim()) {
      onCreateDeck(deckName);
      setDeckName('');
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create New Deck</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <input
            type="text"
            placeholder="Enter Deck Name"
            className="input input-bordered w-full"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Create Deck</button>
      </form>
    </div>
  );
}
