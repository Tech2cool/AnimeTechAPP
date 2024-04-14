// InternetContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const InternetContext = createContext();

export const useInternet = () => useContext(InternetContext);

export const InternetProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkInternetConnectivity = async () => {
      const state = await NetInfo.fetch();
      // console.log(state)
      setIsOnline(state.isConnected);
    };

    checkInternetConnectivity();
  }, []);

  return (
    <InternetContext.Provider value={{isOnline, setIsOnline}}>
      {children}
    </InternetContext.Provider>
  );
};
