import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory for redirection
import {Link} from 'react-router-dom'
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Hook for redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8000/login/', {
        username,
        password,
      });
      console.log(username);
      console.log(password);
      
      
      if (response.status === 200) {
        setSuccessMessage('Login successful! Redirecting...');
        // Redirect to phrases page after a short delay to show the success message
        setTimeout(() => {
          navigate('/phrases');
        }, 2000); // Redirect after 2 seconds to show the message
      }
    } catch (error) {
      setError('Invalid credentials');
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-8 mb-8 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto w-full text-xl mt-10 mb-10 p-6 border-2 border-gray-300 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block  font-medium  mb-2  text-gray-900 dark:text-white text-xl">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter your username"
              disabled={loading} // Disable input when loading
            />
          </div>
          <div className="mb-4">
            <label className="block  font-medium  mb-2  text-gray-900 dark:text-white text-xl">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter your password"
              disabled={loading} // Disable input when loading
            />
          </div>
          
          {/* Display success message */}
          {successMessage && (
            <div className="text-green-500 text-sm mb-4">{successMessage}</div>
          )}
          
          {/* Display error message */}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          
          {/* Display loading spinner */}
          {loading ? (
            <div className="flex justify-center items-center">
              <button type="button" className="btn btn-disabled loading">
                Logging in...
              </button>
            </div>
          ) : (<>
            <button type="submit" className="text-xl text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Login
            </button>
            
      <div className="text-center mt-4">
      <p className="text-gray-700 text-lg">
        Does not have an account?{' '}
        <Link
          to="/register"
          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          Register
        </Link>
      </p>
    </div></>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
