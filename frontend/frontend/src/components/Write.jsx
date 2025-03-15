import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvancedNavbar from './AdvancedNavbar';

const Write = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [learnerId, setLearnerId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);  // To differentiate between Add and Edit modes
  const [currentEntryId, setCurrentEntryId] = useState(null); // Store current entry ID for edit

  // Fetch the learnerId (current logged-in user)
  useEffect(() => {
    const fetchLearnerId = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/current-user/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
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

  useEffect(() => {
    // Fetch all diary entries for the current learner
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/write/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          }
        });

        if (response.status === 200) {
          // Filter entries based on learnerId
          const learnerEntries = response.data.filter(entry => entry.learner === learnerId);
          setDiaryEntries(learnerEntries);
        }
      } catch (error) {
        console.error('Error fetching diary entries', error);
      }
    };

    if (learnerId) {
      fetchEntries();  // Fetch entries only if learnerId is available
    }
  }, [learnerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && content && learnerId) {
      try {
        let response;
        const entryData = { title, content, learner: learnerId };

        if (isEditMode) {
          // Update entry if in edit mode
          response = await fetch(`http://localhost:8000/api/write/${currentEntryId}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(entryData),
          });
        } else {
          // Create new entry if not in edit mode
          response = await fetch('http://localhost:8000/api/write/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(entryData),
          });
        }

        if (response.ok) {
          const data = await response.json();
          if (isEditMode) {
            // Update the diaryEntries array with the modified entry
            setDiaryEntries(diaryEntries.map(entry => (entry.id === currentEntryId ? data : entry)));
          } else {
            // Add new entry to the list
            setDiaryEntries([...diaryEntries, data]);
          }
          resetForm();
        } else {
          const errorData = await response.json();
          setError(errorData);
        }
      } catch (error) {
        setError({ message: 'Something went wrong. Please try again later.' });
      }
    }
  };

  const handleDelete = async (entryId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/write/${entryId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setDiaryEntries(diaryEntries.filter(entry => entry.id !== entryId));  // Remove deleted entry from state
      } else {
        const errorData = await response.json();
        setError(errorData);
      }
    } catch (error) {
      setError({ message: 'Error deleting entry' });
    }
  };

  const openEditModal = (entry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setCurrentEntryId(entry.id);
    setIsEditMode(true); // Set edit mode to true
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setIsModalOpen(false);
    setIsEditMode(false); // Reset to add mode after submit
    setCurrentEntryId(null);
    setError(null);
  };

  return (
    <>
      <AdvancedNavbar />
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 mb-40 overflow-hidden">
        <h1 className="text-3xl font-semibold text-center mb-8">Practice Writing</h1>

        <div className="mb-8 max-h-[60vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Your Entries:</h2>
          <ul className="space-y-4">
            {diaryEntries.length > 0 ? (
              diaryEntries.map(entry => (
                <li key={entry.id} className="p-6 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold">{entry.title}</h3>
                  <p className="mt-2 text-lg">{entry.content}</p>
                  <small className="block mt-2 text-sm text-gray-500">
                    Created on: {new Date(entry.created_at).toLocaleString()}
                  </small>

                  {/* Edit and Delete buttons */}
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => openEditModal(entry)}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-lg text-gray-500">No entries found.</p>
            )}
          </ul>
        </div>

        {/* Button to open the modal */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            Add New Entry
          </button>
        </div>

        {/* Modal for adding a new diary entry */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-semibold mb-4">{isEditMode ? 'Edit Entry' : 'Add New Entry'}</h3>

              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label htmlFor="title" className="label">
                    <span className="label-text text-lg">Title</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Entry Title"
                    required
                  />
                </div>

                <div className="form-control mb-4">
                  <label htmlFor="content" className="label">
                    <span className="label-text text-lg">Content</span>
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="textarea textarea-bordered w-full"
                    placeholder="Write your entry here..."
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <button type="submit" className="btn btn-primary w-full">{isEditMode ? 'Update Entry' : 'Add Entry'}</button>
                  <button
                    type="button"
                    className="btn btn-ghost w-full"
                    onClick={resetForm} // Close modal
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {error && <div className="mt-4 text-red-500">{error.message}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Adding a scrollbar for the entire page if content exceeds screen */}
      <style>
        {`
          body {
            overflow-y: auto;
          }
        `}
      </style>
    </>
  );
};

export default Write;
