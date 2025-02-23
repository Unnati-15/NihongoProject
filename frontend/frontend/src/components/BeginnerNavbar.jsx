import 'react';
import { Link } from 'react-router-dom';
import UserLogout from './UserLogout';
import { useState,useEffect } from 'react';
const BeginnerNavbar = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
      // Check if the token is present in localStorage and retrieve the username
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername); // Set username from localStorage
      }
     }, []);
     console.log(username);
  return (
    <div className=''>
      
      <div className="navbar bg-gradient-to-r size-500 h-40 from-blue-300 to-blue-500 shadow-lg text-white rounded-b-lg">
        
        <div className="flex-1">
        
           <Link to="/beginner-pages" className="btn btn-ghost text-6xl font-semibold hover:text-yellow-500 transition-all font-mono">Kantanna Nihongo</Link>
        </div>
        <button className="btn btn-success text-xl text-white rounded-full px-8 py-3 shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary-focus">
  WELCOME {username} !
</button>

        <div className="flex-none">
        <Link to="/beginner-pages"> <button className="btn btn-ghost text-2xl hover:bg-white hover:text-yellow-500 transition-all mr-4">
            Home
          </button></Link>  
          
       <Link to="/phrases"> <button className="btn btn-ghost text-2xl hover:bg-white hover:text-yellow-500 transition-all">
            Phrases
          </button></Link>  
           
          <div className="dropdown dropdown-end">
  <div tabIndex={0} role="button" className="btn btn-ghost text-2xl hover:bg-white hover:text-yellow-500 transition-all mr-4">Learn Japanese</div>
  <ul tabIndex={0} className="dropdown-content menu bg-base-100  ">
            <li><Link to="/hiragana"> <button className="btn btn-primary text-2xl">
            Hiragana
          </button></Link>  </li>
          <li><Link to="/katakana"> <button className="btn btn-primary text-2xl">
            Katakana
          </button></Link>  </li>
          <li> <Link to="/kanji"> <button className="btn btn-primary text-2xl">
            Kanji
          </button></Link>  </li>
  </ul>
</div>
        </div>
        <UserLogout/>
      </div>
    </div>
  )
}

export default BeginnerNavbar
