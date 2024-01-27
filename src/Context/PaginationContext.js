import React, { createContext, useContext, useState } from 'react';

const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {
  const [myPage, setMyPage] = useState({
    currentPage: 1,
    totalPage: 1,
    availPages:[],
  });
  
    
  return (
    <PaginationContext.Provider value={{ myPage, setMyPage }}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('Invalid Pagination Context');
  }
  return context;
};
