import { createContext, useState } from "react";

export const CredentialContext = createContext();

export const StoreContext = ({ children }) => {
  const [user, setUser] = useState();
  const [cinemaObj, setCinemaObj] = useState([]);
  const [lists, setLists] = useState([]);
  const cinemaList = [];

  return (
    <CredentialContext.Provider
      value={{
        user,
        cinemaList,
        setUser,
        cinemaObj,
        setCinemaObj,
        lists,
        setLists
      }}
    >
      {children}
    </CredentialContext.Provider>
  );
};
