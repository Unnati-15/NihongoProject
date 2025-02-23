// UserContext.js
import  { createContext, useState, useContext } from 'react';

// Create a context
const UserContext = createContext();

// Custom hook to use the context
export const useUserContext = () => {
  return useContext(UserContext);  // This will be used to access user data
};

// The provider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    username: '',
    skill_level: '',
    token: '',
  });

  const setUser = (data) => {
    setUserData(data); // This updates the user data globally
  };

  return (
    <UserContext.Provider value={{ userData, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
