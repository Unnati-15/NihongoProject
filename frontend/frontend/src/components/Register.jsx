import { useState } from 'react';
import axios from 'axios';

function Register() {
    const [first_name, setFirstName] = useState(''); 
    const [last_name, setLastName] = useState(''); 
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/registerusers/', {
                first_name,
                last_name,
                email,
                username,
                password,
                role,
            });
            console.log('User registered:', response.data);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Firstname"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Lastname"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <select onChange={(e) => setRole(e.target.value)}>
                <option value="Learner">Learner</option>
                <option value="Interpreter">Interpreter</option>
                <option value="Company">Company</option>
            </select>
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
