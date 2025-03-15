import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const UserLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login/', {
                username,
                password,
            });

            console.log(username);
            console.log(password);
            
            // Extract token and skill level from the response
            const { token, role, skill_level } = response.data;

            // Save token and skill level in localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);
            localStorage.setItem('skill_level', skill_level);
            localStorage.setItem('role', role);  // Storing role as well

            // Notify success
            toast.success('Login successful!', {
                position: "top-right",
                autoClose: 3000,
            });

            setSuccessMessage('Login successful! Redirecting...');
            setTimeout(() => {
                switch (role) {
                    case 'learner':
                        if (skill_level === 'beginner') {
                            navigate('/beginner-pages');
                        } else if (skill_level === 'advanced') {
                            navigate('/advanced-pages');
                        }
                        break;
                    case 'interpreter':
                        navigate('/');
                        break;
                    case 'company':
                        navigate('/');
                        break;
                    default:
                        navigate('/');
                        break;
                }
            }, 3000);  // Delay redirect after success notification
        } catch (error) {
            setError('Invalid credentials');
            // Notify error
            toast.error('Invalid credentials', {
                position: "top-right",
                autoClose: 3000,
            });
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center mt-40">
        <ToastContainer />
            <div className="card w-96 bg-white shadow-xl p-8">
                <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input  text-lg input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input text-lg input-bordered w-full"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-4 text-lg">
                        Login
                    </button>
                </form>
                {/* {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>} */}
                <p className="text-center mt-4">
                    <span>Do not have an account?</span>
                    <Link to="/register" className="text-blue-500 ml-1 text-lg">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default UserLogin;
