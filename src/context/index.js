import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const login = userData => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);

    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const updateImage = status => {
    setUser({...user, image: status});
  };

  return (
    <AuthContext.Provider value={{user, login, logout, updateImage}}>
      {children}
    </AuthContext.Provider>
  );
};
