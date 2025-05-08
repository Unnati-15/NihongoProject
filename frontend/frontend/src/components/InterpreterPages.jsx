import React, { useState, useEffect } from 'react';
import InterpreterNavbar from './InterpreterNavbar';

export const InterpreterPages = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobPost, setSelectedJobPost] = useState(null); // Selected job post data
  const [companyDetails, setCompanyDetails] = useState(null); // Company details data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [isLoadingCompany, setIsLoadingCompany] = useState(false); // Loading state for company details

  // Fetch data from the API
  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/job_posts/');
        const data = await response.json();
        setJobPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job posts:', error);
        setLoading(false);
      }
    };

    fetchJobPosts();
  }, []);

  // Fetch company details for a specific job post
  const fetchCompanyDetails = async (jobPostId) => {
    setIsLoadingCompany(true);
    try {
      const response = await fetch(`http://localhost:8000/api/job_posts/${jobPostId}/company/`);
      const data = await response.json();
      setCompanyDetails(data);
      setIsLoadingCompany(false);
    } catch (error) {
      console.error('Error fetching company details:', error);
      setIsLoadingCompany(false);
    }
  };

  // Open modal and fetch company details
  const handleViewClick = (jobPost) => {
    setSelectedJobPost(jobPost);
    fetchCompanyDetails(jobPost.id); // Fetch company data
    setIsModalOpen(true); // Open modal
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
    setCompanyDetails(null); // Clear company details
    setSelectedJobPost(null); // Clear selected job post
  };

  if (loading) {
    return <div className="text-center text-xl text-purple-500">Loading...</div>;
  }

  return (
    <>
      <InterpreterNavbar />
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Jobs' List</h1>

        {/* Cards for each interpreter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-40">
          {jobPosts.map((jobpost) => (
            <div
              key={jobpost.id}
              className="card w-full bg-gradient-to-r from-yellow-100 via-green-100 to-pink-100 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg border-4 border-transparent hover:border-indigo-600"
            >
              <div className="card-body p-6">
                <h2 className="card-title text-2xl font-semibold text-indigo-800 mb-4">{jobpost.job_title}</h2>

                {/* Details: Username, Email, Phone */}
                <div className="space-y-2">
                  <p className="text-lg text-gray-700">
                    <strong className="font-medium text-indigo-600">Description:</strong> {jobpost.description}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="font-medium text-indigo-600">Language Required:</strong> {jobpost.language_needed}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="font-medium text-indigo-600">Location:</strong> {jobpost.location}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="font-medium text-indigo-600">Timings:</strong> {jobpost.date_time}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="font-medium text-indigo-600">Status:</strong> {jobpost.status}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong className="font-medium text-indigo-600">Posted at:</strong> {jobpost.posted_at}
                  </p>
                </div>

                {/* View Button to open the modal */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleViewClick(jobpost)} // Show modal with details of this job post
                    className="btn btn-primary text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Company Details
                  </button>
                  <button
                    onClick={() => handleViewClick(jobpost)} // Show modal with details of this job post
                    className="btn btn-primary text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for displaying selected job post details */}
{isModalOpen && selectedJobPost && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50 transition-all ease-in-out duration-300">
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full space-y-6 animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-semibold mb-4 text-indigo-700 border-b-2 pb-2 border-indigo-300">Company Details</h3>

      {/* Show loading state while fetching company details */}
      {isLoadingCompany ? (
        <div className="text-center text-xl text-indigo-500 font-medium">Loading company details...</div>
      ) : (
        <div>
          <p className="text-3xl text-pink-800 text-center font-semibold  p-2">{companyDetails.user.username}
          </p>
          <p className="text-xl text-gray-800 ">
            <strong className="font-medium text-indigo-600">Contact Person:</strong> {companyDetails.user.first_name} {companyDetails.user.last_name}
          </p>
          
          <p className="text-xl text-gray-800">
            <strong className="font-medium text-indigo-600">Address:</strong> {companyDetails.address}
          </p>
          <p className="text-xl text-gray-800">
            <strong className="font-medium text-indigo-600">Phone:</strong> {companyDetails.phone_number}
          </p>
          <p className="text-xl text-gray-800">
            <strong className="font-medium text-indigo-600">Email:</strong> {companyDetails.user.email}
          </p>
          <p className="text-xl text-gray-800">
            <strong className="font-medium text-indigo-600">About Company:</strong> {companyDetails.about}
          </p>
        </div>
      )}

      {/* Close Button */}
      <div className="mt-6 flex justify-center">
        <button 
          onClick={handleCloseModal} 
          className="btn btn-ghost text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 px-6 py-2 rounded-full text-lg transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};
