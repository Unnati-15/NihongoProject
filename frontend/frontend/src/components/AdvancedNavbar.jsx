import 'react';
import { Link } from 'react-router-dom';
import UserLogout from './UserLogout';
import { useState,useEffect } from 'react';
const AdvancedNavbar = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername); 
      }
     }, []);
     console.log(username);
  return (
    <div className=''>
      
      <div className="navbar bg-gradient-to-r size-500 h-40 from-blue-300 to-blue-500 shadow-lg text-white rounded-b-lg">
        
        <div className="flex-1">
        
           <Link to="/advanced-pages" className="btn btn-ghost text-6xl font-semibold hover:text-yellow-500 transition-all font-mono">Kantanna Nihongo</Link>
        </div>
        <button className="btn btn-success text-xl text-white rounded-full px-8 py-3 shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary-focus">
  WELCOME {username} !
</button>

        <div className="flex-none">
        <Link to="/advanced-pages"> <button className="btn btn-ghost text-2xl hover:bg-white hover:text-yellow-500 transition-all mr-4">
            Home
          </button></Link>  
          
       <Link to="/quiz"> <button className="btn btn-ghost text-2xl hover:bg-white hover:text-yellow-500 transition-all">
            Quiz
          </button></Link>  
          <Link to="/flashcard"> <button className="btn btn-ghost text-2xl hover:bg-white hover:text-yellow-500 transition-all">
            Flashcard
          </button></Link>
          <Link to="/write"> <button className="btn btn-ghost text-2xl hover:bg-white hover:text-yellow-500 transition-all">
            Write
          </button></Link>   
           
          <UserLogout/>
           
</div>
        </div>
        
      </div>
   
  )
}

export default AdvancedNavbar
