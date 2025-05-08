import React, { useState, useEffect } from "react";
import InterpreterNavbar from "./InterpreterNavbar";

const InterpreterProfile = () => {
  const [interpreterData, setInterpreterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [updatedData, setUpdatedData] = useState({
    language: [], // Initialize language as an empty array
    certification: [], // Initialize certification as an empty array
    availability: [], // Initialize availability as an empty array
  }); // State to store updated data
  const [newLanguageName, setNewLanguageName] = useState('');
  const [newCertificationName,setNewCertificationName] = useState('');
  const [issuingOrganization, setIssuingOrganization] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const fetchInterpreterData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/interpreter/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Interpreter Data:', data); // Log the response data
        setInterpreterData(data);
        setUpdatedData((prev) => ({
          ...prev,
          language: data.language || [],
          certification: data.certification || [],
          availability: data.availability || [],
        }));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterpreterData();
  }, []);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLanguage = async (interpreterId) => {
    if (!newLanguageName.trim()) {
      alert('Please enter a valid language name');
      return;
    }

    try {
      const newLanguage = { name: newLanguageName };
      const response = await fetch(`http://localhost:8000/api/interpreter/${interpreterId}/add_language/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newLanguage),
      });

      if (!response.ok) {
        throw new Error('Failed to add language');
      }

      const addedLanguage = await response.json();
      console.log('Added Language:', addedLanguage); 
      setUpdatedData((prev) => ({
        ...prev,
        language: [...prev.language, addedLanguage],
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddCertificate = async (interpreterId) => {
    if (!newCertificationName.trim()) {
      alert('Please enter a valid certification name');
      return;
    }

    try {
      const newCertification = { name: newCertificationName, issuing_organization: issuingOrganization, issue_date : issueDate ,expiry_date:expiryDate };
      const response = await fetch(`http://localhost:8000/api/interpreter/${interpreterId}/add_certificate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newCertification),
      });

      if (!response.ok) {
        throw new Error('Failed to add certification');
      }

      const addedCertification = await response.json();
      console.log('Added Certification:', addedCertification); 
      setUpdatedData((prev) => ({
        ...prev,
        certification: [...prev.certification, addedCertification],
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddAvailability = async (interpreterId) => {
    if (!dayOfWeek || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const newAvailability = { day_of_week:dayOfWeek,start_time:startTime,end_time:endTime };
      const response = await fetch(`http://localhost:8000/api/interpreter/${interpreterId}/add_availability/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newAvailability),
      });

      if (!response.ok) {
        throw new Error('Failed to add availability');
      }

      const addedAvailability = await response.json();
      console.log('Added Availability:', addedAvailability); 
      setUpdatedData((prev) => ({
        ...prev,
        availability: [...prev.availability, addedAvailability],
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveChanges = async (interpreterId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/interpreter-update/${interpreterId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Failed to update data');
      }
      const data = await response.json();
      setInterpreterData(data);
      setEditMode(false); 
      // Re-fetch the data to ensure we have the updated info
      const fetchInterpreterData = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/interpreter/', {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch updated data');
          }
          const data = await response.json();
          setInterpreterData(data); // Update the state with new data
        } catch (error) {
          setError(error.message);
        }
      };

      fetchInterpreterData();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="text-center py-4 text-xl text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-4 text-xl text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-green-100 mb-16">
      <InterpreterNavbar />
      <div className="container mx-auto p-8">
        {interpreterData && interpreterData.length > 0 && interpreterData.map((interpreter) => (
          <div key={interpreter.id} className="card bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-center">
              {editMode ? (
                <input
                  type="text"
                  name="first_name"
                  value={updatedData.first_name || interpreter.user.first_name}
                  onChange={handleChange}
                  className="input input-bordered w-full mb-2 text-xl"
                />
              ) : (
                `${interpreter.user.first_name} ${interpreter.user.last_name} (${interpreter.user.username})`
              )}
            </h2>

            <table className="table-auto w-full border-separate border-spacing-2">
              <tbody>
                <tr>
                  <td className="font-semibold text-xl">Email</td>
                  <td>{editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={updatedData.email || interpreter.user.email}
                      onChange={handleChange}
                      className="input input-bordered w-full text-xl"
                    />
                  ) : (
                    interpreter.user.email
                  )}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-xl">Phone</td>
                  <td>{editMode ? (
                    <input
                      type="text"
                      name="phone_number"
                      value={updatedData.phone_number || interpreter.phone_number}
                      onChange={handleChange}
                      className="input input-bordered w-full text-xl"
                    />
                  ) : (
                    interpreter.phone_number
                  )}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-xl">Address</td>
                  <td>{editMode ? (
                    <input
                      type="text"
                      name="address"
                      value={updatedData.address || interpreter.address}
                      onChange={handleChange}
                      className="input input-bordered w-full text-xl"
                    />
                  ) : (
                    interpreter.address
                  )}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-xl">Bio</td>
                  <td>{editMode ? (
                    <textarea
                      name="bio"
                      value={updatedData.bio || interpreter.bio}
                      onChange={handleChange}
                      className="textarea textarea-bordered w-full text-xl"
                    />
                  ) : (
                    interpreter.bio
                  )}</td>
                </tr>

                {/* Languages Section */}
                <tr>
                  <td className="font-semibold text-xl">Languages</td>
                  <td>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={newLanguageName}
                          onChange={(e) => setNewLanguageName(e.target.value)}
                          placeholder="Enter new language"
                          className="input input-bordered w-full text-xl"
                        />
                        <button
                          onClick={() => handleAddLanguage(interpreter.id)}
                          className="btn btn-primary mt-2 text-lg"
                        >
                          Add Language
                        </button>
                      </>
                    ) : (
                      (interpreter.language || []).map((lang) => lang.language.name).join(', ') || "No languages available"
                    )}
                  </td>
                </tr>

                {/* Certifications Section */}
                <tr>
                  <td className="font-semibold text-xl">Certifications</td>
                  <td>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={newCertificationName}
                          onChange={(e) => setNewCertificationName(e.target.value)}
                          className="input input-bordered w-full text-xl"
                          placeholder="Certification Name"
                        />
                        <input
                          type="text"
                          value={issuingOrganization}
                          onChange={(e) => setIssuingOrganization(e.target.value)}
                          className="input input-bordered w-full text-xl"
                          placeholder="Issuing Organization"
                        />
                        <input
                          type="date"
                          value={issueDate}
                          onChange={(e) => setIssueDate(e.target.value)}
                          className="input input-bordered w-full text-xl"
                        />
                        <input
                          type="date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="input input-bordered w-full text-xl"
                        />
                        <button
                          onClick={() => handleAddCertificate(interpreter.id)}
                          className="btn btn-primary mt-2 text-lg"
                        >
                          Add Certification
                        </button>
                      </>
                    ) : (
                      <table className="table w-full border-collapse border border-gray-200">
                        <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <tr>
                            <th className="border-b py-2 text-left">Certification Name</th>
                            <th className="border-b py-2 text-left">Issuing Organization</th>
                            <th className="border-b py-2 text-left">Issue Date</th>
                            <th className="border-b py-2 text-left">Expiry Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {interpreter.certification.map((cert, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td className="border-b py-2">{cert.certification.name}</td>
                              <td className="border-b py-2">{cert.certification.issuing_organization}</td>
                              <td className="border-b py-2">{cert.certification.issue_date}</td>
                              <td className="border-b py-2">{cert.certification.expiry_date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>

                {/* Availability Section */}
                <tr>
                  <td className="font-semibold text-xl">Availability</td>
                  <td>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={dayOfWeek}
                          onChange={(e) => setDayOfWeek(e.target.value)}
                          className="input input-bordered w-full text-xl"
                          placeholder="Day of Week"
                        />
                        <input
                          type="datetime-local"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="input input-bordered w-full text-xl"
                        />
                        <input
                          type="datetime-local"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="input input-bordered w-full text-xl"
                        />
                        <button
                          onClick={() => handleAddAvailability(interpreter.id)}
                          className="btn btn-primary mt-2 text-lg"
                        >
                          Add Availability
                        </button>
                      </>
                    ) : (
                      <table className="table w-full border-collapse border border-gray-200">
                        <thead className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                          <tr>
                            <th className="border-b py-2 text-left">DayOfWeek</th>
                            <th className="border-b py-2 text-left">StartDateTime</th>
                            <th className="border-b py-2 text-left">EndDateTime</th>
                          </tr>
                        </thead>
                        <tbody>
                          {interpreter.availability.map((slot, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td className="border-b py-2">{slot.day_of_week}</td>
                              <td className="border-b py-2">{slot.start_time}</td>
                              <td className="border-b py-2">{slot.end_time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mb-4">
              <button
                onClick={handleEditClick}
                className={`btn btn-primary text-xl ${editMode ? 'btn-secondary' : ''}`}
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
              {editMode && (
                <button
                  onClick={() => handleSaveChanges(interpreter.id)}
                  className="btn btn-success ml-4 text-xl"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterpreterProfile;
