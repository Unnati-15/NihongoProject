import { useState } from 'react';
import axios from 'axios';
import { useNavigate , Link} from 'react-router-dom';
const LearnerRegistration = () => {
    const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    skill_level: '',
    role: 'learner',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/learner/', {
        user: {
          email: formData.email,
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
          role: formData.role,
        },
        skill_level: formData.skill_level,
      });

      if (response.status === 201) {
        setSuccessMessage('Learner registered successfully!');
        setErrorMessage('');
        setTimeout(() => {
            navigate('/login');  // Redirect after 3 seconds
          }, 2000);
      }
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(error.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen  items-center justify-center">
  <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg overflow-auto">
    <h2 className="text-3xl font-bold text-center mb-6">Learner Registration</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-lg font-medium">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-lg font-medium">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-lg font-medium">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label htmlFor="first_name" className="block text-lg font-medium">First Name</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label htmlFor="last_name" className="block text-lg font-medium">Last Name</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      <div className="hidden">
        <label htmlFor="role" className="block text-lg font-medium">Role</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="learner">Learner</option>
        </select>
      </div>

      <div>
        <label htmlFor="skill_level" className="block text-lg font-medium">Skill Level</label>
        <select
          id="skill_level"
          name="skill_level"
          value={formData.skill_level}
          onChange={handleChange}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select Skill Level</option>
          <option value="beginner">Beginner</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full py-2 mt-4 text-white font-semibold"
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
    {errorMessage && (
        <div className="mt-4 text-center text-red-600">
          <p>{errorMessage}</p>
        </div>
      )}
      {successMessage && (
        <div className="mt-4 text-center text-green-600">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  </div>



      
  );
};

export default LearnerRegistration;
