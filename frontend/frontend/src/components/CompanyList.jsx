
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompanyNavbar from './CompanyNavbar';

const CompanyList = () => {
  const [postings, setPostings] = useState([]);
  const [job_title, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language_needed, setLanguageNeeded] = useState('');
  const [location, setLocation] = useState('');
  const [date_time, setDateTime] = useState('');
  const [status, setStatus] = useState('');
  const [posted_at, setPostedAt] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);  // To differentiate between Add and Edit modes
  const [currentPostId, setCurrentPostId] = useState(null); // Store current entry ID for edit


  useEffect(() => {
    const fetchPosting = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/job_posting/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          }
        });

        if (response.status === 200) {
          setPostings(response.data);
        }
      } catch (error) {
        console.error('Error fetching postings', error);
      }
    };

      fetchPosting();  
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (job_title && description && language_needed && location && date_time && status && posted_at) {
      try {
        let response;
        const postData = { job_title, description, language_needed, location, date_time, status:status.toLowerCase(), posted_at };
        console.log('Sending Data:', postData); // Log data
  
        if (isEditMode) {
          response = await axios.put(`http://localhost:8000/api/job_posting/${currentPostId}/`, postData, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
            },
          });
        } else {
          response = await axios.post('http://localhost:8000/api/job_posting/', postData, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
            },
          });
        }
  
        console.log('Response:', response); // Log response
  
        if (response.status === 200 || response.status === 201) {
          const data = response.data;
          if (isEditMode) {
            setPostings(postings.map(posts => (posts.id === currentPostId ? data : posts)));
          } else {
            setPostings([...postings, data]);
          }
          resetForm();
        } else {
          setError({ message: 'Error while saving the post.' });
        }
      } catch (error) {
        console.error('Error submitting the post:', error);
        setError({ message: error.response ? error.response.data : 'Something went wrong. Please try again later.' });
      }
    } else {
      setError({ message: 'All fields are required.' });
    }
  };
  

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/job_posting/${postId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setPostings(postings.filter(posts => posts.id !== postId));  
      } else {
        const errorData = await response.json();
        setError(errorData);
      }
    } catch (error) {
      setError({ message: 'Error deleting post' });
    }
  };

  const openEditModal = (posts) => {
    console.log(posts.job_title);
    setJobTitle(posts.job_title);
    setDescription(posts.description);
    setLanguageNeeded(posts.language_needed);
    setLocation(posts.location);
    setDateTime(posts.date_time);
    setStatus(posts.status);
    setPostedAt(posts.posted_at);
    setCurrentPostId(posts.id);
    setIsEditMode(true); // Set to edit mode
    setIsModalOpen(true); // Open the modal
  };
  

  const resetForm = () => {
    setJobTitle('');
    setDescription('');
    setLanguageNeeded('');
    setLocation('');
    setDateTime('');
    setStatus('');
    setPostedAt('');
    setIsModalOpen(false); // Close modal
    setIsEditMode(false); // Reset edit mode
    setCurrentPostId(null); // Reset current post ID
    setError(null); // Clear any error
  };
  
  return (
    <>
      <CompanyNavbar />
      <div className="max-w-3xl mx-auto p-8  rounded-lg shadow-lg mt-10 mb-40 overflow-hidden bg-yellow-100">
        <h1 className="text-3xl font-semibold text-center mb-8">Job Posts</h1>

        <div className="mb-8 max-h-[60vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Your Entries:</h2>
          <ul className="space-y-4">
            {postings.length > 0 ? (
              postings.map(posts => (
                <li key={posts.id} className="p-6 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold">{posts.job_title}</h3>
                  <p className="mt-2 text-lg">{posts.description}</p>
                  <h3 className="text-xl font-bold">{posts.language_needed}</h3>
                  <h3 className="text-xl font-bold">{posts.location}</h3>
                  <h3 className="text-xl font-bold">{posts.date_time}</h3>
                  <h3 className="text-xl font-bold">{posts.status}</h3>
                  <small className="block mt-2 text-sm text-gray-500">
                    Created on: {posts.posted_at}
                  </small>

                  {/* Edit and Delete buttons */}
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => openEditModal(posts)}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(posts.id)}
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-lg text-gray-500">No posts found.</p>
            )}
          </ul>
        </div>

        {/* Button to open the modal */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            Add New Post
          </button>
        </div>

        {/* Modal for adding a new diary entry */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-semibold mb-4">{isEditMode ? 'Edit Post' : 'Add New Post'}</h3>

              <form onSubmit={handleSubmit}>
  <div className="flex flex-wrap -mx-2 mb-4">
    {/* Job Title */}
    <div className="w-full md:w-1/2 px-2 mb-4">
      <div className="form-control">
        <label htmlFor="title" className="label">
          <span className="label-text text-lg">Title</span>
        </label>
        <input
          type="text"
          id="job_title"
          value={job_title}
          onChange={(e) => setJobTitle(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Job Title"
          required
        />
      </div>
    </div>

    {/* Description */}
    <div className="w-full md:w-1/2 px-2 mb-4">
      <div className="form-control">
        <label htmlFor="content" className="label">
          <span className="label-text text-lg">Description</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          placeholder="Write your job description here..."
          required
        />
      </div>
    </div>
  </div>

  <div className="flex flex-wrap -mx-2 mb-4">
    {/* Language Needed */}
    <div className="w-full md:w-1/2 px-2 mb-4">
      <div className="form-control">
        <label htmlFor="content" className="label">
          <span className="label-text text-lg">Language Needed</span>
        </label>
        <input
          type="text"
          id="language_needed"
          value={language_needed}
          onChange={(e) => setLanguageNeeded(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Write language required..."
          required
        />
      </div>
    </div>

    {/* Location */}
    <div className="w-full md:w-1/2 px-2 mb-4">
      <div className="form-control">
        <label htmlFor="content" className="label">
          <span className="label-text text-lg">Location</span>
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Write your location here.."
          required
        />
      </div>
    </div>
  </div>

  <div className="flex flex-wrap -mx-2 mb-4">
    {/* Date and Time */}
    <div className="w-full md:w-1/2 px-2 mb-4">
      <div className="form-control">
        <label htmlFor="content" className="label">
          <span className="label-text text-lg">Date and Time</span>
        </label>
        <input
          type="datetime-local"
          id="date_time"
          value={date_time}
          onChange={(e) => setDateTime(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
    </div>

    {/* Status */}
    <div className="w-full md:w-1/2 px-2 mb-4">
      <div className="form-control">
        <label htmlFor="content" className="label">
          <span className="label-text text-lg">Status</span>
        </label>
        <input
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
    </div>
  </div>

  <div className="flex flex-wrap -mx-2 mb-4">
    {/* Created At */}
    <div className="w-full md:w-1/2 px-2 mb-4">
      <div className="form-control">
        <label htmlFor="content" className="label">
          <span className="label-text text-lg">Created At</span>
        </label>
        <input
          type="datetime-local"
          id="date_time"
          value={posted_at}
          onChange={(e) => setPostedAt(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
    </div>
  </div>

  <div className="flex justify-between">
    <button type="submit" className="btn btn-primary w-full">
      {isEditMode ? 'Update Post' : 'Add Post'}
    </button>
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

export default CompanyList;
