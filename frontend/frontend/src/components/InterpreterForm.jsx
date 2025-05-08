import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const InterpreterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('interpreter');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [languages, setLanguages] = useState([{ name: '' }]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [certifications, setCertifications] = useState([{ name: '', issuing_organization: '', issue_date: '', expiry_date: '' }]);
  const [availability, setAvailability] = useState([{ day_of_week: '', start_time: '', end_time: '' }]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch languages from the database when the component mounts
    axios
      .get('http://localhost:8000/api/languages') // Replace with your actual endpoint for fetching languages
      .then((response) => {
        setAvailableLanguages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching languages:', error);
      });
  }, []); // Empty dependency array ensures this runs only once

  const handleAddCertification = () => {
    setCertifications([...certifications, { name: '', issuing_organization: '', issue_date: '', expiry_date: '' }]);
  };

  const handleCertificationChange = (index, e) => {
    const newCertifications = [...certifications];
    newCertifications[index][e.target.name] = e.target.value;
    setCertifications(newCertifications);
  };

  const handleAddLanguage = () => {
    setLanguages([...languages, { name: '' }]);
  };

  const handleLanguageChange = (index, e) => {
    const newLanguages = [...languages];
    newLanguages[index][e.target.name] = e.target.value;
    setLanguages(newLanguages);

    // Filter the available languages based on the user input
    if (e.target.value) {
      setFilteredLanguages(
        availableLanguages.filter((lang) =>
          lang.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setFilteredLanguages([]);
    }
  };

  const handleAvailabilityChange = (index, e) => {
    const newAvailability = [...availability];
    newAvailability[index][e.target.name] = e.target.value;
    setAvailability(newAvailability);
  };

  const handleAddAvailability = () => {
    setAvailability([...availability, { day_of_week: '', start_time: '', end_time: '' }]);
  };

  const validateForm = () => {
    
    
    return (
      firstName &&
      lastName &&
      username &&
      email &&
      role &&
      password &&
      phoneNumber &&
      address &&
      bio &&
      dob &&
      languages.every(lang => lang.name) &&
      certifications.every(cert => cert.name && cert.issuing_organization && cert.issue_date && cert.expiry_date) &&
      availability.every(avail => avail.day_of_week && avail.start_time && avail.end_time)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      setSubmissionStatus('Please fill out all required fields.');
      return;
    }
  
    const interpreterData = {
      user: {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        role: 'interpreter',
        password: password,
      },
      phone_number: phoneNumber,
      address: address,
      bio: bio,
      date_of_birth: dob,
      language: languages.map(lang => ({ language: { name: lang.name } })),
      certification: certifications.map(cert => ({
        certification: {
          name: cert.name,
          issuing_organization: cert.issuing_organization,
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date,
        },
      })),
      availability: availability.map(avail => ({
        day_of_week: avail.day_of_week,
        start_time: avail.start_time,
        end_time: avail.end_time,
      })),
    };
  
    axios
      .post('http://localhost:8000/api/auth/register/interpreter/', interpreterData)
      .then((response) => {
        if (response.status === 201) {
          toast.success('Interpreter registered successfully!', {
            position: "top-right",
            autoClose: 3000,
          });
          setSuccessMessage('Interpreter registered successfully!');
          setErrorMessage(''); // Clear any previous error messages
          setTimeout(() => {
            navigate('/login'); // Redirect after 2 seconds
          }, 2000);
        }
        setSubmissionStatus('Interpreter created successfully!');
        console.log('Interpreter created successfully:', response.data);
      })
      .catch((error) => {
        setSuccessMessage('');
        if (error.response && error.response.data && error.response.data.user) {
          // Check if the error contains a specific message for the username
          if (error.response.data.user.username) {
            // Display the username-specific error message via toast
            toast.error(`Error: ${error.response.data.user.username}`, {
              position: "top-right",
              autoClose: 3000,
            });
  
            // Display the same error message below the username field
            setErrorMessage(error.response.data.user.username); // Username already exists
          }
        } else {
          toast.error('Registration failed', {
            position: "top-right",
            autoClose: 3000,
          });
          setSubmissionStatus('Error creating interpreter');
          console.error('Error creating interpreter:', error);
        }
      });
  };
  

  return (
    <div className="flex items-center justify-center mb-40">
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-16 bg-yellow-100 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Interpreter Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="first_name" className="block text-lg font-medium">First Name</label>
              <input
                type="text"
                id="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="last_name" className="block text-lg font-medium">Last Name</label>
              <input
                type="text"
                id="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="username" className="block text-lg font-medium">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input input-bordered w-full"
              />
              
            </div>
            <div className="w-1/2">
              <label htmlFor="email" className="block text-lg font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
          </div>


          <div className="hidden">
            <label htmlFor="role" className="block text-lg font-medium">Role</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="learner">Learner</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="password" className="block text-lg font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="phone_number" className="block text-lg font-medium">Phone Number</label>
              <input
                type="text"
                id="phone_number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-lg font-medium">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-lg font-medium">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              className="textarea textarea-bordered w-full h-32"
    placeholder="Write a brief bio about yourself, your experience, and your specialization."
    
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-lg font-medium">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="languages" className="block text-lg font-medium">Languages</label>
            {languages.map((lang, index) => (
              <div key={index}>
                <input
                  type="text"
                  name="name"
                  value={lang.name}
                  onChange={(e) => handleLanguageChange(index, e)}
                  required
                  className="input input-bordered w-full mb-2"
                  placeholder="Start typing language"
                />
                {/* Display filtered suggestions if available */}
                {filteredLanguages.length > 0 && (
                  <ul className="mt-2 border rounded-md bg-white absolute z-10 w-full max-h-40 overflow-auto">
                    {filteredLanguages.map((lang, i) => (
                      <li
                        key={i}
                        className="p-2 cursor-pointer hover:bg-yellow-100"
                        onClick={() => {
                          const newLanguages = [...languages];
                          newLanguages[index].name = lang.name;
                          setLanguages(newLanguages);
                          setFilteredLanguages([]); // Clear suggestions after selection
                        }}
                      >
                        {lang.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLanguage}
              className="btn btn-primary w-full py-2 mt-4 text-white font-semibold"
            >
              Add Another Language
            </button>
          </div>

          <div>
            <label htmlFor="certifications" className="block text-lg font-medium">Certifications</label>
            {certifications.map((cert, index) => (
              <div key={index}>
                <input
                  type="text"
                  name="name"
                  value={cert.name}
                  onChange={(e) => handleCertificationChange(index, e)}
                  required
                  className="input input-bordered w-full mb-2"
                  placeholder="Certification Name"
                />
                <input
                  type="text"
                  name="issuing_organization"
                  value={cert.issuing_organization}
                  onChange={(e) => handleCertificationChange(index, e)}
                  required
                  className="input input-bordered w-full mb-2"
                  placeholder="Issuing Organization"
                />
                <input
                  type="date"
                  name="issue_date"
                  value={cert.issue_date}
                  onChange={(e) => handleCertificationChange(index, e)}
                  required
                  className="input input-bordered w-full mb-2"
                  placeholder="Issue Date"
                />
                <input
                  type="date"
                  name="expiry_date"
                  value={cert.expiry_date}
                  onChange={(e) => handleCertificationChange(index, e)}
                  required
                  className="input input-bordered w-full mb-2"
                  placeholder="Expiry Date"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCertification}
              className="btn btn-primary w-full py-2 mt-4 text-white font-semibold"
            >
              Add Another Certification
            </button>
          </div>

          <div>
            <label htmlFor="availability" className="block text-lg font-medium">Availability</label>
            {availability.map((avail, index) => (
              <div key={index}>
                <input
                  type="text"
                  name="day_of_week"
                  value={avail.day_of_week}
                  onChange={(e) => handleAvailabilityChange(index, e)}
                  required
                  className="input input-bordered w-full mb-2"
                  placeholder="Day of the Week"
                />
                <input
                  type="datetime-local"
                  name="start_time"
                  value={avail.start_time}
                  onChange={(e) => handleAvailabilityChange(index, e)}
                  required
                  className="input input-bordered w-full mb-2"
                />
                <input
                  type="datetime-local"
                  name="end_time"
                  value={avail.end_time}
                  onChange={(e) => handleAvailabilityChange(index, e)}
                  required
                  className="input input-bordered w-full mb-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAvailability}
              className="btn btn-primary w-full py-2 mt-4 text-white font-semibold"
            >
              Add Another Availability Slot
            </button>
          </div>

          <button
            type="submit"
            disabled={!validateForm()}
            className="btn btn-primary w-full py-2 mt-4 text-white font-semibold"
          >
            Submit
          </button>

          {submissionStatus && <div className="mt-4 text-center">{submissionStatus}</div>}
          <div className="text-center mt-4">
            <p className="text-gray-700 text-lg">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterpreterForm;