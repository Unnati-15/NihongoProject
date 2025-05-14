import React, { useState, useEffect } from 'react';
import CompanyNavbar from "./CompanyNavbar";

export const Booking = () => {
  const [interpreters, setInterpreters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedInterpreter, setSelectedInterpreter] = useState(null);
const [jobPosts, setJobPosts] = useState([]);
const [selectedJob, setSelectedJob] = useState('');
const [notes, setNotes] = useState('');
const [message, setMessage] = useState('');
useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/job_posting/', {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setJobPosts(data);
      }
    } catch (err) {
      console.error('Error fetching job posts:', err);
    }
  };

  fetchJobs();
}, []);

  // Fetch data from the API
  useEffect(() => {
    const fetchInterpreters = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/interpreters/');
        const data = await response.json();
        setInterpreters(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching interpreters:', error);
        setLoading(false);
      }
    };

    fetchInterpreters();
  }, []);

  if (loading) {
    return <div className="text-center text-xl text-purple-500">Loading...</div>;
  }

  return (
    <>
    <CompanyNavbar/>
    <div className="p-6">
      
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Interpreters' List</h1>

      {/* Cards for each interpreter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-2xl mb-40">
        {interpreters.map((interpreter) => (
          <div key={interpreter.id} className="card w-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg border border-gray-200 hover:bg-purple-50">
            {/* <figure>
              <img
                className="w-full h-48 object-cover rounded-t-lg"
                src="https://placeimg.com/400/200/people"
                alt={`${interpreter.user.first_name} ${interpreter.user.last_name}`}
              />
            </figure> */}
            <div className="card-body p-5">
              <h2 className="card-title text-2xl font-semibold text-purple-700">
                {interpreter.user.first_name} {interpreter.user.last_name}
              </h2>

              {/* Details: Username, Email, Phone */}
              <div className="mt-3 ">
                <p className="text-xl text-gray-700">
                  <strong className="font-medium text-gray-900 ">Username:</strong> {interpreter.user.username}
                </p>
                <p className="text-xl text-gray-700">
                  <strong className="font-medium text-gray-900">Email:</strong> {interpreter.user.email}
                </p>
                <p className="text-xl text-gray-700">
                  <strong className="font-medium text-gray-900">Phone Number:</strong> {interpreter.phone_number}
                </p>
                <p className="text-xl text-gray-700">
                  <strong className="font-medium text-gray-900">Address:</strong> {interpreter.address}
                </p>
                <p className="text-xl text-gray-700">
                  <strong className="font-medium text-gray-900">Bio:</strong> {interpreter.bio}
                </p>
              </div>

              {/* Languages Section with Badges */}
              <div className="mt-3 p-4 rounded-lg bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100">
                <strong className="text-lg text-gray-900">Languages:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {interpreter.language.length > 0 ? (
                    interpreter.language.map((lang, index) => (
                      <span key={index} className="badge badge-primary text-white">{lang.language.name}</span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No languages available</span>
                  )}
                </div>
              </div>

              {/* Certifications Section with a Table */}
              <div className="mt-5">
                <strong className="text-lg text-gray-900">Certifications:</strong>
                <div className="overflow-x-auto mt-2">
                  <table className="table w-full table-auto border-separate border-spacing-0 rounded-lg shadow-lg">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Certification Name</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interpreter.certification.length > 0 ? (
                        interpreter.certification.map((cert, index) => (
                          <tr key={index} className="hover:bg-purple-50">
                            <td className="px-3 py-2 text-sm text-gray-700">{cert.certification.name}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{cert.certification.issue_date}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{cert.certification.expiry_date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-3 py-2 text-sm text-gray-500" colSpan="3">No certifications available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Availability Section with a Table */}
              <div className="mt-5">
                <strong className="text-lg text-gray-900">Availability:</strong>
                <div className="overflow-x-auto mt-2">
                  <table className="table w-full table-auto border-separate border-spacing-0 rounded-lg shadow-lg">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Day</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Start Time</th>
                        <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">End Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interpreter.availability.length > 0 ? (
                        interpreter.availability.map((avail, index) => (
                          <tr key={index} className="hover:bg-green-50">
                            <td className="px-3 py-2 text-sm text-gray-700">{avail.day_of_week}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{new Date(avail.start_time).toLocaleString()}</td>
                            <td className="px-3 py-2 text-sm text-gray-700">{new Date(avail.end_time).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-3 py-2 text-sm text-gray-500" colSpan="3">No availability</td>
                        </tr>
                      )}
                      <button
  onClick={() => {
    setSelectedInterpreter(interpreter);
    setIsModalOpen(true);
  }}
  className="mt-4 btn btn-primary w-full"
>
  Book Now
</button>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}{isModalOpen && selectedInterpreter && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
      <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700">Book Interpreter</h2>

      {message && (
        <div className="alert alert-info shadow-sm mb-4">
          <span>{message}</span>
        </div>
      )}

      <p className="mb-2"><strong>Interpreter:</strong> {selectedInterpreter.user.first_name} {selectedInterpreter.user.last_name}</p>

      <label className="block mb-2 text-sm font-medium">Select Job</label>
      <select
        value={selectedJob}
        onChange={(e) => setSelectedJob(e.target.value)}
        className="select select-bordered w-full mb-4"
      >
        <option value="">-- Select a job --</option>
        {jobPosts.map((job) => (
          <option key={job.id} value={job.id}>
            {job.job_title}
          </option>
        ))}
      </select>

      <label className="block mb-2 text-sm font-medium">Notes (optional)</label>
      <textarea
        className="textarea textarea-bordered w-full mb-4"
        rows="3"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>

      <div className="flex justify-between">
        <button
          onClick={async () => {
            if (!selectedJob) {
              setMessage("Please select a job.");
              return;
            }

            try {
              const res = await fetch('http://localhost:8000/api/bookings/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                  job_posting: selectedJob,
                  interpreter: selectedInterpreter.id,
                  status: "accepted",
                  notes: notes
                }),
              });

              if (res.ok) {
                console.log(res);
                setMessage('Interpreter booked successfully!');
                setTimeout(() => {
                  setIsModalOpen(false);
                  setSelectedJob('');
                  setNotes('');
                  setMessage('');
                }, 2000);
              } else {
                const error = await res.json();
                setMessage(error.detail || 'Failed to book.');
              }
            } catch (error) {
              setMessage('Error booking interpreter.');
              console.error(error);
            }
          }}
          className="btn btn-success"
        >
          Confirm Booking
        </button>

        <button
          onClick={() => {
            setIsModalOpen(false);
            setSelectedJob('');
            setNotes('');
            setMessage('');
          }}
          className="btn btn-outline"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div></>
  );
};

export default Booking;
