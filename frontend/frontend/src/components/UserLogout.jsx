
import { useNavigate } from "react-router-dom";
const UserLogout = () => {
const navigate = useNavigate();
    const handleLogout = () => {
        // Clear the localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('skill_level');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        // Redirect to the login page
        navigate('/login'); 
    };

    return (
        
        <div tabIndex={0} role="button" onClick={handleLogout} className="btn btn-error text-2xl hover:bg-white hover:text-red-500 transition-all mr-4">Logout</div>
    );
    };


export default UserLogout;
