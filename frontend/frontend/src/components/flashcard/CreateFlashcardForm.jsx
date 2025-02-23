import React, { useState } from 'react';

export function CreateFlashcardForm({ onCreateFlashcard }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onCreateFlashcard(question, answer);
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl p-6 mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Flashcard</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <input
            type="text"
            placeholder="Enter Question"
            className="input input-bordered w-full"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div className="form-control">
          <input
            type="text"
            placeholder="Enter Answer"
            className="input input-bordered w-full"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success w-full">Add Flashcard</button>
      </form>
    </div>
  );
}
