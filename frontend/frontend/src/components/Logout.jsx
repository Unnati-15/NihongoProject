import axios from 'axios';

const Logout = ({ setIsAuthenticated }) => {
  // Fetch the CSRF token from the meta tag or cookies if it's required
  const getCsrfToken = () => {
    const csrfToken = document.querySelector('[name=csrf-token]')?.content;
    return csrfToken;
  };
  
  const handleLogout = async () => {
    const csrfToken = getCsrfToken();
    try {
      const response = await axios.post('http://127.0.0.1:8000/logout/', {}, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken  // Include CSRF token in the request
        }
      });
  
      if (response.status === 200) {
        setIsAuthenticated(false);
        alert('Successfully logged out');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed');
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
