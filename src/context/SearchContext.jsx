import { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [location, setLocation] = useState("Chennai");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider value={{ location, setLocation, searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};