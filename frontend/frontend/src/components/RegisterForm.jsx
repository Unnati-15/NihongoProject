import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();  // Use the hook to handle navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent to the backend
    const data = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      password1,
      password2,
    };

    try {
      // Send POST request to the Django backend API
      const response = await axios.post('http://localhost:8000/register/', data);
      console.log(response.data);

      // If registration is successful, show success message and redirect
      setSuccessMessage('Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');  // Redirect after 3 seconds
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);  // Handle validation errors from Django backend
      }
    }
  };

  return (
    <form
      className="max-w-sm mx-auto w-full text-xl mt-10 mb-10 p-6 border-2 border-gray-300 rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <div className="mb-5">
        <label
          htmlFor="first-name"
          className="block mb-2 font-medium text-gray-900 dark:text-white text-xl"
        >
          First Name
        </label>
        <input
          type="text"
          id="first-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="John"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="last-name"
          className="block mb-2 font-medium text-gray-900 dark:text-white text-xl"
        >
          Last Name
        </label>
        <input
          type="text"
          id="last-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="Doe"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="username"
          className="block mb-2 font-medium text-gray-900 dark:text-white text-xl"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="username123"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 font-medium text-gray-900 dark:text-white text-xl"
        >
          Your email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="email@gmail.com"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
        >
          Your password
        </label>
        <input
          type="password"
          id="password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="*********"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="repeat-password"
          className="block mb-2 text-xl font-medium text-gray-900 dark:text-white"
        >
          Repeat password
        </label>
        <input
          type="password"
          id="repeat-password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="shadow-sm bg-gray-50 border border-gray-300 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="*********"
          required
        />
      </div>

      <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            required
          />
        </div>
        <label htmlFor="terms" className="ml-2 text-xl font-medium text-gray-900 dark:text-gray-300">
          I agree with the{' '}
          <a href="#" className="text-blue-600 text-xl hover:underline dark:text-blue-500">
            terms and conditions
          </a>
        </label>
      </div>

      {error && (
        <div className="text-red-600 mb-4 text-xl">
          {error.message || 'There was an error with registration.'}
        </div>
      )}

      {successMessage && (
        <div className="text-green-600 mb-4 text-xl">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        className="text-xl text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Register
      </button>

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
  );
};

export default RegisterForm;
