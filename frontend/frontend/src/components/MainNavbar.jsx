import 'react';
import { Link } from 'react-router-dom';
const MainNavbar = () => {
  return (
    <div className=''>
      <div className="navbar bg-gradient-to-r size-500 h-40 from-blue-300 to-blue-500 shadow-lg text-white rounded-b-lg">
        <div className="flex-1">
           <Link to="/" className="btn btn-ghost text-6xl font-semibold hover:text-yellow-500 transition-all font-mono">Kantanna Nihongo</Link>
        </div>
        <div className="flex-none">
        <Link to="/"> <button className="btn btn-ghost text-2xl hover:bg-white hover:text-yellow-500 transition-all mr-4">
            Home
          </button></Link>  
          <Link to="/translate">  <button className="btn btn-ghost text-2xl hover:bg-white hover:text-yellow-500 transition-all mr-4">
            Translation
          </button></Link>  
          <Link to="/resources"> <button className="btn btn-ghost text-2xl hover:bg-white hover:text-yellow-500 transition-all">
            Study Material
          </button></Link> 
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
