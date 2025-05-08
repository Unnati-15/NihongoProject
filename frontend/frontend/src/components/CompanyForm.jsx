import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const CompanyForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('company');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
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
      about 
      
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      setSubmissionStatus('Please fill out all required fields.');
      return;
    }
  
    const companyData = {
      user: {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        role: 'company',
        password: password,
      },
      phone_number: phoneNumber,
      address: address,
      about: about,
      
      }
  
  
    axios
      .post('http://localhost:8000/api/auth/register/company/', companyData)
      .then((response) => {
        if (response.status === 201) {
          toast.success('Company registered successfully!', {
            position: "top-right",
            autoClose: 3000,
          });
          setSuccessMessage('Company registered successfully!');
          setErrorMessage(''); // Clear any previous error messages
          setTimeout(() => {
            navigate('/login'); // Redirect after 2 seconds
          }, 2000);
        }
        setSubmissionStatus('Company created successfully!');
        console.log('Comapny created successfully:', response.data);
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
          setSubmissionStatus('Error creating company');
          console.error('Error creating company:', error);
        }
      });
  };
  

  return (
    <div className="flex items-center justify-center mb-40">
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-16 bg-yellow-100 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-4">Company Registration</h2>
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
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              required
              className="textarea textarea-bordered w-full h-32"
    placeholder="Write in brief about company, rules, and policies."
    
            />
          </div>

          <button
            type="submit"
            disabled={!validateForm()}
            className="btn btn-primary w-full py-2 mt-4 text-white font-semibold"
          >
            Register
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

export default CompanyForm;